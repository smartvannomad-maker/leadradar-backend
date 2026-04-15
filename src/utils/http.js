// If your Node version supports global fetch, leave this file as-is.
// If not, uncomment the next line after installing node-fetch.
// import fetch from "node-fetch";

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "LeadRadar/1.0",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
}

export async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/html,application/xml,text/xml,*/*",
      "User-Agent": "LeadRadar/1.0",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}