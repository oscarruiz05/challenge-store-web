import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProducts, getProductById } from '../../../src/services/products/products';
import api from '../../../src/services';

// Mock the API module
vi.mock('@/services', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('Products Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch all products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', description: 'Description 1', price: 100, image: 'image1.jpg', stock: 10 },
        { id: '2', name: 'Product 2', description: 'Description 2', price: 200, image: 'image2.jpg', stock: 5 }
      ];
      
      (api.get as any).mockResolvedValue({ data: mockProducts });
      
      const result = await getProducts();
      
      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockProducts);
    });
    
    it('should propagate errors', async () => {
      const error = new Error('Network error');
      (api.get as any).mockRejectedValue(error);
      
      await expect(getProducts()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/products');
    });
  });
  
  describe('getProductById', () => {
    it('should fetch a product by id', async () => {
      const mockProduct = { 
        id: '1', 
        name: 'Product 1', 
        description: 'Description 1', 
        price: 100, 
        image: 'image1.jpg', 
        stock: 10 
      };
      
      (api.get as any).mockResolvedValue({ data: mockProduct });
      
      const result = await getProductById('1');
      
      expect(api.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
    });
    
    it('should propagate errors', async () => {
      const error = new Error('Product not found');
      (api.get as any).mockRejectedValue(error);
      
      await expect(getProductById('999')).rejects.toThrow('Product not found');
      expect(api.get).toHaveBeenCalledWith('/products/999');
    });
  });
});