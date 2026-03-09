import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─── Axios Instance ────────────────────────────────────────────────────────────
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor — attach token
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('xlnet_access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor — handle 401 and network errors
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('xlnet_refresh_token');
          const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
          localStorage.setItem('xlnet_access_token', data.data.accessToken);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
          }
          return instance(originalRequest);
        } catch {
          localStorage.removeItem('xlnet_access_token');
          localStorage.removeItem('xlnet_refresh_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
        }
      }

      // Log network errors for debugging
      if (!error.response) {
        console.warn('Network error - Backend may be offline. Using mock data.', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiClient();

// ─── Typed Helpers ─────────────────────────────────────────────────────────────
export const api = {
  get: <T>(url: string, params?: object) =>
    apiClient.get<T>(url, { params }).then((r) => r.data),

  post: <T>(url: string, data?: object) =>
    apiClient.post<T>(url, data).then((r) => r.data),

  put: <T>(url: string, data?: object) =>
    apiClient.put<T>(url, data).then((r) => r.data),

  patch: <T>(url: string, data?: object) =>
    apiClient.patch<T>(url, data).then((r) => r.data),

  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((r) => r.data),

  upload: <T>(url: string, formData: FormData) =>
    apiClient
      .post<T>(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};
