"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { H2, Body, Subtitle } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Image from "next/image";
import Icon from "@leafygreen-ui/icon";
import Link from "next/link";
import LeafyBankAssistant from "../components/LeafyBankAssistant/LeafyBankAssistant";
import Login from "@/components/Login/Login";
import { useUser } from "@/lib/context/UserContext";
import { useHomeData } from "@/lib/api/hooks";
import { formatCurrency } from "@/lib/api/format";

const HomeContent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { totalBalance, totalDebt, bankAccounts, creditCards, creditScore, loading } = useHomeData();

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
              <div className={styles.productHeader}>
                <Subtitle>Spending Last Month</Subtitle>
              </div>
            </Card>
          </div>
          <div className={`${styles.card} ${styles.cardSmall}`}>
            <Card className={styles.leafyCard}>
              <div className={styles.productHeader}>
                <Subtitle>Pie Chart</Subtitle>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Middle 20% */}
      <section className={styles.midSection}>
        <div className={styles.rowTwo}>
          <div className={`${styles.card} ${styles.cardEqual}`}>
            <Card className={styles.leafyCard}></Card>
          </div>
          <div className={`${styles.card} ${styles.cardEqual}`}>
            <Card className={styles.leafyCard}>
              <button
                onClick={() => setModalOpen(true)}
                className={styles.entitiesButton}
                aria-label="Add other financial entities"
              >
                <div className={styles.cardContent}>
                  <div className={styles.thumbWrap}>
                    <Image
                      src="/thumbnail.png"
                      alt="thumbnail"
                      width={70}
                      height={70}
                    />
                  </div>

                  <div className={styles.cardText}>
                    <Subtitle>Add other financial entities</Subtitle>
                    <Body className={styles.cardBodyGray}>
                      Get a clear view of all your money
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
          <div className={`${styles.card} ${styles.cardProduct}`}>
            <Link href="/accounts" className={styles.cardLink}>
              <Card className={styles.leafyCard}>
                <div className={styles.productInner}>
                  <div className={styles.productHeader}>
                    <Image
                      src="/bank.png"
                      alt="accounts"
                      width={48}
                      height={48}
                      className={styles.productImage}
                    />
                    <Subtitle>Accounts</Subtitle>
                  </div>

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
                </div>
              </Card>
            </Link>
          </div>
          <div className={`${styles.card} ${styles.cardProduct}`}>
            <Link href="/credit-cards" className={styles.cardLink}>
              <Card className={styles.leafyCard}>
                <div className={styles.productInner}>
                  <div className={styles.productHeader}>
                    <Image
                      src="/card.png"
                      alt="credit-cards"
                      width={48}
                      height={48}
                      className={styles.productImage}
                    />
                    <Subtitle>Credit Cards</Subtitle>
                  </div>
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
                </div>
              </Card>
            </Link>
          </div>
          <div className={`${styles.card} ${styles.cardProduct}`}>
            <Link href="/loans" className={styles.cardLink}>
              <Card className={styles.leafyCard}>
                <div className={styles.productInner}>
                  <div className={styles.productHeader}>
                    <Image
                      src="/loan.png"
                      alt="loans"
                      width={48}
                      height={48}
                      className={styles.productImage}
                    />
                    <Subtitle>Loans</Subtitle>
                  </div>
                  <div className={styles.productBody}></div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <LeafyBankAssistant
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
};

export default function Home() {
  const { selectedUser } = useUser();

  return (
    <>
      {!selectedUser && <Login />}
      {selectedUser && <HomeContent />}
    </>
  );
}
