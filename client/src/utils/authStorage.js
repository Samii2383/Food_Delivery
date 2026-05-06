const TOKEN_KEY = "qb_token";
const USER_KEY = "qb_user";

function getStorage() {
  // If persistence is disabled, keep auth only for this browser session (clears on close).
  return import.meta.env.VITE_PERSIST_AUTH === "false" ? sessionStorage : localStorage;
}

export const authStorage = {
  getToken() {
    return getStorage().getItem(TOKEN_KEY);
  },
  setToken(token) {
    if (token) getStorage().setItem(TOKEN_KEY, token);
    else getStorage().removeItem(TOKEN_KEY);
  },
  getUser() {
    const raw = getStorage().getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user) {
    if (user) getStorage().setItem(USER_KEY, JSON.stringify(user));
    else getStorage().removeItem(USER_KEY);
  },
  clear() {
    getStorage().removeItem(TOKEN_KEY);
    getStorage().removeItem(USER_KEY);
  }
};

