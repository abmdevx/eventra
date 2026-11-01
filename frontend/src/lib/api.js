import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const TOKEN_KEY = "eventra_access_token";
const REFRESH_TOKEN_KEY = "eventra_refresh_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

class ApiRequestError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = client
      .post(
        "/users/refresh-access-token",
        { refreshToken: getRefreshToken() },
        { auth: false, skipRefresh: true }
      )
      .then((response) => {
        const data = response.data?.data;
        if (!data?.newAccessToken) {
          throw new ApiRequestError("Could not refresh access token.", 401);
        }
        setToken(data.newAccessToken);
        if (data.newRefreshToken) setRefreshToken(data.newRefreshToken);
        return data.newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

client.interceptors.request.use((config) => {
  if (config.auth !== false) {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.isForm) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

async function request(path, { method = "GET", body, auth = true, isForm = false } = {}) {
  const config = {
    url: path,
    method,
    data: body,
    auth,
    isForm,
  };

  try {
    const res = await client.request(config);
    return res.data?.data;
  } catch (err) {
    if (err.response?.status === 401 && auth && !config.skipRefresh) {
      try {
        await refreshAccessToken();
        const retryResponse = await client.request(config);
        return retryResponse.data?.data;
      } catch (refreshError) {
        setToken(null);
        setRefreshToken(null);
        const payload = refreshError.response?.data;
        throw new ApiRequestError(
          payload?.message || "Your session has expired. Please log in again.",
          refreshError.response?.status || 401,
          payload?.errors || []
        );
      }
    }

    if (err.response) {
      const payload = err.response.data;
      const message = payload?.message || err.response.statusText || "Something went wrong";
      throw new ApiRequestError(message, err.response.status, payload?.errors || []);
    }
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
