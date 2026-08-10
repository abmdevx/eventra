import { api } from "./api";

// ---- Users ----
export const usersApi = {
  create: (data) => api.post("/users/create-user", data, { auth: false }),
  login: (data) => api.post("/users/login-user", data, { auth: false }),
  refresh: (refreshToken) =>
    api.post("/users/refresh-access-token", { refreshToken }, { auth: false }),
  logout: () => api.get("/users/logout-user"),
  update: (id, data) => api.patch(`/users/update-user/${id}`, data),
  changePassword: (data) => api.patch("/users/change-password", data),
  remove: (id) => api.delete(`/users/delete-user/${id}`),
  getAll: () => api.get("/users/get-all-users"),
  getCurrent: () => api.get("/users/get-current-user"),
};

// ---- Events ----
export const eventsApi = {
  getAll: () => api.get("/events/get-all-events"),
  getById: (id) => api.get(`/events/get-event-id/${id}`),
  create: (data) => api.post("/events/create-event", data),
  update: (id, data) => api.put(`/events/update-event/${id}`, data),
  remove: (id) => api.delete(`/events/delete-event/${id}`),
  generateDescription: (id) => api.post(`/events/generate-description/${id}`),
};

// ---- Registrations ----
export const registrationsApi = {
  create: (data) => api.post("/registrations/create-registration", data),
  update: (id, data) => api.put(`/registrations/update-registration/${id}`, data),
  remove: (id) => api.delete(`/registrations/delete-registration/${id}`),
  getById: (id) => api.get(`/registrations/get-registration-id/${id}`),
  getMine: () => api.get("/registrations/get-my-registrations"),
  getAll: () => api.get("/registrations/get-all-registrations"),
};

// ---- Health ----
export const healthApi = {
  check: () => api.get("/health", { auth: false }),
};
