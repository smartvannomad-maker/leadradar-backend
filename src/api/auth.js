const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://leadradar-backend-oziv.onrender.com/api";

export function getAccessToken() {
  return localStorage.getItem("accessToken") || null;
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken") || null;
}

export function getStoredUser() {
  const raw = localStorage.getItem("authUser");
  return raw ? JSON.parse(raw) : null;
}

export function getStoredWorkspace() {
  const raw = localStorage.getItem("authWorkspace");
  return raw ? JSON.parse(raw) : null;
}

export function setAuthSession({ accessToken, refreshToken, user, workspace }) {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (user) {
    localStorage.setItem("authUser", JSON.stringify(user));
  }

  if (workspace) {
    localStorage.setItem("authWorkspace", JSON.stringify(workspace));
  }
}

export function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
  localStorage.removeItem("authWorkspace");
}

async function parseJsonResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function registerRequest(
  fullName,
  email,
  password,
  workspaceName = ""
) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName,
      email,
      password,
      workspaceName,
    }),
  });

  return parseJsonResponse(res);
}

export async function loginRequest(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return parseJsonResponse(res);
}

export async function refreshRequest() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  return parseJsonResponse(res);
}

export async function logoutRequest() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return true;
  }

  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Logout failed.");
    }
    throw new Error("Logout failed.");
  }

  return true;
}