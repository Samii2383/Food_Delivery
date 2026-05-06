import { useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContextObject";

const TOKEN_KEY = "qb_token";
const USER_KEY = "qb_user";

function loadInitialAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  try {
    const user = rawUser ? JSON.parse(rawUser) : null;
    return { token, user };
  } catch {
    return { token, user: null };
  }
}

export function AuthProvider({ children }) {
  const initial = loadInitialAuth();
  const [token, setToken] = useState(initial.token || "");
  const [user, setUser] = useState(initial.user);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token);

  async function login(payload) {
    setLoading(true);
    try {
      const res = await authService.login(payload);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const res = await authService.register(payload);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      return res;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken("");
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthenticated, loading, login, register, logout }),
    [token, user, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

