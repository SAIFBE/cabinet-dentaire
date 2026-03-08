/**
 * Stock Status Utility
 * Automatically computes product status based on quantity, expiry, etc.
 */

/**
 * Status → badge CSS class + icon mapping
 */
export const STATUS_CONFIG = {
  in_stock:     { badge: 'badge--success', icon: '🟢' },
  low_stock:    { badge: 'badge--warning', icon: '🟡' },
  out_of_stock: { badge: 'badge--danger',  icon: '🔴' },
  on_order:     { badge: 'badge--info',    icon: '🔵' },
  expired:      { badge: 'badge--dark',    icon: '⚫' },
  inactive:     { badge: 'badge--neutral', icon: '⚪' },
};

/**
 * All possible stock statuses (for filter dropdowns)
 */
export const STOCK_STATUSES = [
  'in_stock',
  'low_stock',
  'out_of_stock',
  'on_order',
  'expired',
  'inactive',
];

/**
 * Compute the stock status of a product.
 * Priority: inactive → expired → on_order → out_of_stock → low_stock → in_stock
 *
 * @param {Object} product
 * @returns {string} one of STOCK_STATUSES
 */
export function getStockStatus(product) {
  if (!product) return 'in_stock';

  // 1. Manual inactive
  if (product.status === 'inactive') return 'inactive';

  // 2. Expired (expiryDate < today)
  if (product.expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(product.expiryDate);
    if (expiry < today) return 'expired';
  }

  // 3. Manual on_order
  if (product.status === 'on_order') return 'on_order';

  const qty = Number(product.quantity) || 0;
  const minQty = Number(product.minStock ?? product.minQuantity) || 0;

  // 4. Out of stock
  if (qty === 0) return 'out_of_stock';

  // 5. Low stock
  if (qty <= minQty) return 'low_stock';

  // 6. Default
  return 'in_stock';
}
