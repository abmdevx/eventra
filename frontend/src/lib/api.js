// Thin fetch wrapper around the event-api backend.
// No axios / no extra HTTP dependency — just the native fetch API.

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

/**
 * request() unwraps the backend's ApiResponse { statusCode, data, message, success }
 * shape and throws ApiRequestError on failure so callers can just await + try/catch.
 */
async function request(path, { method = "GET", body, auth = true, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr) {
    throw new ApiRequestError(
      "Could not reach the server. Is the API running at " + BASE_URL + "?",
      0
    );
  }

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const message = payload?.message || res.statusText || "Something went wrong";
    throw new ApiRequestError(message, res.status, payload?.errors || []);
  }

  return payload?.data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export { ApiRequestError };
