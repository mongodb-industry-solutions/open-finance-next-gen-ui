"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { H2, Body, Subtitle } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Image from "next/image";
import Icon from "@leafygreen-ui/icon";
import OverlapCards from "../../components/OverlapCards/OverlapCards";
import LeafyBankAssistant from "../../components/LeafyBankAssistant/LeafyBankAssistant";

const SAMPLE_TRANSACTIONS = [
  { category: "Payment", establishment: "Loan Servicer", date: "2025-12-01", amount: 300.0 },
  { category: "Interest", establishment: "Loan Servicer", date: "2025-11-01", amount: 45.67 },
  { category: "Fee", establishment: "Provider", date: "2025-10-20", amount: 15.0 },
];

export default function LoansPage() {
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/transactions")
      .then((res) => {
        if (!res.ok) throw new Error("no api");
        return res.json();
      })
      .then((data) => {
        if (mounted && Array.isArray(data)) setTransactions(data);
      })
      .catch(() => { });
    return () => (mounted = false);
  }, []);

  return (
    <main className={styles.container}>
      <H2>Loans Overview</H2>

      <section className={styles.topSection}>
        <div className={styles.rowThree}>
          <Card className={styles.topCard}>
            <OverlapCards items={[]} />
          </Card>
          <Card className={styles.topCard}>
            <div className={styles.iframeWrap}>
              <iframe title="Atlas chart" width="100%" height="240" src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=cfd11f4a-b8b8-446d-91fe-ba8c03bc3ce9&maxDataAge=3600&theme=light&autoRefresh=true"></iframe>
            </div>
          </Card>

          <div className={styles.stackColumn}>
            <Card className={styles.stackTopCard}>
              <div className={styles.stackTopInner}>
                <Subtitle>Other analytics</Subtitle>
              </div>
            </Card>

            <Card className={styles.stackBottomCard}>
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  width: "100%",
                }}
                aria-label="Want to get a loan?"
              >
                <div className={styles.cardContent}>
                <div className={styles.thumbWrap}>
                  <Image src="/loan.png" alt="loan icon" width={56} height={56} />
                </div>

                <div className={styles.cardText}>
                  <Subtitle>Want to get a loan?</Subtitle>
                  <Body className={styles.cardBodyGray}>Find out if you're eligible</Body>
                </div>

                <div className={styles.iconRight}>
                  <Icon glyph="ChevronRight" size="small" />
                </div>
              </div>
              </button>
            </Card>
          </div>
        </div>
      </section>

      <section className={styles.bottomSection}>
        <H2>Transactions</H2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Establishment</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th} style={{ textAlign: "right" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i}>
                  <td>{t.category}</td>
                  <td>{t.establishment}</td>
                  <td>{t.date}</td>
                  <td style={{ textAlign: "right" }}>
                    {t.amount.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <LeafyBankAssistant isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
