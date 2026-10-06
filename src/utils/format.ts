/**
 * Formats a number as Saudi Riyals (SAR) without hydration mismatch.
 * Uses toLocaleString with 'en-SA' locale for consistent SSR/CSR output.
 */
export function formatSar(amount: number): string {
  if (amount == null) return '0.00';
  return amount.toLocaleString('en-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Formats a percentage value.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
