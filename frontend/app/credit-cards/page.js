"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { H2, Body, Subtitle } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Image from "next/image";
import Icon from "@leafygreen-ui/icon";
import OverlapCards from "../../components/OverlapCards/OverlapCards";
import LeafyBankAssistant from "../../components/LeafyBankAssistant/LeafyBankAssistant";

// Sample card data for OverlapCards
const CARDS_DATA = [
  { title: "Gold Card", number: "5142-XXXX-XXXX-8293", amount: 5500 },
];

const SAMPLE_TRANSACTIONS = [
  { category: "Payment", establishment: "Visa", date: "2025-12-11", amount: 120.0 },
  { category: "Subscription", establishment: "Spotify", date: "2025-12-05", amount: 9.99 },
  { category: "Dining", establishment: "Cafe Bonjour", date: "2025-12-03", amount: 34.5 },
];

export default function CreditCardsPage() {
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
      <H2>Credit Cards Overview</H2>

      <section className={styles.topSection}>
        <div className={styles.rowThree}>
          <Card className={styles.topCard}>
            <OverlapCards items={CARDS_DATA} />
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
                aria-label="Upgrade to Platinum"
              >
                <div className={styles.cardContent}>
                <div className={styles.thumbWrap}>
                  <Image src="/card.png" alt="card icon" width={56} height={56} />
                </div>

                <div className={styles.cardText}>
                  <Subtitle>Upgrade to Platinum</Subtitle>
                  <Body className={styles.cardBodyGray}>Enjoy premium benefits</Body>
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
