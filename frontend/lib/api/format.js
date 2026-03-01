/**
 * Shared formatting helpers for financial data display.
 * Used by composed hooks and page components.
 */

/**
 * Format a number as USD currency string.
 * @param {number} amount
 * @returns {string} e.g. "USD 1,234"
 */
export function formatCurrency(amount) {
  return `USD ${Math.abs(amount).toLocaleString()}`;
}

/**
 * Format a date string to locale date.
 * @param {string} dateStr - ISO date string or similar
 * @returns {string} locale-formatted date, or empty string if invalid
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString();
}
