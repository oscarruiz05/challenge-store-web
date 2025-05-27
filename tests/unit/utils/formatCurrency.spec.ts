import { describe, it, expect } from 'vitest';
import formatCurrency from '@/utils/formatCurrency';

describe('formatCurrency', () => {
  it('should format numbers with currency symbol and thousands separator', () => {
    expect(formatCurrency(1000)).toBe('$ 1.000');
    expect(formatCurrency(1234567)).toBe('$ 1.234.567');
  });

  it('should handle decimal values by rounding', () => {
    expect(formatCurrency(1000.49)).toBe('$ 1.000');
    expect(formatCurrency(1000.5)).toBe('$ 1.001');
    expect(formatCurrency(1234.56)).toBe('$ 1.235');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$ 0');
  });

  it('should handle negative values', () => {
    expect(formatCurrency(-1000)).toBe('-$ 1.000');
    expect(formatCurrency(-1234.56)).toBe('-$ 1.235');
  });
});