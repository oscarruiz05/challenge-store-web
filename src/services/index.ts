import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export const apiPayment = axios.create({
  baseURL: import.meta.env.VITE_PAYMENT_API_URL || "http://localhost:3000",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_PAYMENT_PUBLIC_KEY}`,
  },
});

export default api;
