import { api } from "../../lib/api.js";

export const authApi = {
  async register({ name, email, password }) {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  },
  async login({ email, password }) {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  }
};

