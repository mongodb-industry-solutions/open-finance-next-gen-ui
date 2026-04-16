"use client";

import { useUser } from "@/lib/context/UserContext";
import { marked } from "marked";
import { useCallback, useEffect, useRef, useState } from "react";
import { chatStream } from "./client";

marked.setOptions({ breaks: true, gfm: true });

// Module-level dedup: shared across all useChatbot instances
const _seenBroadcastIds = new Set();

const WELCOME_MESSAGE =
  "Hi there! I'm your Open Finance assistant. I can help you connect bank accounts, view transactions, and analyze your financial data. How can I help you today?";

export function useChatbot() {
  const {
    selectedUser,
    profile,
    addConsent,
    updateBearerToken,
    chatMessages,
    setChatMessages,
    chatThreadId,
    setChatThreadId,
  } = useUser();

  // Local UI state
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [waitingForBankLogin, setWaitingForBankLogin] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  // Derive messages from context, falling back to welcome message for fresh sessions
  const messages = chatMessages || [
    { type: "assistant", text: WELCOME_MESSAGE },
  ];
  const setMessages = setChatMessages;
  const threadId = chatThreadId;
  const setThreadId = setChatThreadId;
  const showSuggestions = !chatMessages || suggestions?.length > 0;

  // SSE event state
  const [stepIndicator, setStepIndicator] = useState(null);
  const [interrupt, setInterrupt] = useState(null);

  // Ref tracking thread ID for use inside event handlers
  const threadIdRef = useRef(chatThreadId);

  // Ref tracking accumulated step details across SSE events.
  // Using a ref avoids closure staleness in processSSEStream (memoized with []).
  const pendingDetailsRef = useRef([]);

  // Dedup uses module-level _seenBroadcastIds (shared across hook instances)

  // --- BroadcastChannel: listen for consent completion from bank-login tab ---
  useEffect(() => {
    const channel = new BroadcastChannel("leafy-bank-consent");

    channel.onmessage = (event) => {
      const {
        type,
        _broadcastId,
        response,
        suggestions: broadcastSuggestions,
        consentId,
        institution,
        bearerToken,
      } = event.data;

      if (type === "consent_complete") {
        // These run in every instance (UI state, context updates)
        setWaitingForBankLogin(false);
        setSending(false);
        if (broadcastSuggestions?.length > 0)
          setSuggestions(broadcastSuggestions);
        if (bearerToken) updateBearerToken(bearerToken);
        if (consentId) addConsent(consentId, "authorized", institution);

        // Only one instance adds the message to avoid duplicates
        // Only one instance adds the message (StrictMode creates two listeners in dev)
        if (_broadcastId && _seenBroadcastIds.has(_broadcastId)) return;
        if (_broadcastId) _seenBroadcastIds.add(_broadcastId);

        if (response) {
          setMessages((prev) => [
            ...(prev || []),
            { type: "assistant", text: response },
          ]);
        }
      } else if (type === "consent_declined") {
        // User declined consent in the bank-login tab — unblock the chatbot
        setWaitingForBankLogin(false);
        setSending(false);

        if (_broadcastId && _seenBroadcastIds.has(_broadcastId)) return;
        if (_broadcastId) _seenBroadcastIds.add(_broadcastId);

        if (response) {
          setMessages((prev) => [
            ...(prev || []),
            { type: "assistant", text: response },
          ]);
        }
        if (broadcastSuggestions?.length > 0)
          setSuggestions(broadcastSuggestions);
      }
    };

    return () => channel.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Helpers ---

  /**
   * Finalize the current step indicator: save accumulated details as a
   * "steps" message in the conversation, then clear the indicator.
   * Optionally appends additional messages (e.g. the response).
   */
  function finalizeSteps(extraMessages = []) {
    const saved = [...pendingDetailsRef.current];
    pendingDetailsRef.current = [];
    const newMsgs = [];
    if (saved.length > 0) {
      newMsgs.push({ type: "steps", details: saved });
    }
    newMsgs.push(...extraMessages);
    if (newMsgs.length > 0) {
      setMessages((prev) => [...prev, ...newMsgs]);
    }
    setStepIndicator(null);
  }

  // --- SSE Stream Processing ---

  const processSSEStream = useCallback(
    async (response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop();

          for (const part of parts) {
            for (const line of part.split("\n")) {
              if (line.startsWith("data: ")) {
                try {
                  const event = JSON.parse(line.slice(6));
                  handleSSEEvent(event);
                } catch {
                  // skip malformed events
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function handleSSEEvent(event) {
    const { type, payload } = event;

    switch (type) {
      case "thread_id":
        setThreadId(payload.thread_id);
        threadIdRef.current = payload.thread_id;
        break;

      case "status":
        setStepIndicator((prev) => ({
          text: payload.message,
          details: prev?.details || pendingDetailsRef.current,
        }));
        break;

      case "tool_call": {
        const detail = {
          kind: "tool",
          tool: payload.tool,
          agent: payload.agent,
          args: payload.args,
          mongodbFeature: payload.mongodb_feature || null,
          status: "pending",
        };
        pendingDetailsRef.current = [...pendingDetailsRef.current, detail];
        const agentPrefix1 = payload.agent_display
          ? `${payload.agent_display}: `
          : "";
        setStepIndicator({
          text: `${agentPrefix1}Calling ${payload.tool}()...`,
          details: [...pendingDetailsRef.current],
        });
        break;
      }

      case "tool_result": {
        pendingDetailsRef.current = pendingDetailsRef.current.map((d) =>
          d.kind === "tool" && d.tool === payload.tool && d.status === "pending"
            ? { ...d, status: "done", summary: payload.summary }
            : d,
        );
        const agentPrefix2 = payload.agent_display
          ? `${payload.agent_display}: `
          : "";
        setStepIndicator((prev) => ({
          ...prev,
          text: `${agentPrefix2}${payload.tool}() completed`,
          details: [...pendingDetailsRef.current],
        }));
        break;
      }

      case "progress": {
        // Progress events from get_stream_writer() inside tools.
        // Two sub-cases: message = start/new sub-step, output only = complete existing step.
        if (payload.message) {
          const detail = {
            kind: "progress",
            step: payload.step,
            message: payload.message,
            input: payload.input,
            mongodbFeature: payload.mongodb_feature || null,
            status: "pending",
          };
          pendingDetailsRef.current = [...pendingDetailsRef.current, detail];
          setStepIndicator((prev) => ({
            ...prev,
            text: payload.message,
            details: [...pendingDetailsRef.current],
          }));
        } else if (payload.output && payload.step) {
          pendingDetailsRef.current = pendingDetailsRef.current.map((d) =>
            d.kind === "progress" &&
            d.step === payload.step &&
            d.status === "pending"
              ? { ...d, status: "done", output: payload.output }
              : d,
          );
          setStepIndicator((prev) => ({
            ...prev,
            details: [...pendingDetailsRef.current],
          }));
        }
        break;
      }

      case "agent_complete":
        setStepIndicator((prev) =>
          prev
            ? {
                ...prev,
                text: `${payload.agent_display || payload.agent} finished`,
              }
            : null,
        );
        break;

      case "response":
        setSuggestions(null);
        // Finalize steps + add the response message
        finalizeSteps([{ type: "assistant", text: payload.text }]);
        break;

      case "suggestions":
        setSuggestions(payload.items);
        break;

      case "interrupt": {
        // Finalize steps before handling the interrupt
        const saved = [...pendingDetailsRef.current];
        pendingDetailsRef.current = [];
        if (saved.length > 0) {
          setMessages((prev) => [...prev, { type: "steps", details: saved }]);
        }
        setStepIndicator(null);

        if (payload.type === "BANK_LOGIN" && threadIdRef.current) {
          // Open bank login in a NEW TAB — keeps chatbot modal + state alive
          const params = new URLSearchParams({
            consent_id: payload.consent_id || "",
            institution_name: payload.institution_name || "",
            thread_id: threadIdRef.current,
          });
          setWaitingForBankLogin(true);
          window.open(`/bank-login?${params.toString()}`, "_blank");
        } else {
          setInterrupt(payload);
        }
        break;
      }

      case "error":
        pendingDetailsRef.current = [];
        setStepIndicator(null);
        setMessages((prev) => [
          ...prev,
          { type: "error", text: payload.message },
        ]);
        break;

      case "done":
        // Finalize any remaining steps (e.g. if no response event was sent)
        finalizeSteps();
        break;
    }
  }

  // --- Send Message ---

  async function handleSend(overrideText) {
    const text = overrideText || inputValue.trim();
    if (!text || sending) return;
    if (!selectedUser?.name) return;

    setMessages((prev) => [
      ...(prev || [{ type: "assistant", text: WELCOME_MESSAGE }]),
      { type: "user", text },
    ]);
    setInputValue("");
    setSuggestions(null);
    pendingDetailsRef.current = [];
    setSending(true);
    setStepIndicator({ text: "Thinking...", details: [] });

    const body = { user_id: selectedUser.name, message: text };
    if (threadId) body.thread_id = threadId;
    if (profile) body.profile = profile;

    try {
      const res = await chatStream("chat/stream", body);
      await processSSEStream(res);
    } catch (e) {
      pendingDetailsRef.current = [];
      setStepIndicator(null);
      setMessages((prev) => [
        ...prev,
        { type: "error", text: `Network error: ${e.message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  // --- Resume from Interrupt ---

  async function handleResume(approved) {
    if (!threadId || !interrupt) return;

    const interruptType = interrupt.type;
    const interruptData = { ...interrupt };
    let resumeData;
    let stepLabel;

    if (interruptType === "CONSENT_APPROVAL") {
      resumeData = { approved };
      stepLabel = approved ? "Approving consent..." : "Declining consent...";
    } else {
      resumeData = { status: "success" };
      stepLabel = "Resuming after bank login...";
    }

    setInterrupt(null);
    pendingDetailsRef.current = [];
    setSending(true);
    setStepIndicator({ text: stepLabel, details: [] });

    try {
      const res = await chatStream("chat/stream/resume", {
        thread_id: threadId,
        user_id: selectedUser.name,
        resume_data: resumeData,
        profile,
      });
      await processSSEStream(res);

      // Bridge consent to dashboard via UserContext
      if (
        interruptType === "CONSENT_APPROVAL" &&
        approved &&
        interruptData.consent_id
      ) {
        addConsent(
          interruptData.consent_id,
          "authorized",
          interruptData.source_institution,
        );
      }
    } catch (e) {
      pendingDetailsRef.current = [];
      setStepIndicator(null);
      setMessages((prev) => [
        ...prev,
        { type: "error", text: `Resume error: ${e.message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  // --- Key handler ---

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // --- Markdown rendering ---

  function renderMarkdown(text) {
    // If text is an array, join it with two line breaks (for paragraphs)
    const markdown = Array.isArray(text) ? text.join("\n\n") : text;
    return { __html: marked.parse(markdown) };
  }

  return {
    // State
    messages,
    inputValue,
    setInputValue,
    sending,
    waitingForBankLogin,
    stepIndicator,
    interrupt,
    showSuggestions,
    suggestions,
    threadId,
    // Handlers
    handleSend,
    handleResume,
    handleKeyDown,
    renderMarkdown,
  };
}
