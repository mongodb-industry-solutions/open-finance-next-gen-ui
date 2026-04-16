"use client";

import { useUser } from "@/lib/context/UserContext";
import { useEffect, useState } from "react";
import { coreApi } from "./client";

/**
 * Fetch internal Leafy Bank accounts for the logged-in user.
 * No auth required — internal endpoint.
 */
export function useAccounts() {
  const { selectedUser } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedUser?.name) {
      setLoading(false);
      return;
    }
    setLoading(true);

    coreApi("leafybank/accounts/secure/fetch-accounts-for-user", {
      method: "POST",
      body: { user_identifier: selectedUser.name },
    }).then(({ data, error: err }) => {
      if (data?.accounts) setAccounts(data.accounts);
      if (err) setError(err);
      setLoading(false);
    });
  }, [selectedUser?.name]);

  return { accounts, loading, error };
}

/**
 * Fetch all transactions (spending) for the logged-in user.
 * Uses /spending/{user} endpoint which returns all transactions.
 * No auth required — internal endpoint.
 */
export function useTransactions() {
  const { selectedUser, profile } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedUser?.name) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const profileParam = profile ? `?profile=${profile}` : "";
    coreApi(
      `leafybank/transactions/secure/spending/${selectedUser.name}${profileParam}`,
    ).then(({ data, error: err }) => {
      if (data?.transactions) setTransactions(data.transactions);
      if (err) setError(err);
      setLoading(false);
    });
  }, [selectedUser?.name, profile]);

  return { transactions, loading, error };
}

/**
 * Fetch credit score for the logged-in user.
 * No auth required — internal endpoint.
 */
export function useCreditScore() {
  const { selectedUser } = useUser();
  const [creditScore, setCreditScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedUser?.name) {
      setLoading(false);
      return;
    }
    setLoading(true);

    coreApi(`leafybank/customers/${selectedUser.name}/credit-score`).then(
      ({ data }) => {
        if (data?.credit_score) setCreditScore(data.credit_score);
        setLoading(false);
      },
    );
  }, [selectedUser?.name]);

  return { creditScore, loading };
}

/**
 * Fetch external accounts from ALL consented institutions (multi-bank).
 * Fires parallel fetches per authorized consent, merges results.
 * Each account is tagged with _sourceInstitution and _consentId.
 */
export function useExternalAccounts() {
  const { selectedUser, authorizedConsents, consentRefreshKey, removeConsent } =
    useUser();
  const [externalAccounts, setExternalAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !selectedUser?.name ||
      !selectedUser?.bearerToken ||
      authorizedConsents.length === 0
    ) {
      setExternalAccounts([]);
      return;
    }
    setLoading(true);

    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          authorizedConsents.map(async ({ consentId, institution }) => {
            const { data, error: err } = await coreApi(
              "openfinance/secure/fetch-external-accounts-for-user/",
              {
                bearerToken: selectedUser.bearerToken,
                params: {
                  user_identifier: selectedUser.name,
                  consent_id: consentId,
                },
              },
            );
            if (err) {
              // 403 means consent is stale/revoked — remove it from context
              if (err.startsWith("403")) {
                removeConsent(consentId);
              }
              return [];
            }
            return (data?.accounts || []).map((a) => ({
              ...a,
              _sourceInstitution: institution,
              _consentId: consentId,
            }));
          }),
        );
        setExternalAccounts(results.flat());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedUser?.name,
    selectedUser?.bearerToken,
    authorizedConsents,
    consentRefreshKey,
  ]);

  return { externalAccounts, loading, error };
}

/**
 * Fetch external products/loans from ALL consented institutions (multi-bank).
 * Fires parallel fetches per authorized consent, merges results.
 * Each product is tagged with _sourceInstitution and _consentId.
 */
export function useExternalProducts() {
  const { selectedUser, authorizedConsents, consentRefreshKey, removeConsent } =
    useUser();
  const [externalProducts, setExternalProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !selectedUser?.name ||
      !selectedUser?.bearerToken ||
      authorizedConsents.length === 0
    ) {
      setExternalProducts([]);
      return;
    }
    setLoading(true);

    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          authorizedConsents.map(async ({ consentId, institution }) => {
            const { data, error: err } = await coreApi(
              "openfinance/secure/fetch-external-products-for-user/",
              {
                bearerToken: selectedUser.bearerToken,
                params: {
                  user_identifier: selectedUser.name,
                  consent_id: consentId,
                },
              },
            );
            if (err) {
              // 403 means consent is stale/revoked — remove it from context
              if (err.startsWith("403")) {
                removeConsent(consentId);
              }
              return [];
            }
            return (data?.products || []).map((p) => ({
              ...p,
              _sourceInstitution: institution,
              _consentId: consentId,
            }));
          }),
        );
        setExternalProducts(results.flat());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedUser?.name,
    selectedUser?.bearerToken,
    authorizedConsents,
    consentRefreshKey,
  ]);

  return { externalProducts, loading, error };
}

