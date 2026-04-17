import axios, { type AxiosError } from "axios";
import type {
  Resume, ApiResponse, AuthPayload, User,
  ResumeUpdatePayload, AISuggestRequest, AISuggestResponse,
  ResumeSnapshot,
} from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise error messages and handle 401 silently for auth endpoints
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    const isAuthEndpoint =
      err.config?.url?.includes("/api/auth/me") ||
      err.config?.url?.includes("/api/auth/login") ||
      err.config?.url?.includes("/api/auth/register");

    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.history.replaceState(null, "", "/login");
      window.location.reload();
      return Promise.reject(err);
    }

    const serverMessage = err.response?.data?.message;
    if (serverMessage) return Promise.reject(new Error(serverMessage));

    return Promise.reject(err);
  }
);

export const authApi = {
  register: (body: { name: string; email: string; password: string; rememberMe?: boolean }) =>
    api.post<ApiResponse<AuthPayload>>("/api/auth/register", body),
  login: (body: { email: string; password: string; rememberMe?: boolean }) =>
    api.post<ApiResponse<AuthPayload>>("/api/auth/login", body),
  refresh: (refreshToken: string) =>
    api.post<ApiResponse<Pick<AuthPayload, "token">>>("/api/auth/refresh", { refreshToken }),
  logout: (refreshToken: string) =>
    api.post<ApiResponse>("/api/auth/logout", { refreshToken }),
  me: () =>
    api.get<ApiResponse<User>>("/api/auth/me"),
};

export const resumeApi = {
  list:      ()                                    => api.get<ApiResponse<Resume[]>>("/api/resumes"),
  get:       (id: string)                          => api.get<ApiResponse<Resume>>(`/api/resumes/${id}`),
  getPublic: (id: string)                          => api.get<ApiResponse<Resume>>(`/api/resumes/public/${id}`),
  create:    (body: { title: string })             => api.post<ApiResponse<Resume>>("/api/resumes", body),
  duplicate: (id: string)                          => api.post<ApiResponse<Resume>>(`/api/resumes/${id}/duplicate`),
  update:    (id: string, body: ResumeUpdatePayload) => api.put<ApiResponse<Resume>>(`/api/resumes/${id}`, body),
  delete:    (id: string)                          => api.delete<ApiResponse>(`/api/resumes/${id}`),
  saveVersion:    (id: string)                          => api.post<ApiResponse<Resume>>(`/api/resumes/${id}/versions`),
  restoreVersion: (id: string, snapshotId: string)      => api.post<ApiResponse<Resume>>(`/api/resumes/${id}/versions/${snapshotId}/restore`),
};

export const aiApi = {
  suggest: (body: AISuggestRequest) =>
    api.post<ApiResponse<AISuggestResponse>>("/api/ai/suggest", body),
};


export const userApi = {
  updateProfile:  (body: { name?: string; email?: string }) =>
    api.put<ApiResponse<User>>("/api/users/me", body),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse>("/api/users/me/password", body),
  deleteAccount:  (body: { password: string }) =>
    api.delete<ApiResponse>("/api/users/me", { data: body }),
};

export default api;
export type { ResumeSnapshot };
