"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { H2, Body, Subtitle } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Image from "next/image";
import Icon from "@leafygreen-ui/icon";
import Link from "next/link";
import ProductCard from "@/components/ProductCard/ProductCard";
import LeafyBankAssistant from "../components/LeafyBankAssistant/LeafyBankAssistant";
import Login from "@/components/Login/Login";
import { useUser } from "@/lib/context/UserContext";
import { useHomeData } from "@/lib/api/hooks";
import { formatCurrency } from "@/lib/api/format";

const HomeContent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedUser } = useUser();
  const { totalBalance, totalDebt, bankAccounts, creditCards, creditScore, loans, loading } = useHomeData();
  const [pendingPrompt, setPendingPrompt] = useState(null);

  return (
    <main className={styles.container}>
      {/* Top 40% */}
      <section className={styles.topSection}>
        <div className={styles.rowThree}>
          <div className={`${styles.card} ${styles.cardSmall}`}>
            <Card className={styles.leafyCard}>
              <div className={styles.globalPosition}>
                <div className={styles.productHeader}>
                  <Subtitle>Global Position</Subtitle>
                </div>

                <div className={styles.gpSection}>
                  <Subtitle>
                    {loading ? "..." : formatCurrency(totalBalance)}
                  </Subtitle>
                  <Body className={styles.cardBodyGray}>Total Balance</Body>
                </div>

                <div className={styles.divider} />

                <div className={styles.gpSection}>
                  <Subtitle>
                    {loading ? "..." : formatCurrency(totalDebt)}
                  </Subtitle>
                  <Body className={styles.cardBodyGray}>Total Debt</Body>
                </div>

                {creditScore && (
                  <>
                    <div className={styles.divider} />
                    <div className={styles.gpSection}>
                      <Subtitle>{creditScore.Score}</Subtitle>
                      <Body className={styles.cardBodyGray}>
                        Credit Score ({creditScore.Bureau})
                      </Body>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
          <div className={`${styles.card} ${styles.cardLarge}`}>
            <Card className={styles.leafyCard}>
              {selectedUser?.name === 'fridaklo' && (
                <div className={styles.pieChartWrap}>
                  <iframe
                    width="640"
                    height="480"
                    src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=69a017b3-1c44-4849-ae8e-22b85402ae39&maxDataAge=3600&theme=light&autoRefresh=true"
                  ></iframe>
                </div>
              )}
              {selectedUser?.name === 'hellyrig' && (
                <div className={styles.pieChartWrap}>
                  <iframe
                    width="640"
                    height="480"
                    src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=028e0b6f-9882-496f-80ab-6929ad2d49b8&maxDataAge=3600&theme=light&autoRefresh=true"
                  ></iframe>
                </div>
              )}
              {(!selectedUser?.name || (selectedUser?.name !== 'fridaklo' && selectedUser?.name !== 'hellyrig')) && (
                <div className={styles.productHeader}>
                  <Subtitle>Spending Last Month</Subtitle>
                </div>
              )}
            </Card>
          </div>
          <div className={`${styles.card} ${styles.cardSmall}`}>
            <Card className={styles.leafyCard}>
              {selectedUser?.name === 'fridaklo' && (
                <div className={styles.pieChartWrap}>
                  <iframe
                    style={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                    width="640"
                    height="480"
                    src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=1066e97f-6628-49be-a720-462c0d87d32c&maxDataAge=3600&theme=light&autoRefresh=true"
                  ></iframe>
                </div>
              )}
              {selectedUser?.name === 'hellyrig' && (
                <div className={styles.pieChartWrap}>
                  <iframe
                    style={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                    width="640"
                    height="480"
                    src="https://charts.mongodb.com/charts-jeffn-zsdtj/embed/charts?id=45137520-16e5-430a-8a12-b07deca1b69e&maxDataAge=3600&theme=light&autoRefresh=true"
                  ></iframe>
                </div>
              )}
              {(!selectedUser?.name || (selectedUser?.name !== 'fridaklo' && selectedUser?.name !== 'hellyrig')) && (
                <div className={styles.productHeader}>
                  <Subtitle>Pie Chart</Subtitle>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Middle 20% */}
      <section className={styles.midSection}>
        <div className={styles.rowTwo}>
          <div className={`${styles.card} ${styles.cardEqual}`}>
            <Card className={styles.leafyCard}>
              <button
                onClick={() => {
                  setPendingPrompt("I want to port my loan to a better rate");
                  setModalOpen(true);
                }}
                className={styles.entitiesButton}
                aria-label="Switch to a better loan"
              >
                <div className={styles.cardContent}>
                  <div className={styles.thumbWrap}>
                    <Image
                      src="/tips.gif"
                      alt="thumbnail"
                      width={85}
                      height={85}
                    />
                  </div>

                  <div className={styles.cardText}>
                    <Subtitle>Switch to a better loan</Subtitle>
                    <Body className={styles.cardBodyGray}>
                      Find better rates and move your existing loans with less hassle.
                    </Body>
                  </div>

                  <div className={styles.iconRight}>
                    <Icon glyph="ChevronRight" size="small" />
                  </div>
                </div>
              </button>
            </Card>
          </div>
          <div className={`${styles.card} ${styles.cardEqual}`}>
            <Card className={styles.leafyCard}>
              <button
                onClick={() => {
                  setPendingPrompt("I want financial advice");
                  setModalOpen(true);
                }}
                className={styles.entitiesButton}
                aria-label="Get a complete view of your finances"
              >
                <div className={styles.cardContent}>
                  <div className={styles.thumbWrap}>
                    <Image
                      src="/credit_card.gif"
                      alt="thumbnail"
                      width={70}
                      height={70}
                    />
                  </div>

                  <div className={styles.cardText}>
                    <Subtitle>Get a complete view of your finances</Subtitle>
                    <Body className={styles.cardBodyGray}>
                      See all your accounts in one place and make smarter financial decisions.
                    </Body>
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

      {/* Bottom 40% */}
      <section className={styles.bottomSection}>
        <div className={styles.productsHeader}>
          <H2>Products</H2>
        </div>
        <div className={styles.rowThreeEqual}>
          <ProductCard href="/accounts" imgSrc="/bank.png" imgAlt="accounts" title="Accounts">
            <div className={styles.accountList}>
              {loading ? (
                <Body className={styles.cardBodyGray}>Loading...</Body>
              ) : bankAccounts.length > 0 ? (
                bankAccounts.map((account) => (
                  <div
                    key={account._id}
                    className={styles.accountRow}
                  >
                    <div className={styles.accountInfo}>
                      <Body>{account.AccountType} Account</Body>
                      <Body className={styles.cardBodyGray}>
                        Account Number: {account.AccountNumber}
                      </Body>
                    </div>
                    <div className={styles.accountAmount}>
                      <Subtitle>
                        {formatCurrency(account.AccountBalance)}
                      </Subtitle>
                    </div>
                  </div>
                ))
              ) : (
                <Body className={styles.cardBodyGray}>
                  No accounts found
                </Body>
              )}
            </div>
          </ProductCard>

          <ProductCard href="/credit-cards" imgSrc="/card.png" imgAlt="credit-cards" title="Credit Cards">
            <div className={styles.accountList}>
              {creditCards.map((card) => (
                <div key={card._id} className={styles.accountRow}>
                  <div className={styles.accountInfo}>
                    <Body>{card.AccountDescription || "Credit Card"}</Body>
                    <Body className={styles.cardBodyGray}>
                      {card.AccountNumber}
                    </Body>
                  </div>
                  <div className={styles.accountAmount}>
                    <Subtitle>{formatCurrency(card.AccountBalance)}</Subtitle>
                  </div>
                </div>
              ))}
            </div>
          </ProductCard>

          <ProductCard href="/loans" imgSrc="/loan.png" imgAlt="loans" title="Loans">
            <div className={styles.accountList}>
              {loans.length > 0 ? (
                loans.map((loan, i) => (
                  <div key={i} className={styles.accountRow}>
                    <div className={styles.accountInfo}>
                      <Body>{loan.name}</Body>
                      <Body className={styles.cardBodyGray}>
                        {loan.institution}
                      </Body>
                    </div>
                    <div className={styles.accountAmount}>
                      <Subtitle>{formatCurrency(loan.balance)}</Subtitle>
                    </div>
                  </div>
                ))
              ) : (
                <Body className={styles.cardBodyGray}>
                  Connect a bank via chatbot to see loans
                </Body>
              )}
            </div>
          </ProductCard>
        </div>
      </section>

      <LeafyBankAssistant
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPrompt={pendingPrompt}
      />
    </main>
  );
};

export default function Home() {
  const { selectedUser, clearUser } = useUser();
  const [loginDone, setLoginDone] = useState(false);

  // Fresh page load (refresh/new tab) → clear user so Login shows.
  // Client-side navigation (logo click) → flag already set, skip clear.
  useEffect(() => {
    if (!window.__LEAFY_SESSION__) {
      window.__LEAFY_SESSION__ = true;
      clearUser();
    }
  }, [clearUser]);

  // Sync loginDone after hydration or user selection
  useEffect(() => {
    if (selectedUser) setLoginDone(true);
  }, [selectedUser]);

  return (
    <>
      {!loginDone && <Login onDone={() => setLoginDone(true)} />}
      {selectedUser && loginDone && <HomeContent />}
    </>
  );
}
