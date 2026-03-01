"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { H2, Body, Subtitle } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Image from "next/image";
import Icon from "@leafygreen-ui/icon";
import OverlapCards from "../../components/OverlapCards/OverlapCards";
import LeafyBankAssistant from "../../components/LeafyBankAssistant/LeafyBankAssistant";
import { useLoansPageData } from "@/lib/api/hooks";

export default function LoansPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { loanCards, loanTableRows, loading, activeConsentId } = useLoansPageData();

  return (
    <main className={styles.container}>
      <H2>Loans Overview</H2>

      <section className={styles.topSection}>
        <div className={styles.rowThree}>
          <Card className={styles.topCard}>
            {loading ? (
              <Body>Loading loans...</Body>
            ) : loanCards.length > 0 ? (
              <OverlapCards items={loanCards} />
            ) : (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Body className={styles.cardBodyGray}>
                  {activeConsentId
                    ? "No external loan products found"
                    : "Connect your external bank via the chatbot to see your loans"}
                </Body>
              </div>
            )}
          </Card>
          <Card className={styles.topCard}>
            <div className={styles.iframeWrap}>
              <iframe
                title="Atlas chart"
                width="100%"
                height="240"
                src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=cfd11f4a-b8b8-446d-91fe-ba8c03bc3ce9&maxDataAge=3600&theme=light&autoRefresh=true"
              ></iframe>
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
                    <Body className={styles.cardBodyGray}>Find out if you&apos;re eligible</Body>
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
        <H2>Loan Details</H2>
        <div className={styles.tableWrap}>
          {loanTableRows.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Type</th>
                  <th className={styles.th}>Institution</th>
                  <th className={styles.th}>Contract</th>
                  <th className={styles.th} style={{ textAlign: "right" }}>
                    Outstanding
                  </th>
                </tr>
              </thead>
              <tbody>
                {loanTableRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.type}</td>
                    <td>{row.institution}</td>
                    <td>{row.contract}</td>
                    <td style={{ textAlign: "right" }}>
                      {row.outstanding.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Body className={styles.cardBodyGray} style={{ padding: "20px" }}>
              {activeConsentId
                ? "No loan data available"
                : "Use the chatbot to connect your external bank and view loan details"}
            </Body>
          )}
        </div>
      </section>

      <LeafyBankAssistant isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
