import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  getStoredWorkspace,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
  setAuthSession,
} from "../api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [workspace, setWorkspace] = useState(() => getStoredWorkspace());
  const [accessToken, setAccessToken] = useState(() => getAccessToken());
  const [authLoading, setAuthLoading] = useState(true);

  const syncFromStorage = useCallback(() => {
    setUser(getStoredUser());
    setWorkspace(getStoredWorkspace());
    setAccessToken(getAccessToken());
  }, []);

  useEffect(() => {
    syncFromStorage();
    setAuthLoading(false);
  }, [syncFromStorage]);

  const login = useCallback(
    async (email, password) => {
      const data = await loginRequest(email, password);

      if (!data) {
        throw new Error("Login response missing.");
      }

      setAuthSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        workspace: data.workspace,
      });

      syncFromStorage();
      return data;
    },
    [syncFromStorage]
  );

  const signup = useCallback(
    async (fullName, email, password, workspaceName = "") => {
      const data = await registerRequest(
        fullName,
        email,
        password,
        workspaceName
      );

      if (!data) {
        throw new Error("Signup response missing.");
      }

      setAuthSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        workspace: data.workspace,
      });

      syncFromStorage();
      return data;
    },
    [syncFromStorage]
  );

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

      if (!data) {
        return null;
      }

      setAuthSession({
        accessToken: data.accessToken,
        refreshToken:
          data.refreshToken || localStorage.getItem("refreshToken"),
        user: data.user,
        workspace: data.workspace,
      });

      syncFromStorage();
      return data;
    } catch (error) {
      console.error("refreshAuth failed:", error);
      return null;
    }
  }, [syncFromStorage]);

  const value = useMemo(
    () => ({
      user,
      workspace,
      accessToken,
      isAuthenticated: !!accessToken && !!user,
      authLoading,
      login,
      signup,
      logout,
      refreshAuth,
    }),
    [
      user,
      workspace,
      accessToken,
      authLoading,
      login,
      signup,
      logout,
      refreshAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}