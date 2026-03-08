/**
 * Currency utility — Moroccan Dirham (MAD)
 * 
 * All monetary formatting in the UI must go through formatMAD().
 * Numeric values in the data layer remain plain numbers.
 */

export const CURRENCY = 'MAD';

const madFormatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a numeric amount as Moroccan Dirham.
 * @param {number} amount
 * @returns {string} e.g. "250,00 MAD"
 */
export function formatMAD(amount) {
  if (amount == null || isNaN(amount)) return madFormatter.format(0);
  return madFormatter.format(amount);
}
