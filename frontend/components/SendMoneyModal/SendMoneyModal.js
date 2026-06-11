"use client";

import React, { useState, useEffect } from "react";
import { H2, H3, Body } from "@leafygreen-ui/typography";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import styles from "./SendMoneyModal.module.css";

// view: null = picker, "digital-payment" = digital payment form, "transfer" = transfer form
export default function SendMoneyModal({
  isOpen,
  onClose,
  paymentMethods,
  accounts,
  initialView = null,
}) {
  const [view, setView] = useState(initialView);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentOriginator, setPaymentOriginator] = useState("");
  const [paymentBeneficiary, setPaymentBeneficiary] = useState("");

  const [transferAmount, setTransferAmount] = useState("");
  const [transferOriginator, setTransferOriginator] = useState("");
  const [transferBeneficiary, setTransferBeneficiary] = useState("");

  useEffect(() => {
    if (isOpen) {
      setView(initialView ?? null);
    } else {
      setPaymentAmount(""); setPaymentMethod(""); setPaymentOriginator(""); setPaymentBeneficiary("");
      setTransferAmount(""); setTransferOriginator(""); setTransferBeneficiary("");
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const title = view === "digital-payment"
    ? "Digital Payment"
    : view === "transfer"
    ? "Transfer Money"
    : "Send Money";

  return (
    <div className={styles.modalBackdrop} onClick={handleClose}>
      <div
        className={styles.modalDialog}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            {view !== null && initialView === null && (
              <button
                className={styles.backButton}
                onClick={() => setView(null)}
                aria-label="Back to options"
              >
                <Icon glyph="ArrowLeft" size="small" />
              </button>
            )}
            <H2>{title}</H2>
          </div>
          <button
            className={styles.modalCloseButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <Icon glyph="X" />
          </button>
        </div>

        {view === null && (
          <div className={styles.pickerGrid}>
            <button className={styles.typeCard} onClick={() => setView("digital-payment")}>
              <div className={styles.typeIcon}>
                <Icon glyph="CreditCard" size="xlarge" />
              </div>
              <span className={styles.typeLabel}>Digital Payment</span>
              <span className={styles.typeDesc}>Pay a bill or merchant via card or wire</span>
            </button>
            <button className={styles.typeCard} onClick={() => setView("transfer")}>
              <div className={styles.typeIcon}>
                <Icon glyph="ArrowRight" size="xlarge" />
              </div>
              <span className={styles.typeLabel}>Transfer</span>
              <span className={styles.typeDesc}>Move money between accounts</span>
            </button>
          </div>
        )}

        {view === "digital-payment" && (
          <>
            <Body className={styles.modalSubtext}>Transaction limit 500</Body>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="payment-amount">Transaction amount</label>
                <input
                  id="payment-amount"
                  className={styles.formInput}
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="payment-method">Payment method</label>
                <select
                  id="payment-method"
                  className={styles.formSelect}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select a payment method</option>
                  {paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>{pm.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="payment-originator">Originator account</label>
                <select
                  id="payment-originator"
                  className={styles.formSelect}
                  value={paymentOriginator}
                  onChange={(e) => setPaymentOriginator(e.target.value)}
                >
                  <option value="">Select originator account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="payment-beneficiary">Beneficiary account</label>
                <select
                  id="payment-beneficiary"
                  className={styles.formSelect}
                  value={paymentBeneficiary}
                  onChange={(e) => setPaymentBeneficiary(e.target.value)}
                >
                  <option value="">Select beneficiary account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <Button variant="default" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" onClick={handleClose}>Submit</Button>
            </div>
          </>
        )}

        {view === "transfer" && (
          <>
            <Body className={styles.modalSubtext}>Transaction limit 500</Body>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="transfer-amount">Transaction amount</label>
                <input
                  id="transfer-amount"
                  className={styles.formInput}
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="transfer-originator">Originator account</label>
                <select
                  id="transfer-originator"
                  className={styles.formSelect}
                  value={transferOriginator}
                  onChange={(e) => setTransferOriginator(e.target.value)}
                >
                  <option value="">Select originator account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="transfer-beneficiary">Beneficiary account</label>
                <select
                  id="transfer-beneficiary"
                  className={styles.formSelect}
                  value={transferBeneficiary}
                  onChange={(e) => setTransferBeneficiary(e.target.value)}
                >
                  <option value="">Select beneficiary account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <Button variant="default" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" onClick={handleClose}>Submit</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
