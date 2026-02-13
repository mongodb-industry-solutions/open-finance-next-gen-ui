"use client";

import React, { useState } from "react";
import Modal from "@leafygreen-ui/modal";
import { H2, Body } from "@leafygreen-ui/typography";
import styles from "./LeafyBankAssistant.module.css";
import Button from '@leafygreen-ui/button';

export default function LeafyBankAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { type: "assistant", text: "Hi there! 👋🏻" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleAsk = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: "user", text: inputValue }]);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAsk();
    }
  };
  return (
    <Modal open={isOpen} setOpen={onClose}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <H2 className={styles.chatTitle}>Leafy Bank Assistant</H2>
        </div>

        <div className={styles.chatMessages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.type === "user" ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <Body className={styles.messageText}>{message.text}</Body>
            </div>
          ))}
        </div>

        <div className={styles.chatInputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.chatInput}
          />
          <Button variant="primary" onClick={handleAsk} >
            Ask
          </Button>
        </div>
      </div>
    </Modal>
  );
}
