import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  getAccessToken,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
  setAuthSession,
} from "../api/auth";

export const AuthContext = createContext(null);

function getStoredUser() {
  const raw = localStorage.getItem("authUser");
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [accessToken, setAccessToken] = useState(() => getAccessToken());
  const [authLoading, setAuthLoading] = useState(true);

  const syncFromStorage = useCallback(() => {
    setUser(getStoredUser());
    setAccessToken(getAccessToken());
  }, []);

  useEffect(() => {
    syncFromStorage();
    setAuthLoading(false);
  }, [syncFromStorage]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);

    setAuthSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });

    syncFromStorage();
    return data;
  }, [syncFromStorage]);

  const signup = useCallback(async (email, password) => {
    const data = await registerRequest(email, password);

    setAuthSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });

    syncFromStorage();
    return data;
  }, [syncFromStorage]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearAuthSession();
      syncFromStorage();
    }
  }, [syncFromStorage]);

  const refreshAuth = useCallback(async () => {
    try {
      const data = await refreshRequest();

      setAuthSession({
        accessToken: data.accessToken,
        refreshToken: localStorage.getItem("refreshToken"),
        user: data.user,
      });

      syncFromStorage();
      return data;
    } catch (error) {
      clearAuthSession();
      syncFromStorage();
      throw error;
    }
  }, [syncFromStorage]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      authLoading,
      login,
      signup,
      logout,
      refreshAuth,
    }),
    [user, accessToken, authLoading, login, signup, logout, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}