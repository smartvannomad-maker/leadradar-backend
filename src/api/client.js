import {
  clearAuthSession,
  getAccessToken,
  refreshRequest,
  setAuthSession,
} from "./auth";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  const runRequest = async (token) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    return response;
  };

  let response = await runRequest(getAccessToken());

  if (response.status === 401) {
    try {
      const refreshData = await refreshRequest();

      setAuthSession({
        accessToken: refreshData.accessToken,
        refreshToken: localStorage.getItem("refreshToken"),
        user: refreshData.user,
      });

      response = await runRequest(refreshData.accessToken);
    } catch (error) {
      clearAuthSession();
      throw error;
    }
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage =
      (typeof data === "object" && data?.message) ||
      (typeof data === "string" && data) ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
}