import api from "..";

interface Card {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  card_holder: string;
}

interface PaymentData {
  acceptance_token: string;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method: {
    type: string;
    token: string;
    installments: number;
  };
  reference: string;
}

export async function createTokenCard(cardData: Card) {
  return await api.post('/tokens/cards', cardData);
}

export async function getAcceptanceTokens() {
  const response = await api.get('/merchants/acceptance_tokens');
  return response.data;
}

export async function processPayment(paymentData: PaymentData) {
  return await api.post('/transactions', paymentData);
}