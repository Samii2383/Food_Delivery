import { api } from "../../lib/api.js";

export async function fetchRestaurants(params = {}) {
  const res = await api.get("/restaurants", { params });
  return res.data;
}

export async function fetchRestaurant(id) {
  const res = await api.get(`/restaurants/${id}`);
  return res.data;
}

export async function fetchFoods(params = {}) {
  const res = await api.get("/foods", { params });
  return res.data;
}

