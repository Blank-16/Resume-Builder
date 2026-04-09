import axios from "axios";
import type { Resume, ApiResponse, AuthPayload, User, ResumeUpdatePayload } from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — but NOT during the /me bootstrap call (that handles its own catch)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthEndpoint =
      err.config?.url?.includes("/api/auth/me") ||
      err.config?.url?.includes("/api/auth/login") ||
      err.config?.url?.includes("/api/auth/register");

    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      // Use replaceState so the browser back-button works correctly
      window.history.replaceState(null, "", "/login");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthPayload>>("/api/auth/register", body),
  login: (body: { email: string; password: string }) =>
    api.post<ApiResponse<AuthPayload>>("/api/auth/login", body),
  me: () => api.get<ApiResponse<User>>("/api/auth/me"),
};

export const resumeApi = {
  list: () =>
    api.get<ApiResponse<Resume[]>>("/api/resumes"),
  get: (id: string) =>
    api.get<ApiResponse<Resume>>(`/api/resumes/${id}`),
  getPublic: (id: string) =>
    api.get<ApiResponse<Resume>>(`/api/resumes/public/${id}`),
  create: (body: { title: string }) =>
    api.post<ApiResponse<Resume>>("/api/resumes", body),
  update: (id: string, body: ResumeUpdatePayload) =>
    api.put<ApiResponse<Resume>>(`/api/resumes/${id}`, body),
  delete: (id: string) =>
    api.delete<ApiResponse>(`/api/resumes/${id}`),
};

export default api;
