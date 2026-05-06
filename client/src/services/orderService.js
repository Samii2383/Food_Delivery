import { api } from "./api";

export const orderService = {
  createOrder: async (payload) => (await api.post("/orders", payload)).data,
  getMyOrders: async (params = {}) => (await api.get("/orders/my", { params })).data,
  getAllOrders: async (params = {}) => (await api.get("/orders", { params })).data,
  updateOrderStatus: async (id, payload) => (await api.patch(`/orders/${id}/status`, payload)).data
};

