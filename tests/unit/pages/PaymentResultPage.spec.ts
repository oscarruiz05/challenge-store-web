import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import PaymentResultPage from "@/pages/PaymentResult/PaymentResultPage.vue";
import { StatusTransactionEnum } from "@/enums/statusTransactionEnum";
import formatCurrency from "@/utils/formatCurrency";
import mockedSocket from '@/plugins/socket';

// Mocks globales
const routerPushMock = vi.fn();

vi.mock("@/utils/formatCurrency", () => ({
  default: vi.fn((value) => `$${value}`),
}));

vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => ({
    push: routerPushMock,
  })),
}));

vi.mock("@/plugins/socket", () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
    on: vi.fn(),
    off: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("PaymentResultPage.vue", () => {
  const mockProduct = {
    id: "123",
    name: "Test Product",
    price: 1000,
    description: "Test Description",
    image: "test-image.jpg",
  };

  const mockPaymentData = {
    product: mockProduct,
    quantity: 2,
  };

  const mockApprovedResult = {
    message: "Payment approved",
    payment_status: StatusTransactionEnum.APPROVED,
    order_id: "order123",
    amount: 2000,
    quantity: 2,
  };

  const mockPendingResult = {
    message: "Payment pending",
    payment_status: StatusTransactionEnum.PENDING,
    order_id: "order123",
    amount: 2000,
    quantity: 2,
  };

  const mockDeclinedResult = {
    message: "Payment declined",
    payment_status: StatusTransactionEnum.DECLINED,
    order_id: "order123",
    amount: 2000,
    quantity: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });
  });

  it("loads payment result from localStorage on mount", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return JSON.stringify(mockApprovedResult);
      } else if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });

    const wrapper = mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: true,
        },
      },
    });

    await flushPromises();

    expect(localStorageMock.getItem).toHaveBeenCalledWith("paymentResult");
    expect(localStorageMock.getItem).toHaveBeenCalledWith("paymentData");
    expect(wrapper.vm.paymentResult).toEqual(mockApprovedResult);
    expect(wrapper.vm.productInfo).toEqual(mockProduct);
  });

  it("redirects to home if no payment result is found", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return null;
      }
      return null;
    });

    mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: true,
        },
      },
    });

    await flushPromises();

    expect(routerPushMock).toHaveBeenCalledWith("/");
  });

  it("connects to socket for pending payments", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return JSON.stringify(mockPendingResult);
      } else if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });

    mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: true,
        },
      },
    });

    await flushPromises();

    expect(mockedSocket.connect).toHaveBeenCalled();
    expect(mockedSocket.on).toHaveBeenCalledWith(
      `transaction-status-${mockPendingResult.order_id}`,
      expect.any(Function)
    );
  });

  it("does not connect to socket for non-pending payments", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return JSON.stringify(mockApprovedResult);
      } else if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });

    mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: true,
        },
      },
    });

    await flushPromises();

    expect(mockedSocket.connect).not.toHaveBeenCalled();
  });

  it("disconnects from socket on unmount", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return JSON.stringify(mockPendingResult);
      } else if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });

    mockedSocket.connected = true;

    const wrapper = mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: true,
        },
      },
    });

    await flushPromises();
    wrapper.unmount();

    expect(mockedSocket.disconnect).toHaveBeenCalled();
  });

  it("navigates to home and clears localStorage when go to store button is clicked", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return JSON.stringify(mockApprovedResult);
      } else if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });

    const wrapper = mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: {
            template: "<button @click=\"$emit('click')\"><slot /></button>",
            emits: ["click"],
          },
        },
      },
    });

    await flushPromises();

    const goToStoreButton = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Volver a la tienda"));

    await goToStoreButton!.trigger("click");

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("paymentData");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("paymentResult");
    expect(routerPushMock).toHaveBeenCalledWith("/");
  });

  it("displays success message for approved payments", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return JSON.stringify(mockApprovedResult);
      } else if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });

    const wrapper = mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain("¡Pago Exitoso!");
    expect(wrapper.text()).toContain("Tu pago ha sido procesado correctamente");
    expect(wrapper.text()).toContain(mockApprovedResult.order_id);
  });

  it("displays pending message for pending payments", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return JSON.stringify(mockPendingResult);
      } else if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });

    const wrapper = mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain("Pago en Proceso");
    expect(wrapper.text()).toContain("Tu pago está siendo procesado");
    expect(wrapper.text()).toContain(mockPendingResult.order_id);
  });

  it("displays error message for declined payments", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "paymentResult") {
        return JSON.stringify(mockDeclinedResult);
      } else if (key === "paymentData") {
        return JSON.stringify(mockPaymentData);
      }
      return null;
    });

    const wrapper = mount(PaymentResultPage, {
      global: {
        stubs: {
          Button: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain("Pago Fallido");
    expect(wrapper.text()).toContain("Payment declined");
  });
});
