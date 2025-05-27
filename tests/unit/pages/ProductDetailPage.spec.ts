import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ProductDetailPage from '../../../src/pages/ProductDetail/ProductDetailPage.vue';
import { getProductById } from '../../../src/services/products/products';
import { useRoute, useRouter } from 'vue-router';

// Mock the products service
vi.mock('@/services/products/products', () => ({
  getProductById: vi.fn()
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    params: { id: '123' }
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

// Mock localStorage
const localStorageMock = {
  setItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ProductDetailPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders loading state initially', () => {
    const wrapper = mount(ProductDetailPage, {
      global: {
        stubs: {
          RouterLink: true,
          Button: true,
          ProductDetailCard: true,
          ModalForm: true
        }
      }
    });
    
    expect(wrapper.find('.pi-spinner').exists()).toBe(true);
    expect(wrapper.text()).toContain('Cargando producto...');
  });
  
  it('renders product details after loading', async () => {
    const mockProduct = {
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      price: 1000,
      image: 'test-image.jpg',
      stock: 10
    };
    
    getProductById.mockResolvedValue(mockProduct);
    
    const wrapper = mount(ProductDetailPage, {
      global: {
        stubs: {
          RouterLink: true,
          Button: true,
          ProductDetailCard: true,
          ModalForm: true
        }
      }
    });
    
    await flushPromises();
    
    expect(wrapper.find('.pi-spinner').exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'ProductDetailCard' }).exists()).toBe(true);
  });
  
  it('handles payment completion', async () => {
    const mockProduct = {
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      price: 1000,
      image: 'test-image.jpg',
      stock: 10
    };
    
    getProductById.mockResolvedValue(mockProduct);
    
    const router = { push: vi.fn() };
    vi.mocked(useRouter).mockReturnValue(router);
    
    const wrapper = mount(ProductDetailPage, {
      global: {
        stubs: {
          RouterLink: true,
          Button: true,
          ProductDetailCard: true,
          ModalForm: true
        }
      }
    });
    
    await flushPromises();
    
    const paymentData = {
      product_id: '123',
      quantity: 1,
      card_token: 'token123',
      last_four: '4242'
    };
    
    // Call the handlePaymentCompleted method
    await wrapper.vm.handlePaymentCompleted(paymentData);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('paymentData', expect.any(String));
    expect(router.push).toHaveBeenCalledWith('/summary');
  });
  
  it('shows error message when product is not found', async () => {
    getProductById.mockRejectedValue(new Error('Product not found'));
    
    const wrapper = mount(ProductDetailPage, {
      global: {
        stubs: {
          RouterLink: true,
          Button: true,
          ProductDetailCard: true,
          ModalForm: true
        }
      }
    });
    
    await flushPromises();
    
    expect(wrapper.find('.pi-spinner').exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'ProductDetailCard' }).exists()).toBe(false);
    expect(wrapper.text()).toContain('No se encontró el producto.');
  });
});