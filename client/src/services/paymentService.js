import { api } from "./api";

export const paymentService = {
  createRazorpayOrder: async (payload) => (await api.post("/payments/create-order", payload)).data,
  verifyRazorpayPayment: async (payload) => (await api.post("/payments/verify", payload)).data
};

