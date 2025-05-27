import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTransaction } from '@/services/transactions/transactions';
import api from '@/services';

// Mock the API module
vi.mock('@/services', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('Transactions Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should call api.post with correct parameters', async () => {
      const transactionData = {
        product_id: '123',
        quantity: 1,
        card_token: 'token123',
        acceptance_token: 'acceptance123',
        accept_personal_auth: 'personal123',
        customer: {
          name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          address: 'Test Address',
          number_phone: '1234567890'
        }
      };
      
      const mockResponse = { 
        data: { 
          message: 'Transaction created',
          payment_status: 'APPROVED',
          order_id: 'order123',
          amount: 1000,
          quantity: 1
        } 
      };
      
      (api.post as any).mockResolvedValue(mockResponse);
      
      const result = await createTransaction(transactionData);
      
      expect(api.post).toHaveBeenCalledWith('/transactions', transactionData);
      expect(result).toEqual(mockResponse.data);
    });
    
    it('should handle errors', async () => {
      const transactionData = {
        product_id: '123',
        quantity: 1,
        card_token: 'token123',
        acceptance_token: 'acceptance123',
        accept_personal_auth: 'personal123',
        customer: {
          name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          address: 'Test Address',
          number_phone: '1234567890'
        }
      };
      
      const error = new Error('API Error');
      (api.post as any).mockRejectedValue(error);
      
      await expect(createTransaction(transactionData)).rejects.toThrow('API Error');
      expect(api.post).toHaveBeenCalledWith('/transactions', transactionData);
    });
  });
});