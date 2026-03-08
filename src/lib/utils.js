/**
 * Utility helpers — XSS-safe by design.
 * No dangerouslySetInnerHTML usage anywhere in the app.
 */

import { formatMAD, CURRENCY } from '../utils/currency.js';
/** Generate a simple unique ID (for mock data) */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Format a date string to locale display */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

/** Format currency — delegates to the global MAD formatter */
export { CURRENCY };
export const formatCurrency = formatMAD;

/** Capitalize first letter */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Get user initials from name */
export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Simulate random latency (300–800ms) */
export function randomDelay() {
  const ms = 300 + Math.random() * 500;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
