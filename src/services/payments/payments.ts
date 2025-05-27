import { apiPayment } from "..";

interface Card {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  card_holder: string;
}

export async function createTokenCard(cardData: Card) {
  return await apiPayment.post('/tokens/cards', cardData).then((res) => res.data);
}

export async function getAcceptanceTokens() {
  const response = await apiPayment.get(`/merchants/${import.meta.env.VITE_PAYMENT_PUBLIC_KEY}`).then((res) => res.data);
  const data = response.data;

  return {
    acceptance_token: data.presigned_acceptance.acceptance_token,
    accept_personal_auth: data.presigned_personal_data_auth.acceptance_token,
  }
}
