import { api } from "./api";

function normalizeFoodPayload(payload) {
  if (payload instanceof FormData) {
    const restaurant = payload.get("restaurant") || payload.get("restaurantId");
    const available = payload.get("isAvailable") ?? payload.get("available");

    if (restaurant) {
      payload.set("restaurant", restaurant);
      payload.set("restaurantId", restaurant);
    }
    if (available !== null && available !== undefined) {
      payload.set("isAvailable", String(available));
      payload.set("available", String(available));
    }
    return payload;
  }

  if (payload && typeof payload === "object") {
    const restaurant = payload.restaurant || payload.restaurantId;
    const available = payload.isAvailable ?? payload.available;
    return {
      ...payload,
      ...(restaurant ? { restaurant, restaurantId: restaurant } : {}),
      ...(available !== undefined ? { isAvailable: available, available } : {})
    };
  }

  return payload;
}

export const foodService = {
  getFoods: async (params = {}) => (await api.get("/foods", { params })).data,
  createFood: async (payload) =>
    (
      await api.post("/foods", normalizeFoodPayload(payload), {
        headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined
      })
    ).data,
  updateFood: async (id, payload) =>
    (
      await api.put(`/foods/${id}`, normalizeFoodPayload(payload), {
        headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined
      })
    ).data,
  deleteFood: async (id) => (await api.delete(`/foods/${id}`)).data
};

