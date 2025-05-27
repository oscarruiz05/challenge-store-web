import { describe, it, expect } from 'vitest';
import { getCardType, cardPatterns } from '@/utils/cardPatterns';

describe('Card Patterns', () => {
  describe('cardPatterns', () => {
    it('should have patterns for common card types', () => {
      expect(cardPatterns).toBeDefined();
      expect(cardPatterns.visa).toBeDefined();
      expect(cardPatterns.mastercard).toBeDefined();
      expect(cardPatterns.amex).toBeDefined();
      expect(cardPatterns.discover).toBeDefined();
      expect(cardPatterns.diners).toBeDefined();
      expect(cardPatterns.jcb).toBeDefined();
    });
    
    it('should correctly match Visa card numbers', () => {
      expect(cardPatterns.visa.test('4242424242424242')).toBe(true);
      expect(cardPatterns.visa.test('4111111111111111')).toBe(true);
      expect(cardPatterns.visa.test('5555555555554444')).toBe(false);
    });
    
    it('should correctly match Mastercard card numbers', () => {
      expect(cardPatterns.mastercard.test('5555555555554444')).toBe(true);
      expect(cardPatterns.mastercard.test('5105105105105100')).toBe(true);
      expect(cardPatterns.mastercard.test('4242424242424242')).toBe(false);
    });
    
    it('should correctly match Amex card numbers', () => {
      expect(cardPatterns.amex.test('378282246310005')).toBe(true);
      expect(cardPatterns.amex.test('371449635398431')).toBe(true);
      expect(cardPatterns.amex.test('4242424242424242')).toBe(false);
    });
  });
  
  describe('getCardType', () => {
    it('should identify Visa cards', () => {
      expect(getCardType('4242424242424242')).toBe('visa');
      expect(getCardType('4111111111111111')).toBe('visa');
    });
    
    it('should identify Mastercard cards', () => {
      expect(getCardType('5555555555554444')).toBe('mastercard');
      expect(getCardType('5105105105105100')).toBe('mastercard');
    });
    
    it('should identify American Express cards', () => {
      expect(getCardType('378282246310005')).toBe('amex');
      expect(getCardType('371449635398431')).toBe('amex');
    });
    
    it('should identify Discover cards', () => {
      expect(getCardType('6011111111111117')).toBe('discover');
      expect(getCardType('6011000990139424')).toBe('discover');
    });
    
    it('should identify Diners Club cards', () => {
      expect(getCardType('30569309025904')).toBe('diners');
      expect(getCardType('38520000023237')).toBe('diners');
    });
    
    it('should identify JCB cards', () => {
      expect(getCardType('3530111333300000')).toBe('jcb');
      expect(getCardType('3566002020360505')).toBe('jcb');
    });
    
    it('should return unknown for unrecognized card numbers', () => {
      expect(getCardType('9999999999999999')).toBe('unknown');
      expect(getCardType('')).toBe('unknown');
    });
    
    it('should handle card numbers with spaces', () => {
      expect(getCardType('4242 4242 4242 4242')).toBe('visa');
    });
  });
});