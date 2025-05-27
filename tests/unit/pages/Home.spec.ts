import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Home from '../../../src/pages/Home.vue';
import { getProducts } from '../../../src/services/products/products';

// Mock the products service
vi.mock('@/services/products/products', () => ({
  getProducts: vi.fn()
}));

// Mock localStorage
const localStorageMock = {
  removeItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Home.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders loading state initially', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          ProductGrid: true,
          SkeletonGridCard: true
        }
      }
    });
    
    expect(wrapper.findAllComponents({ name: 'SkeletonGridCard' }).length).toBeGreaterThan(0);
    expect(wrapper.findAllComponents({ name: 'ProductGrid' }).length).toBe(0);
  });
  
  it('renders products after loading', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', description: 'Description 1', price: 100, image: 'image1.jpg', stock: 10 },
      { id: '2', name: 'Product 2', description: 'Description 2', price: 200, image: 'image2.jpg', stock: 5 }
    ];
    
    getProducts.mockResolvedValue(mockProducts);
    
    const wrapper = mount(Home, {
      global: {
        stubs: {
          ProductGrid: true,
          SkeletonGridCard: true
        }
      }
    });
    
    await flushPromises();
    
    expect(wrapper.findAllComponents({ name: 'SkeletonGridCard' }).length).toBe(0);
    expect(wrapper.findAllComponents({ name: 'ProductGrid' }).length).toBe(2);
  });
  
  it('clears localStorage on mount', async () => {
    getProducts.mockResolvedValue([]);
    
    mount(Home);
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('paymentData');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('paymentResult');
  });
  
  it('handles error when fetching products', async () => {
    console.error = vi.fn();
    getProducts.mockRejectedValue(new Error('API Error'));
    
    const wrapper = mount(Home, {
      global: {
        stubs: {
          ProductGrid: true,
          SkeletonGridCard: true
        }
      }
    });
    
    await flushPromises();
    
    expect(console.error).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
    expect(wrapper.findAllComponents({ name: 'SkeletonGridCard' }).length).toBe(0);
    expect(wrapper.findAllComponents({ name: 'ProductGrid' }).length).toBe(0);
  });
});