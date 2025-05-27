import { describe, it, expect } from 'vitest';
import { validateForm, validateCardNumber, validateExpiryDate, validateCVC, validateEmail } from '@/utils/validators';

describe('Validators', () => {
  describe('validateCardNumber', () => {
    it('should validate valid card numbers', () => {
      expect(validateCardNumber('4242 4242 4242 4242')).toBe(true);
      expect(validateCardNumber('4242424242424242')).toBe(true);
      expect(validateCardNumber('5555555555554444')).toBe(true);
    });
    
    it('should reject invalid card numbers', () => {
      expect(validateCardNumber('4242')).toBe(false);
      expect(validateCardNumber('')).toBe(false);
      expect(validateCardNumber('424242424242424')).toBe(false); // 15 digits
      expect(validateCardNumber('42424242424242424')).toBe(false); // 17 digits
      expect(validateCardNumber('abcdefghijklmnop')).toBe(false); // non-numeric
      expect(validateCardNumber(null as any)).toBe(false);
      expect(validateCardNumber(undefined as any)).toBe(false);
    });
  });
  
  describe('validateExpiryDate', () => {
    it('should validate valid expiry dates', () => {
      // Note: These tests assume current date is before 12/25
      expect(validateExpiryDate('12/25')).toBe(true);
      expect(validateExpiryDate('1225')).toBe(true);
      expect(validateExpiryDate('01/30')).toBe(true);
    });
    
    it('should reject invalid expiry dates', () => {
      expect(validateExpiryDate('00/00')).toBe(false);
      expect(validateExpiryDate('13/25')).toBe(false); // Invalid month
      expect(validateExpiryDate('00/25')).toBe(false); // Invalid month
      expect(validateExpiryDate('12/19')).toBe(false); // Past date
      expect(validateExpiryDate('')).toBe(false);
      expect(validateExpiryDate('12')).toBe(false); // Incomplete
      expect(validateExpiryDate('12/')).toBe(false); // Incomplete
      expect(validateExpiryDate('/25')).toBe(false); // Incomplete
      expect(validateExpiryDate(null as any)).toBe(false);
      expect(validateExpiryDate(undefined as any)).toBe(false);
    });
  });
  
  describe('validateCVC', () => {
    it('should validate valid CVC codes', () => {
      expect(validateCVC('123')).toBe(true);
      expect(validateCVC('1234')).toBe(true);
    });
    
    it('should reject invalid CVC codes', () => {
      expect(validateCVC('12')).toBe(false); // Too short
      expect(validateCVC('12345')).toBe(false); // Too long
      expect(validateCVC('')).toBe(false);
      expect(validateCVC('abc')).toBe(false); // Non-numeric
      expect(validateCVC('12a')).toBe(false); // Contains non-numeric
      expect(validateCVC(null as any)).toBe(false);
      expect(validateCVC(undefined as any)).toBe(false);
    });
  });
  
  describe('validateEmail', () => {
    it('should validate valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('user-name@domain.com')).toBe(true);
      expect(validateEmail('user123@domain.com')).toBe(true);
    });
    
    it('should reject invalid email addresses', () => {
      expect(validateEmail('test')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('test@example.')).toBe(false);
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });
  });
  
  describe('validateForm', () => {
    it('should validate a complete form', () => {
      const formData = {
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/25',
        cvc: '123',
        cardName: 'Test User',
        name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        address: 'Test Address',
        phone: '1234567890'
      };
      
      expect(validateForm(formData)).toBe(true);
    });
    
    it('should reject an incomplete form', () => {
      const formData = {
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/25',
        cvc: '123',
        cardName: 'Test User',
        name: '',  // Missing name
        last_name: 'User',
        email: 'test@example.com',
        address: 'Test Address',
        phone: '1234567890'
      };
      
      expect(validateForm(formData)).toBe(false);
    });
    
    it('should reject a form with invalid card number', () => {
      const formData = {
        cardNumber: '4242', // Invalid card number
        expiry: '12/25',
        cvc: '123',
        cardName: 'Test User',
        name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        address: 'Test Address',
        phone: '1234567890'
      };
      
      expect(validateForm(formData)).toBe(false);
    });
    
    it('should reject a form with invalid expiry date', () => {
      const formData = {
        cardNumber: '4242 4242 4242 4242',
        expiry: '13/25', // Invalid month
        cvc: '123',
        cardName: 'Test User',
        name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        address: 'Test Address',
        phone: '1234567890'
      };
      
      expect(validateForm(formData)).toBe(false);
    });
    
    it('should reject a form with invalid CVC', () => {
      const formData = {
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/25',
        cvc: '12', // Invalid CVC
        cardName: 'Test User',
        name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        address: 'Test Address',
        phone: '1234567890'
      };
      
      expect(validateForm(formData)).toBe(false);
    });
    
    it('should reject a form with invalid email', () => {
      const formData = {
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/25',
        cvc: '123',
        cardName: 'Test User',
        name: 'Test',
        last_name: 'User',
        email: 'invalid-email',  // Invalid email
        address: 'Test Address',
        phone: '1234567890'
      };
      
      expect(validateForm(formData)).toBe(false);
    });
  });
});