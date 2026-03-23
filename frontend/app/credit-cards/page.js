"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { H2, Body, Subtitle } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Image from "next/image";
import Icon from "@leafygreen-ui/icon";
import OverlapCards from "../../components/OverlapCards/OverlapCards";
import LeafyBankAssistant from "../../components/LeafyBankAssistant/LeafyBankAssistant";
import { useCreditCardsPageData } from "@/lib/api/hooks";
import { useUser } from "@/lib/context/UserContext";

const categoryColors = {
  "Groceries": "#10B981",
  "Restaurants": "#F59E0B",
  "Travel": "#3B82F6",
  "Entertainment": "#8B5CF6",
  "Movie Theatres": "#8B5CF6",
  "Streaming Services": "#8B5CF6",
  "Utilities": "#EF4444",
  "Clothing Stores": "#EC4899",
  "Department Stores": "#EC4899",
  "Healthcare": "#06B6D4",
  "Pharmacy": "#06B6D4",
  "Other": "#dfdfdf",
};

const getCategoryColor = (category) => {
  return categoryColors[category] || categoryColors["Other"];
};

export default function CreditCardsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedUser } = useUser();

  const { creditCards, cardTxns, accountsLoading, txLoading } = useCreditCardsPageData();

  return (
    <main className={styles.container}>
      <H2>Credit Cards Overview</H2>

      <section className={styles.topSection}>
        <div className={styles.rowThree}>
          <Card className={styles.topCard}>
            {accountsLoading ? (
              <Body>Loading cards...</Body>
            ) : (
              <OverlapCards items={creditCards} />
            )}
          </Card>
          <Card className={styles.topCard}>
            {selectedUser?.name === 'fridaklo' && (
              <div className={styles.iframeWrap}>
                <iframe
                  width="640"
                  height="480"
                  src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=1066e97f-6628-49be-a720-462c0d87d32c&maxDataAge=3600&theme=light&autoRefresh=true"
                ></iframe>
              </div>
            )}
            {selectedUser?.name === 'hellyrig' && (
              <div className={styles.iframeWrap}>
                <iframe
                  width="640"
                  height="480"
                  src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=45137520-16e5-430a-8a12-b07deca1b69e&maxDataAge=3600&theme=light&autoRefresh=true"
                ></iframe>
              </div>
            )}
            {(!selectedUser?.name || (selectedUser?.name !== 'fridaklo' && selectedUser?.name !== 'hellyrig')) && (
              <div className={styles.iframeWrap}></div>
            )}
          </Card>

          <div className={styles.stackColumn}>
            <Card className={styles.stackTopCard}>
              <div className={styles.stackTopInner}>
                {selectedUser?.name === 'fridaklo' && (
                  <div className={styles.iframeWrap}>
                    <iframe
                      width="640"
                      height="480"
                      src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=b2f07682-5ce1-4955-9e7f-703ba881404b&maxDataAge=3600&theme=light&autoRefresh=true"
                    ></iframe>
                  </div>
                )}
                {selectedUser?.name === 'hellyrig' && (
                  <div className={styles.iframeWrap}>
                    <iframe
                      width="640"
                      height="480"
                      src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=b421bdc8-3f1f-42ec-ac02-91196c36a1dd&maxDataAge=3600&theme=light&autoRefresh=true"
                    ></iframe>
                  </div>
                )}
                {(!selectedUser?.name || (selectedUser?.name !== 'fridaklo' && selectedUser?.name !== 'hellyrig')) && (
                  <Subtitle>Other analytics</Subtitle>
                )}
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
                    <Image src="/credit_card.gif" alt="card icon" width={80} height={56} />
                  </div>

                  <div className={styles.cardText}>
                    <Subtitle>Maybe it&apos;s time for a credit card?</Subtitle>
                    <Body className={styles.cardBodyGray}>Let Leafy Assistant guide you</Body>
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
                <th className={styles.th}></th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Establishment</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th} style={{ textAlign: "right" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {txLoading ? (
                <tr>
                  <td colSpan={5}>Loading transactions...</td>
                </tr>
              ) : cardTxns.length > 0 ? (
                cardTxns.map((t, i) => (
                  <tr key={i}>
                    <td className={styles.categoryCircleCell}>
                      <div
                        className={styles.categoryCircle}
                        style={{ backgroundColor: getCategoryColor(t.category) }}
                      ></div>
                    </td>
                    <td>{t.category}</td>
                    <td>{t.establishment}</td>
                    <td>{t.date}</td>
                    <td style={{ textAlign: "right" }}>
                      {t.amount.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No credit card transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <LeafyBankAssistant isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
