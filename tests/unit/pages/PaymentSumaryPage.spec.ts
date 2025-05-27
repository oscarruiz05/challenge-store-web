import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import PaymentSumaryPage from '@/pages/PaymenSummary/PaymentSumaryPage.vue';
import { createTransaction } from '@/services/transactions/transactions';
import formatCurrency from '@/utils/formatCurrency';

// 🔧 Mocks globales
const routerPushMock = vi.fn();
const routerBackMock = vi.fn();

// 🧪 Mocks de dependencias
vi.mock('@/services/transactions/transactions', () => ({
  createTransaction: vi.fn()
}));

vi.mock('@/utils/formatCurrency', () => ({
  default: vi.fn((value) => `$${value}`)
}));

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: routerPushMock,
    back: routerBackMock
  }))
}));

// 🧪 Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('PaymentSumaryPage.vue', () => {
  const mockProduct = {
    id: '123',
    name: 'Test Product',
    price: 1000,
    description: 'Test Description',
    image: 'test-image.jpg'
  };

  const mockPaymentData = {
    product: mockProduct,
    quantity: 2,
    card_token: 'token123',
    acceptance_token: 'acceptance123',
    accept_personal_auth: 'personal123',
    last_four: '4242',
    customer: {
      name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      address: 'Test Address',
      number_phone: '1234567890'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'paymentData') {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });
  });

  it('loads payment data from localStorage on mount', async () => {
    const wrapper = mount(PaymentSumaryPage, {
      global: {
        stubs: {
          Button: true
        }
      }
    });

    await flushPromises();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('paymentData');
    expect(wrapper.vm.paymentData).toEqual(mockPaymentData);
    expect(wrapper.vm.product).toEqual(mockProduct);
  });

  it('redirects to home if no payment data is found', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    mount(PaymentSumaryPage, {
      global: {
        stubs: {
          Button: true
        }
      }
    });

    await flushPromises();

    expect(routerPushMock).toHaveBeenCalledWith('/');
  });

  it('processes payment when button is clicked', async () => {
    const mockTransactionResponse = {
      message: 'Transaction created',
      payment_status: 'APPROVED',
      order_id: 'order123',
      amount: 2000,
      quantity: 2
    };

    createTransaction.mockResolvedValue(mockTransactionResponse);

    const wrapper = mount(PaymentSumaryPage, {
      global: {
        stubs: {
          Button: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            emits: ['click']
          }
        }
      }
    });

    await flushPromises();

    const processPaymentButton = wrapper.findAll('button').find(btn =>
      btn.text().includes('Confirmar Pago')
    );

    await processPaymentButton!.trigger('click');
    await flushPromises();

    expect(createTransaction).toHaveBeenCalledWith({
      product_id: mockProduct.id,
      quantity: mockPaymentData.quantity,
      card_token: mockPaymentData.card_token,
      acceptance_token: mockPaymentData.acceptance_token,
      accept_personal_auth: mockPaymentData.accept_personal_auth,
      customer: mockPaymentData.customer
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'paymentResult',
      JSON.stringify(mockTransactionResponse)
    );

    expect(routerPushMock).toHaveBeenCalledWith('/payment-result');
  });

  it('handles payment processing error', async () => {
    const error = new Error('Payment processing error');
    createTransaction.mockRejectedValue(error);
    console.error = vi.fn();
    window.alert = vi.fn();

    const wrapper = mount(PaymentSumaryPage, {
      global: {
        stubs: {
          Button: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            emits: ['click']
          }
        }
      }
    });

    await flushPromises();

    const processPaymentButton = wrapper.findAll('button').find(btn =>
      btn.text().includes('Confirmar Pago')
    );

    await processPaymentButton!.trigger('click');
    await flushPromises();

    expect(console.error).toHaveBeenCalledWith('Error al procesar el pago:', error);
    expect(window.alert).toHaveBeenCalled();
    expect(wrapper.vm.isProcessing).toBe(false);
  });

  it('navigates back when back button is clicked', async () => {
    const wrapper = mount(PaymentSumaryPage, {
      global: {
        stubs: {
          Button: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            emits: ['click']
          }
        }
      }
    });

    await flushPromises();

    const backButton = wrapper.findAll('button').find(btn =>
      btn.text().includes('Volver')
    );

    await backButton!.trigger('click');

    expect(routerBackMock).toHaveBeenCalled();
  });
});
