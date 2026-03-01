"use client";

import React, { useRef, useEffect } from "react";
import Modal from "@leafygreen-ui/modal";
import { H2, Body } from "@leafygreen-ui/typography";
import Button from "@leafygreen-ui/button";
import styles from "./LeafyBankAssistant.module.css";
import { useChatbot } from "@/lib/api/useChatbot";

const SUGGESTIONS = [
  "I want to port my vehicle loan to a better rate",
  "I want to port my personal loan to a better rate",
  "Show me my existing loan details",
  "I want financial advice",
];

export default function LeafyBankAssistant({ isOpen, onClose }) {
  const {
    messages, inputValue, setInputValue, sending, waitingForBankLogin,
    stepIndicator, interrupt, showSuggestions, threadId,
    handleSend, handleResume, handleKeyDown, renderMarkdown,
  } = useChatbot();

  // DOM refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, stepIndicator, interrupt, waitingForBankLogin]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} setOpen={onClose} className={styles.modalOverride}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <H2 className={styles.chatTitle}>Leafy Bank Assistant</H2>
          {threadId && (
            <span className={styles.threadBadge}>
              Thread: {threadId.substring(0, 8)}...
            </span>
          )}
        </div>

        <div className={styles.chatMessages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.message} ${
                msg.type === "user"
                  ? styles.userMessage
                  : msg.type === "error"
                  ? styles.errorMessage
                  : styles.assistantMessage
              }`}
            >
              {msg.type === "assistant" ? (
                <div
                  className={styles.messageText}
                  dangerouslySetInnerHTML={renderMarkdown(msg.text)}
                />
              ) : (
                <Body className={styles.messageText}>{msg.text}</Body>
              )}
            </div>
          ))}

          {/* Suggestion Chips */}
          {showSuggestions && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((text, i) => (
                <button
                  key={i}
                  className={styles.suggestionChip}
                  onClick={() => handleSend(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Step Indicator */}
          {stepIndicator && (
            <div className={styles.stepIndicator}>
              <div className={styles.stepHeader}>
                <div className={styles.spinner} />
                <span>{stepIndicator.text}</span>
              </div>
              {stepIndicator.details?.length > 0 && (
                <div className={styles.stepDetails}>
                  {stepIndicator.details.map((d, i) => (
                    <div key={i} className={styles.stepDetail}>
                      <span
                        className={
                          d.status === "done"
                            ? styles.iconDone
                            : styles.iconPending
                        }
                      >
                        {d.status === "done" ? "✓" : "●"}
                      </span>
                      <code>{d.tool}()</code>
                      {d.summary && (
                        <span className={styles.toolSummary}>
                          → {d.summary.substring(0, 80)}
                          {d.summary.length > 80 ? "..." : ""}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Waiting for bank login in other tab */}
          {waitingForBankLogin && (
            <div className={styles.waitingState}>
              <div className={styles.stepHeader}>
                <div className={styles.spinner} />
                <span>Waiting for bank login in the other tab...</span>
              </div>
              <Body className={styles.waitingHint}>
                Complete the login and consent approval in the new tab. This chat will update automatically.
              </Body>
            </div>
          )}

          {/* Interrupt Box — only CONSENT_APPROVAL shown inline */}
          {interrupt && interrupt.type === "CONSENT_APPROVAL" && (
            <div className={styles.interruptBox}>
              <h4 className={styles.interruptTitle}>
                Consent Approval Required
              </h4>
              <p className={styles.interruptMessage}>
                {interrupt.message ||
                  "Do you approve this data-sharing consent?"}
              </p>
              {interrupt.permissions && (
                <div className={styles.interruptDetails}>
                  <strong>Permissions:</strong>{" "}
                  {interrupt.permissions.join(", ")}
                </div>
              )}
              {interrupt.purpose && (
                <div className={styles.interruptDetails}>
                  <strong>Purpose:</strong> {interrupt.purpose}
                </div>
              )}
              {interrupt.source_institution && (
                <div className={styles.interruptDetails}>
                  <strong>Source:</strong> {interrupt.source_institution}
                </div>
              )}
              {interrupt.expiration && (
                <div className={styles.interruptDetails}>
                  <strong>Expires:</strong> {interrupt.expiration}
                </div>
              )}
              <div className={styles.interruptActions}>
                <Button
                  variant="primary"
                  onClick={() => handleResume(true)}
                >
                  Approve Consent
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleResume(false)}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.chatInputContainer}>
          <input
            ref={inputRef}
            type="text"
            placeholder={waitingForBankLogin ? "Waiting for bank login..." : sending ? "Waiting for response..." : "Type your message..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.chatInput}
            disabled={sending || waitingForBankLogin}
          />
          <Button
            variant="primary"
            onClick={() => handleSend()}
            disabled={sending || waitingForBankLogin || !inputValue.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}
