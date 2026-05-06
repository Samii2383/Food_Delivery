import { api } from "../../lib/api.js";

export async function createOrder(payload) {
  const res = await api.post("/orders", payload);
  return res.data;
}

export async function fetchMyOrders(params = {}) {
  const res = await api.get("/orders/my", { params });
  return res.data;
}

