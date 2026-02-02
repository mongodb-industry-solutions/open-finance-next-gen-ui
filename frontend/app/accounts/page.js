"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { H1, H2, Body, Subtitle } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Image from "next/image";
import Icon from "@leafygreen-ui/icon";
import OverlapCards from "../../components/OverlapCards/OverlapCards";
import LeafyBankAssistant from "../../components/LeafyBankAssistant/LeafyBankAssistant";

// Sample account data for OverlapCards
const ACCOUNTS_DATA = [
  { title: "Checking Account", number: "344171342", amount: 542 },
  { title: "Savings Account", number: "56671342", amount: 12642 },
];

// Sample transactions to use as fallback / example data
const SAMPLE_TRANSACTIONS = [
  {
    category: "Groceries",
    establishment: "Whole Foods",
    date: "2025-12-10",
    amount: 54.2,
  },
  {
    category: "Transport",
    establishment: "Uber",
    date: "2025-12-09",
    amount: 12.3,
  },
  {
    category: "Dining",
    establishment: "La Taqueria",
    date: "2025-12-08",
    amount: 28.0,
  },
];

export default function AccountsPage() {
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Attempt to fetch transactions from an API endpoint.
    // In the future this can read from MongoDB via an API route.
    let mounted = true;

    fetch("/api/transactions")
      .then((res) => {
        if (!res.ok) throw new Error("no api");
        return res.json();
      })
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setTransactions(data);
        }
      })
      .catch(() => {
        // keep sample data if API not available
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className={styles.container}>
      <H2>Accounts Overview</H2>
      <section className={styles.topSection}>

        <div className={styles.rowThree}>
          <Card className={styles.topCard}>
            <OverlapCards items={ACCOUNTS_DATA} />
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
                aria-label="Add other financial entities"
              >
                <div className={styles.cardContent}>
                <div className={styles.thumbWrap}>
                  <Image src="/icon1.png" alt="thumbnail" width={56} height={56} />
                </div>

                <div className={styles.cardText}>
                  <Subtitle>Join our Premium Financial Program</Subtitle>
                  <Body className={styles.cardBodyGray}>Get more out of  Leafy Bank</Body>
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
              {transactions.map((t, idx) => (
                <tr key={idx}>
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
