import { api } from "./api";

export const restaurantService = {
  getRestaurants: async (params = {}) => (await api.get("/restaurants", { params })).data,
  getRestaurant: async (id) => (await api.get(`/restaurants/${id}`)).data,
  createRestaurant: async (payload) =>
    (
      await api.post("/restaurants", payload, {
        headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined
      })
    ).data,
  updateRestaurant: async (id, payload) =>
    (
      await api.put(`/restaurants/${id}`, payload, {
        headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined
      })
    ).data,
  deleteRestaurant: async (id) => (await api.delete(`/restaurants/${id}`)).data
};

