"use client";

import React from "react";
import Modal from "@leafygreen-ui/modal";
import { H2, Body } from "@leafygreen-ui/typography";
import styles from "./LeafyBankAssistant.module.css";

export default function LeafyBankAssistant({ isOpen, onClose }) {
  return (
    <Modal open={isOpen} setOpen={onClose}>
      <div className={styles.container}>
        <H2 className={styles.title}>Leafy Bank Assistant</H2>

        <Body className={styles.description}>
          Welcome to the Leafy Bank Assistant! Here you can add and manage your other financial entities.
        </Body>

        <div className={styles.featureList}>
          <Body className={styles.featureTitle}>
            <strong>Features:</strong>
          </Body>
          <Body className={styles.featureItem}>
            • Connect external bank accounts
          </Body>
          <Body className={styles.featureItem}>
            • Link investment accounts
          </Body>
          <Body className={styles.featureItem}>
            • Add credit cards from other banks
          </Body>
          <Body className={styles.featureItem}>
            • Sync and consolidate your finances
          </Body>
        </div>

        <div className={styles.buttonContainer}>
    
          <button
            onClick={onClose}
            className={styles.primaryButton}
          >
            Get Started
          </button>
        </div>
      </div>
    </Modal>
  );
}
