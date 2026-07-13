import axios from "axios";

// Central axios instance. Currently unused because all data is mocked
// client-side — but future backend calls flow through this so we get a
// single place to attach auth tokens, tenant headers, retries, etc.
const BASE = process.env.REACT_APP_BACKEND_URL || "";

export const apiClient = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 20000,
});

// Attach the active tenant slug on every outbound request so the eventual
// FastAPI backend can scope queries.
apiClient.interceptors.request.use((config) => {
  try {
    const match = window.location.pathname.match(/^\/t\/([^/]+)/);
    if (match) config.headers["X-Tenant"] = match[1];
  } catch (e) {}
  return config;
});

// Simple error interceptor — logs, no toast (leave that to the caller).
apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (process.env.NODE_ENV !== "production") console.error("[apiClient]", err?.message);
    return Promise.reject(err);
  }
);

export default apiClient;
