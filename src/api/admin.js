const API_URL = "https://leadradar-backend-oziv.onrender.com/api";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 1) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries <= 0) throw error;
    await delay(2500);
    return fetchWithRetry(url, options, retries - 1);
  }
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function getStoredWorkspace() {
  const raw = localStorage.getItem("workspace");
  return raw ? JSON.parse(raw) : null;
}

export function getStoredUser() {
  const raw = localStorage.getItem("authUser");
  return raw ? JSON.parse(raw) : null;
}

export function setAuthSession({
  accessToken,
  refreshToken,
  user,
  workspace,
}) {
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
    localStorage.setItem("workspace", JSON.stringify(workspace));
  }
}

export function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
  localStorage.removeItem("workspace");
}

async function parseResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function registerRequest({
  fullName,
  email,
  password,
  workspaceName = "",
}) {
  const res = await fetchWithRetry(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: fullName?.trim(),
      email: email.trim().toLowerCase(),
      password,
      workspaceName: workspaceName?.trim(),
    }),
  });

  return parseResponse(res, "Registration failed");
}

export async function loginRequest(email, password) {
  const res = await fetchWithRetry(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  return parseResponse(res, "Login failed");
}

export async function refreshRequest() {
  const refreshToken = getRefreshToken();

  const res = await fetchWithRetry(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  return parseResponse(res, "Refresh failed");
}

export async function logoutRequest() {
  const refreshToken = getRefreshToken();

  try {
    const res = await fetchWithRetry(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    await res.json().catch(() => ({}));
  } finally {
    clearAuthSession();
  }
}