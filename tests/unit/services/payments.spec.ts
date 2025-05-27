import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/services';
import { createTokenCard, getAcceptanceTokens, processPayment } from '@/services/payments/payments';

// Mock the API module
vi.mock('@/services', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

describe('Payment Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTokenCard', () => {
    it('should call api.post with correct parameters', async () => {
      const cardData = {
        number: '4242424242424242',
        exp_month: '12',
        exp_year: '25',
        cvc: '123',
        card_holder: 'Test User'
      };
      
      const mockResponse = { data: { id: 'token123', last_four: '4242' } };
      (api.post as any).mockResolvedValue(mockResponse);
      
      const result = await createTokenCard(cardData);
      
      expect(api.post).toHaveBeenCalledWith('/tokens/cards', cardData);
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle errors', async () => {
      const cardData = {
        number: '4242424242424242',
        exp_month: '12',
        exp_year: '25',
        cvc: '123',
        card_holder: 'Test User'
      };
      
      const error = new Error('API Error');
      (api.post as any).mockRejectedValue(error);
      
      await expect(createTokenCard(cardData)).rejects.toThrow('API Error');
    });
  });

  describe('getAcceptanceTokens', () => {
    it('should call api.get with correct parameters', async () => {
      const mockResponse = { data: { acceptance_token: 'token123' } };
      (api.get as any).mockResolvedValue(mockResponse);
      
      const result = await getAcceptanceTokens();
      
      expect(api.get).toHaveBeenCalledWith('/merchants/acceptance_tokens');
      expect(result).toEqual(mockResponse.data);
    });
    
    it('should handle errors', async () => {
      const error = new Error('API Error');
      (api.get as any).mockRejectedValue(error);
      
      await expect(getAcceptanceTokens()).rejects.toThrow('API Error');
    });
  });

  describe('processPayment', () => {
    it('should call api.post with correct parameters', async () => {
      const paymentData = {
        acceptance_token: 'token123',
        amount_in_cents: 100000,
        currency: 'COP',
        customer_email: 'test@example.com',
        payment_method: {
          type: 'CARD',
          token: 'token123',
          installments: 1
        },
        reference: 'ref123'
      };
      
      const mockResponse = { data: { id: 'transaction123', status: 'APPROVED' } };
      (api.post as any).mockResolvedValue(mockResponse);
      
      const result = await processPayment(paymentData);
      
      expect(api.post).toHaveBeenCalledWith('/transactions', paymentData);
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle errors', async () => {
      const paymentData = {
        acceptance_token: 'token123',
        amount_in_cents: 100000,
        currency: 'COP',
        customer_email: 'test@example.com',
        payment_method: {
          type: 'CARD',
          token: 'token123',
          installments: 1
        },
        reference: 'ref123'
      };
      
      const error = new Error('API Error');
      (api.post as any).mockRejectedValue(error);
      
      await expect(processPayment(paymentData)).rejects.toThrow('API Error');
    });
  });
});