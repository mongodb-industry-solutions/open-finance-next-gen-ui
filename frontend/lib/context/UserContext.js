"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeConsentId, setActiveConsentId] = useState(null);
  const [consentStatus, setConsentStatus] = useState(null);
  const [sourceInstitution, setSourceInstitution] = useState(null);
  const [profile, setProfile] = useState("balanced");
  const [consentRefreshKey, setConsentRefreshKey] = useState(0);

  // Chat state — persists across navigation (e.g. bank-login redirect and back)
  const [chatMessages, setChatMessages] = useState(null); // null = fresh session, [] = cleared
  const [chatThreadId, setChatThreadId] = useState(null);

  // Hydrate from localStorage on mount (needed for bank-login tab)
  useEffect(() => {
    const stored = localStorage.getItem("selectedUser");
    if (stored) {
      try {
        setSelectedUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("selectedUser");
      }
    }
  }, []);

  const selectUser = useCallback((user) => {
    // Clear previous session
    setActiveConsentId(null);
    setConsentStatus(null);
    setSourceInstitution(null);
    setProfile("balanced");
    setChatMessages(null);
    setChatThreadId(null);

    // Set new user
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  }, []);

  const clearUser = useCallback(() => {
    localStorage.removeItem("selectedUser");
    setSelectedUser(null);
    setActiveConsentId(null);
    setConsentStatus(null);
    setSourceInstitution(null);
    setProfile("balanced");
  }, []);

  // Update bearer token (e.g. from bank-login get-authorization)
  const updateBearerToken = useCallback((token) => {
    setSelectedUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, bearerToken: token };
      localStorage.setItem("selectedUser", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Called when chatbot completes consent flow
  const setConsent = useCallback((consentId, status, institution) => {
    setActiveConsentId(consentId);
    setConsentStatus(status);
    setSourceInstitution(institution);
    setConsentRefreshKey((k) => k + 1);
  }, []);

  const value = {
    selectedUser,
    selectUser,
    clearUser,
    updateBearerToken,
    activeConsentId,
    consentStatus,
    sourceInstitution,
    setConsent,
    profile,
    setProfile,
    consentRefreshKey,
    chatMessages,
    setChatMessages,
    chatThreadId,
    setChatThreadId,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
