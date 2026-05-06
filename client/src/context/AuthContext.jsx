import { useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContextObject";
import { authStorage } from "../utils/authStorage.js";

function loadInitialAuth() {
  const token = authStorage.getToken();
  const user = authStorage.getUser();
  return { token, user };
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
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
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
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setUser(null);
    authStorage.clear();
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

