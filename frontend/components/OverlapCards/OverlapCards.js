"use client";

import React, { useState } from "react";
import styles from "./OverlapCards.module.css";
import Card from "@leafygreen-ui/card";
import { Subtitle, Body } from "@leafygreen-ui/typography";

export default function OverlapCards({ items = [] }) {
  const [front, setFront] = useState(0);

  // Handle empty state
  if (!items || items.length === 0) {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.cardInner}>
            <div>
              <Subtitle>No items available</Subtitle>
              <Body className={styles.gray}>Check back later</Body>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {items.map((it, idx) => {
        const isFront = idx === front;
        return (
          <button
            key={idx}
            type="button"
            aria-pressed={isFront}
            onClick={() => setFront(idx)}
            className={`${styles.cardButton} ${isFront ? styles.front : styles.back}`}
          >
            <Card className={styles.card}>
              <div className={styles.cardInner}>
                <div>
                  <Subtitle>{it.title}</Subtitle>
                  <Body className={styles.gray}>{it.subtitle || `Account Number: ${it.number}`}</Body>
                </div>

                {it.amount !== undefined && (
                  <div className={styles.amount}>
                    USD {it.amount.toLocaleString()}
                  </div>
                )}
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}

