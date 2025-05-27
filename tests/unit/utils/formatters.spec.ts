import { describe, it, expect } from 'vitest';
import { formatCardNumber, formatExpiryDate } from '@/utils/formatters';

describe('Formatters', () => {
  describe('formatCardNumber', () => {
    it('should format card number with spaces every 4 digits', () => {
      expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
      expect(formatCardNumber('424242424242')).toBe('4242 4242 4242');
      expect(formatCardNumber('42424')).toBe('4242 4');
    });
    
    it('should handle already formatted input', () => {
      expect(formatCardNumber('4242 4242 4242 4242')).toBe('4242 4242 4242 4242');
    });
    
    it('should handle empty input', () => {
      expect(formatCardNumber('')).toBe('');
      expect(formatCardNumber(null as any)).toBe('');
      expect(formatCardNumber(undefined as any)).toBe('');
    });
    
    it('should remove non-numeric characters', () => {
      expect(formatCardNumber('4242-4242-4242-4242')).toBe('4242 4242 4242 4242');
      expect(formatCardNumber('4242abc4242def4242')).toBe('4242 4242 4242');
      expect(formatCardNumber('42a42b42c42d')).toBe('4242 4242');
    });
  });
  
  describe('formatExpiryDate', () => {
    it('should format expiry date with slash after 2 digits', () => {
      expect(formatExpiryDate('1225')).toBe('12/25');
      expect(formatExpiryDate('12')).toBe('12');
      expect(formatExpiryDate('1')).toBe('1');
    });
    
    it('should handle already formatted input', () => {
      expect(formatExpiryDate('12/25')).toBe('12/25');
    });
    
    it('should handle empty input', () => {
      expect(formatExpiryDate('')).toBe('');
      expect(formatExpiryDate(null as any)).toBe('');
      expect(formatExpiryDate(undefined as any)).toBe('');
    });
    
    it('should remove non-numeric characters', () => {
      expect(formatExpiryDate('12-25')).toBe('12/25');
      expect(formatExpiryDate('12abc25')).toBe('12/25');
      expect(formatExpiryDate('1a2b/2c5d')).toBe('12/25');
    });
    
    it('should handle partial inputs', () => {
      expect(formatExpiryDate('1')).toBe('1');
      expect(formatExpiryDate('12')).toBe('12');
      expect(formatExpiryDate('123')).toBe('12/3');
      expect(formatExpiryDate('1234')).toBe('12/34');
    });
  });
});