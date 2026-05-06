import { api } from "./api";

export const authService = {
  register: async (payload) => (await api.post("/auth/register", payload)).data,
  login: async (payload) => (await api.post("/auth/login", payload)).data
};