/**
 * Fetch external transactions from ALL consented institutions (multi-bank).
 * Fires parallel fetches per authorized consent, merges results.
 * Each transaction is tagged with _sourceInstitution and _consentId.
 */
export function useExternalTransactions() {
  const {
    selectedUser,
    authorizedConsents,
    consentRefreshKey,
    removeConsent,
    profile,
  } = useUser();
  const [externalTransactions, setExternalTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !selectedUser?.name ||
      !selectedUser?.bearerToken ||
      authorizedConsents.length === 0
    ) {
      setExternalTransactions([]);
      return;
    }
    setLoading(true);

    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          authorizedConsents.map(async ({ consentId, institution }) => {
            const params = {
              consent_id: consentId,
            };
            if (profile) params.profile = profile;

            const { data, error: err } = await coreApi(
              `openfinance/secure/customers/${selectedUser.name}/external-transactions`,
              {
                bearerToken: selectedUser.bearerToken,
                params,
              },
            );
            if (err) {
              if (err.startsWith("403")) {
                removeConsent(consentId);
              }
              return [];
            }
            return (data?.transactions || []).map((t) => ({
              ...t,
              _sourceInstitution:
                institution || data?.source_institution || "External",
              _consentId: consentId,
            }));
          }),
        );
        setExternalTransactions(results.flat());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedUser?.name,
    selectedUser?.bearerToken,
    authorizedConsents,
    consentRefreshKey,
    profile,
  ]);

  return { externalTransactions, loading, error };
}

// ────────────────────────────────────────────────────────────
// Composed Hooks — one per page, returns page-ready data
// These call raw hooks internally. Pages import ONE composed hook.
// See .claude/memory/coding-patterns.md for the full pattern.
// ────────────────────────────────────────────────────────────

import { formatDate, txCategory } from "./format";

/**
 * Composed hook for the Home page.
 * Aggregates accounts, credit score, and external products into dashboard-ready data.
 */
export function useHomeData() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const { creditScore } = useCreditScore();
  const { externalProducts } = useExternalProducts();

  const totalBalance = accounts
    .filter((a) => a.AccountBalance > 0)
    .reduce((sum, a) => sum + a.AccountBalance, 0);

  const internalDebt = accounts
    .filter((a) => a.AccountBalance < 0)
    .reduce((sum, a) => sum + Math.abs(a.AccountBalance), 0);

  const externalDebt = externalProducts.reduce(
    (sum, p) => sum + (p.ProductBalance || 0),
    0,
  );

  const bankAccounts = accounts.filter(
    (a) => a.AccountType === "Checking" || a.AccountType === "Savings",
  );

  const creditCards = accounts.filter((a) => a.AccountType === "CreditCard");

  const loans = externalProducts.map((p) => ({
    name: p.ProductName || p.ProductType || "Loan",
    balance: p.ProductBalance || 0,
    institution: p._sourceInstitution || p.ProductBank || "",
  }));

  return {
    totalBalance,
    totalDebt: internalDebt + externalDebt,
    bankAccounts,
    creditCards,
    creditScore,
    loans,
    loading: accountsLoading,
  };
}

/**
 * Composed hook for the Accounts page.
 * Merges internal + external accounts for OverlapCards,
 * and merges internal + external transactions for the table.
 */
