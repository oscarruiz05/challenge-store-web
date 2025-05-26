import type {
  AcceptanceToken,
  ResponseAcceptanceToken,
} from "@/types/AcceptanceToken";
import type { Card, ResponseCard } from "@/types/Card";
import axios from "axios";

const publicKey = import.meta.env.VITE_PAYMENT_PUBLIC_KEY;

const api = axios.create({
  baseURL: import.meta.env.VITE_PAYMENT_API_URL || "",
  headers: {
    Authorization: `Bearer ${publicKey}`,
  },
});

export async function createTokenCard(data: Card): Promise<ResponseCard> {
  return api.post<ResponseCard>(`/tokens/cards`, data).then((res) => res.data);
}

export async function getAcceptanceTokens(): Promise<AcceptanceToken> {
  const response = await api
    .post<ResponseAcceptanceToken>(`/merchants/${publicKey}`)
    .then((res) => res.data);
  const data = response.data;
  return {
    acceptance_token: data.presigned_acceptance.acceptance_token,
    accept_personal_auth: data.presigned_personal_data_auth.acceptance_token,
  };
}
