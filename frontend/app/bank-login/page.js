"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { H2, Body, Subtitle } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Button from "@leafygreen-ui/button";
import styles from "./page.module.css";
import { coreApi, chatStream } from "@/lib/api/client";
import { useUser } from "@/lib/context/UserContext";

export default function BankLoginPage() {
  return (
    <Suspense fallback={<div className={styles.container}><Body>Loading...</Body></div>}>
      <BankLoginContent />
    </Suspense>
  );
}

function BankLoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedUser, setConsent, updateBearerToken } = useUser();

  // Query params from chatbot redirect
  const consentId = searchParams.get("consent_id");
  const institutionName = searchParams.get("institution_name");
  const threadId = searchParams.get("thread_id");

  // State
  const [step, setStep] = useState("login"); // "login" | "fetching" | "consent" | "processing" | "done"
  const [token, setToken] = useState(null);
  const [tokenError, setTokenError] = useState(null);
  const [consentData, setConsentData] = useState(null);
  const [statusText, setStatusText] = useState("");

  // Auto-fetch bearer token on mount
  useEffect(() => {
    if (!selectedUser?.name) return;

    setStep("fetching");
    setStatusText("Connecting to bank...");

    coreApi(
      "openfinance/public/get-authorization",
      { params: { user_identifier: selectedUser.name } }
    ).then(({ data, error }) => {
      if (data?.BearerToken) {
        setToken(data.BearerToken);
        updateBearerToken(data.BearerToken);
        setStep("login");
        setStatusText("");
      } else {
        setTokenError(error || "Could not retrieve authorization token");
        setStep("login");
      }
    });
  }, [selectedUser?.name]);

  // Process SSE stream to extract consent interrupt
  const processSSEForConsent = useCallback(async (response) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();

        for (const part of parts) {
          for (const line of part.split("\n")) {
            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === "interrupt" && event.payload?.type === "CONSENT_APPROVAL") {
                  setConsentData(event.payload);
                  setStep("consent");
                  setStatusText("");
                } else if (event.type === "response") {
                  // Agent responded without interrupt — done
                  setStep("done");
                  setStatusText("Complete");
                } else if (event.type === "status") {
                  setStatusText(event.payload?.message || "Processing...");
                }
              } catch {
                // skip malformed
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }, []);

  // Step 1: Simulate bank login — resume the BANK_LOGIN interrupt
  async function handleBankLogin() {
    if (!threadId || !selectedUser?.name) return;

    setStep("processing");
    setStatusText("Authenticating with bank...");

    try {
      const res = await chatStream("chat/stream/resume", {
        thread_id: threadId,
        user_id: selectedUser.name,
        resume_data: { status: "success" },
        profile: null,
      });
      await processSSEForConsent(res);
    } catch (e) {
      setTokenError(`Login failed: ${e.message}`);
      setStep("login");
    }
  }

  // Step 2: Handle consent approval/decline
  async function handleConsentDecision(approved) {
    if (!threadId || !selectedUser?.name) return;

    setStep("processing");
    setStatusText(approved ? "Approving consent..." : "Declining consent...");

    try {
      const res = await chatStream("chat/stream/resume", {
        thread_id: threadId,
        user_id: selectedUser.name,
        resume_data: { approved },
        profile: null,
      });

      // Process remaining SSE events
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
      }
      reader.releaseLock();

      // Bridge consent to UserContext
      if (approved && consentData?.consent_id) {
        setConsent(
          consentData.consent_id,
          "authorized",
          consentData.source_institution || institutionName
        );
      }

      setStep("done");
      setStatusText(approved ? "Consent approved!" : "Consent declined.");
    } catch (e) {
      setTokenError(`Error: ${e.message}`);
      setStep("consent");
    }
  }

  // Redirect back to home
  function handleReturn() {
    router.push("/");
  }

  // Guard: no params or no user
  if (!consentId || !institutionName || !threadId) {
    return (
      <main className={styles.container}>
        <Card className={styles.card}>
          <H2>Invalid Request</H2>
          <Body>Missing required parameters. Please use the chatbot to initiate a bank connection.</Body>
          <Button variant="primary" onClick={() => router.push("/")} style={{ marginTop: 16 }}>
            Return Home
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Card className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <H2>{institutionName} — Bank Login</H2>
          <Body className={styles.subtitle}>
            Consent ID: {consentId.substring(0, 30)}...
          </Body>
        </div>

        {/* Step: Login */}
        {step === "login" && (
          <div className={styles.section}>
            {tokenError ? (
              <div className={styles.error}>
                <Body>{tokenError}</Body>
              </div>
            ) : token ? (
              <>
                <div className={styles.tokenBox}>
                  <Subtitle>Authorization Token</Subtitle>
                  <code className={styles.tokenValue}>
                    {token.substring(0, 16)}...{token.substring(token.length - 8)}
                  </code>
                  <Body className={styles.tokenHint}>
                    Token auto-retrieved from {institutionName}
                  </Body>
                </div>
                <Button variant="primary" onClick={handleBankLogin} className={styles.actionBtn}>
                  Log In to {institutionName}
                </Button>
              </>
            ) : null}
          </div>
        )}

        {/* Step: Fetching token */}
        {step === "fetching" && (
          <div className={styles.section}>
            <div className={styles.spinner} />
            <Body>{statusText}</Body>
          </div>
        )}

        {/* Step: Processing */}
        {step === "processing" && (
          <div className={styles.section}>
            <div className={styles.spinner} />
            <Body>{statusText}</Body>
          </div>
        )}

        {/* Step: Consent Approval */}
        {step === "consent" && consentData && (
          <div className={styles.section}>
            <div className={styles.consentBox}>
              <Subtitle>Consent Approval Required</Subtitle>
              <Body className={styles.consentMessage}>
                {consentData.message || "Do you approve this data-sharing consent?"}
              </Body>

              {consentData.permissions && (
                <div className={styles.consentDetail}>
                  <Body weight="medium">Permissions:</Body>
                  <Body>{consentData.permissions.join(", ")}</Body>
                </div>
              )}

              {consentData.purpose && (
                <div className={styles.consentDetail}>
                  <Body weight="medium">Purpose:</Body>
                  <Body>{consentData.purpose}</Body>
                </div>
              )}

              {consentData.source_institution && (
                <div className={styles.consentDetail}>
                  <Body weight="medium">Source:</Body>
                  <Body>{consentData.source_institution}</Body>
                </div>
              )}

              {consentData.expiration && (
                <div className={styles.consentDetail}>
                  <Body weight="medium">Expires:</Body>
                  <Body>{consentData.expiration}</Body>
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <Button variant="primary" onClick={() => handleConsentDecision(true)}>
                Approve Consent
              </Button>
              <Button variant="default" onClick={() => handleConsentDecision(false)}>
                Decline
              </Button>
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className={styles.section}>
            <div className={styles.doneBox}>
              <Subtitle>{statusText}</Subtitle>
              <Body>You can now return to the dashboard to view your connected data.</Body>
            </div>
            <Button variant="primary" onClick={handleReturn} className={styles.actionBtn}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