export function useAccountsPageData() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const { transactions, loading: txLoading } = useTransactions();
  const { externalAccounts } = useExternalAccounts();
  const { externalTransactions, loading: extTxLoading } =
    useExternalTransactions();

  const bankAccounts = accounts
    .filter((a) => a.AccountType === "Checking" || a.AccountType === "Savings")
    .map((a) => ({
      title: `${a.AccountType} Account`,
      number: a.AccountNumber,
      amount: a.AccountBalance,
    }));

  const extCards = externalAccounts.map((a) => ({
    title: `${a.AccountType || "External"} (${a._sourceInstitution || "External"})`,
    number: a.AccountNumber || a.account_number || "",
    amount: a.AccountBalance || a.account_balance || 0,
  }));

  const allAccounts = [...bankAccounts, ...extCards];

  const internalTxns = transactions.map((t) => ({
    category: txCategory(t),
    establishment: t.Cdtr?.Nm || t.AddtlNtryInf || "\u2014",
    date: formatDate(t.BookgDt),
    amount: t.Amt?.value || 0,
    type: t.CdtDbtInd === "CRDT" ? "Credit" : "Debit",
    _isExternal: false,
    _rawDate: t.BookgDt || "",
    _rawDocument: t,
  }));

  const externalTxns = externalTransactions.map((t) => ({
    category: txCategory(t),
    establishment: t.Cdtr?.Nm || t.AddtlNtryInf || "\u2014",
    date: formatDate(t.BookgDt),
    amount: t.Amt?.value || 0,
    type: t.CdtDbtInd === "CRDT" ? "Credit" : "Debit",
    _isExternal: true,
    _sourceInstitution: t._sourceInstitution,
    _rawDate: t.BookgDt || "",
    _rawDocument: t,
  }));

  const recentTxns = [...internalTxns, ...externalTxns]
    .sort((a, b) => new Date(b._rawDate) - new Date(a._rawDate))
    .slice(0, 20);

  return {
    allAccounts,
    recentTxns,
    accountsLoading,
    txLoading: txLoading || extTxLoading,
  };
}

/**
 * Composed hook for the Credit Cards page.
 * Merges internal + external credit cards for OverlapCards,
 * and merges internal + external card transactions for the table.
 */
export function useCreditCardsPageData() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const { transactions, loading: txLoading } = useTransactions();
  const { externalAccounts } = useExternalAccounts();
  const { externalTransactions, loading: extTxLoading } =
    useExternalTransactions();

  const internalCards = accounts
    .filter((a) => a.AccountType === "CreditCard")
    .map((a) => ({
      title: a.AccountDescription || "Credit Card",
      number: a.AccountNumber,
      amount: Math.abs(a.AccountBalance),
    }));

  const externalCards = externalAccounts
    .filter(
      (a) =>
        (a.AccountType || "").toUpperCase() === "CREDITCARD" ||
        (a.Acct?.Tp || "") === "CARD",
    )
    .map((a) => ({
      title: `Credit Card (${a._sourceInstitution || "External"})`,
      number: a.AccountNumber || a.Acct?.Id || "",
      amount: Math.abs(a.AccountBalance || a.account_balance || 0),
    }));

  const creditCards = [...internalCards, ...externalCards];

  const internalCardTxns = transactions
    .filter((t) => t.Acct?.Tp === "CARD")
    .map((t) => ({
      category: txCategory(t),
      establishment: t.Cdtr?.Nm || t.AddtlNtryInf || "\u2014",
      date: formatDate(t.BookgDt),
      amount: t.Amt?.value || 0,
      _isExternal: false,
      _rawDate: t.BookgDt || "",
      _rawDocument: t,
    }));

  // External card transactions: filter by MCRD (merchant card) family code
  const externalCardTxns = externalTransactions
    .filter((t) => t.BkTxCd?.Fmly === "MCRD")
    .map((t) => ({
      category: txCategory(t),
      establishment: t.Cdtr?.Nm || t.AddtlNtryInf || "\u2014",
      date: formatDate(t.BookgDt),
      amount: t.Amt?.value || 0,
      _isExternal: true,
      _sourceInstitution: t._sourceInstitution,
      _rawDate: t.BookgDt || "",
      _rawDocument: t,
    }));

  const cardTxns = [...internalCardTxns, ...externalCardTxns]
    .sort((a, b) => new Date(b._rawDate) - new Date(a._rawDate))
    .slice(0, 20);

  return {
    creditCards,
    cardTxns,
    accountsLoading,
    txLoading: txLoading || extTxLoading,
  };
}

/**
 * Composed hook for the Loans page.
 * Transforms external products into OverlapCards format and normalized table rows.
 */
export function useLoansPageData() {
  const { hasActiveConsent } = useUser();
  const { externalProducts, loading } = useExternalProducts();

  const loanCards = externalProducts.map((p) => ({
    title: p.ProductName || p.ProductType || "Loan",
    number: p.ProductId || p._id || "",
    amount: p.ProductBalance || 0,
    originalAmount: p.ProductAmount || 0,
  }));

  const loanTableRows = externalProducts.map((p) => ({
    type: p.LoanSubType || p.ProductType || "Loan",
    institution: p._sourceInstitution || p.ProductBank || "\u2014",
    contract: p.ProductId || "\u2014",
    outstanding: p.ProductBalance || 0,
    originalAmount: p.ProductAmount || 0,
  }));

  return { loanCards, loanTableRows, loading, hasActiveConsent };
}
