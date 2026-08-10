// Thin axios wrapper around the event-api backend.
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "eventra_access_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

class ApiRequestError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// Axios instance replaces the manual BASE_URL concatenation + fetch call
const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // replaces credentials: "include"
});

// Request interceptor replaces the per-call header building
client.interceptors.request.use((config) => {
  if (config.auth !== false) {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.isForm) {
    delete config.headers["Content-Type"]; // let axios set multipart boundary
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

/**
 * request() unwraps the backend's ApiResponse { statusCode, data, message, success }
 * shape and throws ApiRequestError on failure so callers can just await + try/catch.
 */
async function request(path, { method = "GET", body, auth = true, isForm = false } = {}) {
  try {
    const res = await client.request({
      url: path,
      method,
      data: body,
      auth,     // custom flag, read by interceptor above
      isForm,   // custom flag, read by interceptor above
    });
    // axios already parses JSON and puts it on res.data — no manual text/JSON.parse needed
    return res.data?.data;
  } catch (err) {
    if (err.response) {
      // Server responded with a non-2xx status — axios throws instead of res.ok check
      const payload = err.response.data;
      const message = payload?.message || err.response.statusText || "Something went wrong";
      throw new ApiRequestError(message, err.response.status, payload?.errors || []);
    }
    // No response received — network error, equivalent to the fetch() catch block
    throw new ApiRequestError(
      "Could not reach the server. Is the API running at " + BASE_URL + "?",
      0
    );
  }
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export { ApiRequestError };