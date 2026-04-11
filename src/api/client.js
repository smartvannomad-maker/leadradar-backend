import { getAccessToken } from "./auth";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://leadradar-backend-oziv.onrender.com/api";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 2) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries <= 0) throw error;
    await delay(2500);
    return fetchWithRetry(url, options, retries - 1);
  }
}

export async function apiFetch(path, options = {}) {
  const response = await fetchWithRetry(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(getAccessToken()
        ? { Authorization: `Bearer ${getAccessToken()}` }
        : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage =
      (typeof data === "object" && data?.message) ||
      (typeof data === "string" && data) ||
      `Request failed with status ${response.status}`;

    throw new Error(`API ${path} failed: ${errorMessage}`);
  }

  return data;
}