"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { chatStream } from "./client";
import { useUser } from "@/lib/context/UserContext";
import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

const WELCOME_MESSAGE =
  "Hi there! I'm your Open Finance assistant. I can help you connect bank accounts, view transactions, and analyze your financial data. How can I help you today?";

export function useChatbot() {
  const {
    selectedUser,
    profile,
    setConsent,
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

  // Derive messages from context, falling back to welcome message for fresh sessions
  const messages = chatMessages || [{ type: "assistant", text: WELCOME_MESSAGE }];
  const setMessages = setChatMessages;
  const threadId = chatThreadId;
  const setThreadId = setChatThreadId;
  const showSuggestions = !chatMessages; // show suggestions only for fresh sessions

  // SSE event state
  const [stepIndicator, setStepIndicator] = useState(null);
  const [interrupt, setInterrupt] = useState(null);

  // Ref tracking thread ID for use inside event handlers
  const threadIdRef = useRef(chatThreadId);

  // --- BroadcastChannel: listen for consent completion from bank-login tab ---
  useEffect(() => {
    const channel = new BroadcastChannel("leafy-bank-consent");

    channel.onmessage = (event) => {
      const { type, response, consentId, institution, bearerToken } = event.data;

      if (type === "consent_complete") {
        // Add the final AI response to chat messages
        if (response) {
          setMessages((prev) => [
            ...(prev || []),
            { type: "assistant", text: response },
          ]);
        }

        // Update bearer token if provided
        if (bearerToken) {
          updateBearerToken(bearerToken);
        }

        // Bridge consent to dashboard
        if (consentId) {
          setConsent(consentId, "authorized", institution);
        }

        // Clear waiting state
        setWaitingForBankLogin(false);
        setSending(false);
      }
    };

    return () => channel.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    []
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
          details: prev?.details || [],
        }));
        break;

      case "tool_call":
        setStepIndicator((prev) => ({
          text: `Calling ${payload.tool}()...`,
          details: [
            ...(prev?.details || []),
            { tool: payload.tool, args: payload.args, status: "pending" },
          ],
        }));
        break;

      case "tool_result":
        setStepIndicator((prev) => ({
          ...prev,
          text: `${payload.tool}() completed`,
          details:
            prev?.details?.map((d) =>
              d.tool === payload.tool && d.status === "pending"
                ? { ...d, status: "done", summary: payload.summary }
                : d
            ) || [],
        }));
        break;

      case "agent_complete":
        setStepIndicator((prev) =>
          prev ? { ...prev, text: `${payload.agent} finished` } : null
        );
        break;

      case "response":
        setStepIndicator(null);
        setMessages((prev) => [
          ...prev,
          { type: "assistant", text: payload.text },
        ]);
        break;

      case "interrupt":
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

      case "error":
        setStepIndicator(null);
        setMessages((prev) => [
          ...prev,
          { type: "error", text: payload.message },
        ]);
        break;

      case "done":
        setStepIndicator(null);
        break;
    }
  }

  // --- Send Message ---

  async function handleSend(overrideText) {
    const text = overrideText || inputValue.trim();
    if (!text || sending) return;
    if (!selectedUser?.name) return;

    setMessages((prev) => [...(prev || [{ type: "assistant", text: WELCOME_MESSAGE }]), { type: "user", text }]);
    setInputValue("");
    setSending(true);
    setStepIndicator({ text: "Thinking...", details: [] });

    const body = { user_id: selectedUser.name, message: text };
    if (threadId) body.thread_id = threadId;
    if (profile) body.profile = profile;

    try {
      const res = await chatStream("chat/stream", body);
      await processSSEStream(res);
    } catch (e) {
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
        setConsent(
          interruptData.consent_id,
          "authorized",
          interruptData.source_institution
        );
      }
    } catch (e) {
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
    return { __html: marked.parse(text) };
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
    threadId,
    // Handlers
    handleSend,
    handleResume,
    handleKeyDown,
    renderMarkdown,
  };
}
