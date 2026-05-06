import { api } from "../../lib/api.js";

function toFormData(obj) {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") fd.append(k, v);
  });
  return fd;
}

export const adminApi = {
  getStats: async () => (await api.get("/admin/stats")).data,

  listRestaurants: async (params = {}) =>
    (await api.get("/restaurants", { params: { limit: 12, ...params } })).data,
  createRestaurant: async (payload) =>
    (await api.post("/restaurants", toFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" }
    })).data,
  updateRestaurant: async (id, payload) =>
    (await api.put(`/restaurants/${id}`, toFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" }
    })).data,
  deleteRestaurant: async (id) => (await api.delete(`/restaurants/${id}`)).data,

  listFoods: async (params = {}) => (await api.get("/foods", { params: { limit: 12, ...params } })).data,
  createFood: async (payload) =>
    (await api.post("/foods", toFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" }
    })).data,
  updateFood: async (id, payload) =>
    (await api.put(`/foods/${id}`, toFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" }
    })).data,
  deleteFood: async (id) => (await api.delete(`/foods/${id}`)).data,

  listOrders: async (params = {}) => (await api.get("/orders", { params })).data,
  updateOrderStatus: async (id, status) => (await api.patch(`/orders/${id}/status`, { status })).data
};

