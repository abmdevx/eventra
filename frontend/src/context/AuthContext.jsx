import { createContext, useContext, useMemo, useState } from "react";
import { usersApi } from "../lib/endpoints";
import { setToken, setRefreshToken, ApiRequestError } from "../lib/api";

const AuthContext = createContext(null);
const USER_KEY = "eventra_user";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  const persist = (loggedInUser, accessToken, refreshToken) => {
    setUser(loggedInUser);
    setToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
  };

  const clear = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (email, password) => {
    const data = await usersApi.login({ email: email.trim().toLowerCase(), password });
    persist(data.loggedInUser, data.accessToken, data.refreshToken);
    return data.loggedInUser;
  };

  const register = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    await usersApi.create({ name: name.trim(), email: normalizedEmail, password, role: "user" });
    const data = await usersApi.login({ email: normalizedEmail, password });
    persist(data.loggedInUser, data.accessToken);
    return data.loggedInUser;
  };

  const logout = async () => {
    try {
      await usersApi.logout();
    } catch {
      // best-effort — clear local session regardless
    }
    clear();
  };

  const updateProfile = async (data) => {
    const updated = await usersApi.update(user._id, data);
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem(USER_KEY, JSON.stringify(merged));
    return merged;
  };

  const changePassword = (data) => usersApi.changePassword(data);

  const deleteAccount = async () => {
    await usersApi.remove(user._id);
    clear();
  };

  const can = (resource, action) =>
    user?.role === "owner" || user?.permissions?.[resource]?.[action] === true;

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: ["admin", "owner"].includes(user?.role),
      isOwner: user?.role === "owner",
      permissions: user?.permissions || {},
      can,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiRequestError };
