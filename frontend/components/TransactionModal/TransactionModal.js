import React from "react";
import { H2, Body } from "@leafygreen-ui/typography";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import styles from "./TransactionModal.module.css";

export default function TransactionModal({
  isOpen,
  onClose,
  amount,
  setAmount,
  originatorAccount,
  setOriginatorAccount,
  beneficiaryAccount,
  setBeneficiaryAccount,
  accounts,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalDialog}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <H2>Make New Transaction</H2>
            <Body className={styles.modalSubtext}>transaction limit 500</Body>
          </div>
          <button
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Close transaction modal"
          >
            <Icon glyph="X" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="transaction-amount">
              Transaction amount
            </label>
            <input
              id="transaction-amount"
              className={styles.formInput}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className={styles.formGroup}>
            <label
              className={styles.formLabel}
              htmlFor="transaction-originator"
            >
              Originator account number
            </label>
            <select
              id="transaction-originator"
              className={styles.formSelect}
              value={originatorAccount}
              onChange={(e) => setOriginatorAccount(e.target.value)}
            >
              <option value="">Select originator account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label
              className={styles.formLabel}
              htmlFor="transaction-beneficiary"
            >
              Beneficiary account number
            </label>
            <select
              id="transaction-beneficiary"
              className={styles.formSelect}
              value={beneficiaryAccount}
              onChange={(e) => setBeneficiaryAccount(e.target.value)}
            >
              <option value="">Select beneficiary account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.modalActions}>
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
