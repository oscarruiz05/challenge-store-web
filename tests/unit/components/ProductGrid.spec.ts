import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductGrid from '@/components/ProductGrid.vue';
import { createRouter, createWebHistory } from 'vue-router';
import formatCurrency from '@/utils/formatCurrency';

// Mock formatCurrency
vi.mock('@/utils/formatCurrency', () => ({
  default: vi.fn((value) => `$${value}`)
}));

describe('ProductGrid.vue', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/products/:id', component: {} }]
  });
  
  const props = {
    id: '123',
    title: 'Test Product',
    description: 'Test Description',
    price: 1000,
    image: 'test-image.jpg'
  };
  
  it('renders product information correctly', () => {
    const wrapper = mount(ProductGrid, {
      props,
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>'
          },
          Card: {
            template: '<div><slot name="title" /><slot name="subtitle" /><slot name="content" /><slot name="footer" /></div>'
          },
          Button: true
        }
      }
    });
    
    // Verificamos que el componente se monte correctamente
    expect(wrapper.vm).toBeDefined();
    // Verificamos que se llame a formatCurrency
    expect(formatCurrency).toHaveBeenCalledWith(1000);
  });
  
  it('links to the correct product detail page', () => {
    const wrapper = mount(ProductGrid, {
      props,
      global: {
        plugins: [router],
        stubs: {
          Card: {
            template: '<div><slot name="title" /><slot name="subtitle" /><slot name="content" /><slot name="footer" /></div>'
          },
          Button: true
        }
      }
    });
    
    // Verificamos que el componente se monte correctamente
    expect(wrapper.vm).toBeDefined();
    // Verificamos que la URL sea correcta
    expect(wrapper.html()).toContain('/products/123');
  });
});