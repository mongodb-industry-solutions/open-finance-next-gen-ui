"use client";

import React, { useState } from "react";
import Icon from "@leafygreen-ui/icon";
import BottomNav from "@/components/BottomNav/BottomNav";
import DigitalPaymentModal from "@/components/DigitalPaymentModal/DigitalPaymentModal";
import TransactionModal from "@/components/TransactionModal/TransactionModal";
import LeafyBankAssistant from "@/components/LeafyBankAssistant/LeafyBankAssistant";

const mockPaymentMethods = [
  { id: "cc", label: "Credit Card" },
  { id: "debit", label: "Debit Card" },
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "wire", label: "Wire Transfer" },
];

const mockAccounts = [
  { id: "acc_001", label: "Checking - 1234" },
  { id: "acc_002", label: "Savings - 5678" },
  { id: "acc_003", label: "Money Market - 9012" },
];

/**
 * Mobile-only quick-actions bar: the bottom navigation plus the modals it
 * launches (Payments, Transactions, Assistant). Self-contained — drop
 * <MobileActions /> onto any page. The bar itself is hidden on desktop via
 * BottomNav's CSS, so the modals are only reachable on mobile.
 */
export default function MobileActions() {
  const [digitalPaymentModalOpen, setDigitalPaymentModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentOriginatorAccount, setPaymentOriginatorAccount] = useState("");
  const [paymentBeneficiaryAccount, setPaymentBeneficiaryAccount] = useState("");

  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionOriginatorAccount, setTransactionOriginatorAccount] = useState("");
  const [transactionBeneficiaryAccount, setTransactionBeneficiaryAccount] = useState("");

  return (
    <>
      {/* Mobile-only bottom navigation. Icons are placeholders — swap the
          `icon` values for the final icons when provided. */}
      <BottomNav
        items={[
          {
            key: "payments",
            label: "Payments",
            icon: <Icon glyph="CreditCard" size="large" />,
            onClick: () => setDigitalPaymentModalOpen(true),
          },
          {
            key: "transactions",
            label: "Transactions",
            icon: <Icon glyph="Coin" size="large" />,
            onClick: () => setTransactionModalOpen(true),
          },
          {
            key: "assistant",
            label: "Assistant",
            icon: <Icon glyph="Sparkle" size="large" />,
            onClick: () => setAssistantOpen(true),
          },
          {
            key: "other",
            label: "Other Actions",
            icon: <Icon glyph="Ellipsis" size="large" />,
            onClick: () => {},
          },
        ]}
      />

      <DigitalPaymentModal
        isOpen={digitalPaymentModalOpen}
        onClose={() => setDigitalPaymentModalOpen(false)}
        amount={paymentAmount}
        setAmount={setPaymentAmount}
        method={paymentMethod}
        setMethod={setPaymentMethod}
        originatorAccount={paymentOriginatorAccount}
        setOriginatorAccount={setPaymentOriginatorAccount}
        beneficiaryAccount={paymentBeneficiaryAccount}
        setBeneficiaryAccount={setPaymentBeneficiaryAccount}
        paymentMethods={mockPaymentMethods}
        accounts={mockAccounts}
      />

      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        amount={transactionAmount}
        setAmount={setTransactionAmount}
        originatorAccount={transactionOriginatorAccount}
        setOriginatorAccount={setTransactionOriginatorAccount}
        beneficiaryAccount={transactionBeneficiaryAccount}
        setBeneficiaryAccount={setTransactionBeneficiaryAccount}
        accounts={mockAccounts}
      />

      <LeafyBankAssistant
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </>
  );
}
