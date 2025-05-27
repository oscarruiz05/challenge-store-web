import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ModalForm from '../../../src/components/ModalForm.vue';
import { createTokenCard, getAcceptanceTokens } from '../../../src/services/payments/payments';

// Mock the payment gateway services
vi.mock('@/services/payments/payments', () => ({
  createTokenCard: vi.fn(),
  getAcceptanceTokens: vi.fn()
}));

// Mock formatters
vi.mock('@/utils/formatters', () => ({
  formatCardNumber: vi.fn((value) => value),
  formatExpiryDate: vi.fn((value) => value)
}));

// Mock validators
vi.mock('@/utils/validators', () => ({
  validateForm: vi.fn(() => true)
}));

describe('ModalForm.vue', () => {
  const product = {
    id: '123',
    name: 'Test Product',
    price: 1000,
    description: 'Test Description',
    image: 'test-image.jpg',
    stock: 10
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders properly when visible', () => {
    const wrapper = mount(ModalForm, {
      props: {
        visible: true,
        product,
        hasStock: true,
        quantity: 1
      },
      global: {
        stubs: {
          Dialog: {
            template: '<div><slot /></div>',
            props: ['visible', 'header']
          },
          Button: true
        }
      }
    });
    
    // Verificamos que el componente se monte correctamente
    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Test Product');
  });
  
  it('emits update:visible event when dialog is closed', async () => {
    const wrapper = mount(ModalForm, {
      props: {
        visible: true,
        product,
        hasStock: true,
        quantity: 1
      },
      global: {
        stubs: {
          Dialog: {
            template: '<div><slot></slot><button @click="$emit(\'update:visible\', false)">Close</button></div>',
            props: ['visible'],
            emits: ['update:visible']
          },
          Button: true
        }
      }
    });
    
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('update:visible')).toBeTruthy();
    expect(wrapper.emitted('update:visible')[0]).toEqual([false]);
  });
  
  it('processes payment when form is submitted', async () => {
    // Mock successful API responses
    const mockTokenResponse = {
      data: {
        id: 'token123',
        last_four: '4242'
      }
    };
    
    const mockAcceptanceTokens = {
      acceptance_token: 'acceptance123',
      accept_personal_auth: 'personal123'
    };
    
    createTokenCard.mockResolvedValue(mockTokenResponse);
    getAcceptanceTokens.mockResolvedValue(mockAcceptanceTokens);
    
    const wrapper = mount(ModalForm, {
      props: {
        visible: true,
        product,
        hasStock: true,
        quantity: 1
      },
      global: {
        stubs: {
          Dialog: {
            template: '<div><slot /></div>',
            props: ['visible', 'header']
          },
          Button: {
            template: '<button @click="$emit(\'click\')"><slot></slot></button>',
            emits: ['click']
          }
        }
      }
    });
    
    // Establecer los datos del formulario directamente en el componente
    wrapper.vm.formData = {
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
    
    // Simular el envío del formulario
    await wrapper.find('form').trigger('submit');
    
    // Verificar que se llamaron los servicios de pago
    expect(createTokenCard).toHaveBeenCalled();
    expect(getAcceptanceTokens).toHaveBeenCalled();
    
    // Verificar que se emitió el evento payment-completed
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('payment-completed')).toBeTruthy();
  });
});