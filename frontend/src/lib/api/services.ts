import { api } from './client';
import type {
  Provider, Package, BlogPost, BlogCategory, Review, CoverageCheckResult,
  PaginatedResponse, ApiResponse, PackageFilters, ProviderFilters,
  DashboardStats, AuthTokens, LoginCredentials,
  Lead, LeadStats, CreateLeadPayload,
} from '@/lib/types';

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<AuthTokens>>('/auth/login', credentials),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),

  me: () =>
    api.get<ApiResponse<{ id: string; name: string; email: string; role: string }>>('/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken }),
};

// ─── PROVIDERS ────────────────────────────────────────────────────────────────
export const providerService = {
  getAll: (filters?: ProviderFilters) =>
    api.get<PaginatedResponse<Provider>>('/providers', filters),

  getFeatured: () =>
    api.get<ApiResponse<Provider[]>>('/providers/featured'),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Provider>>(`/providers/${slug}`),

  getById: (id: string) =>
    api.get<ApiResponse<Provider>>(`/providers/id/${id}`),

  create: (data: FormData) =>
    api.upload<ApiResponse<Provider>>('/providers', data),

  update: (id: string, data: FormData) =>
    api.upload<ApiResponse<Provider>>(`/providers/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/providers/${id}`),

  toggleActive: (id: string) =>
    api.patch<ApiResponse<Provider>>(`/providers/${id}/toggle-active`),
};

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
export const packageService = {
  getAll: (filters?: PackageFilters) =>
    api.get<PaginatedResponse<Package>>('/packages', filters),

  getFeatured: () =>
    api.get<ApiResponse<Package[]>>('/packages/featured'),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Package>>(`/packages/${slug}`),

  getById: (id: string) =>
    api.get<ApiResponse<Package>>(`/packages/id/${id}`),

  getByProvider: (providerId: string) =>
    api.get<ApiResponse<Package[]>>(`/packages/provider/${providerId}`),

  create: (data: Partial<Package>) =>
    api.post<ApiResponse<Package>>('/packages', data),

  update: (id: string, data: Partial<Package>) =>
    api.put<ApiResponse<Package>>(`/packages/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/packages/${id}`),
};

// ─── BLOG ─────────────────────────────────────────────────────────────────────
export const blogService = {
  getAll: (params?: { page?: number; limit?: number; category?: string; tag?: string }) =>
    api.get<PaginatedResponse<BlogPost>>('/blog', params),

  getPublished: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get<PaginatedResponse<BlogPost>>('/blog/published', params),

  getCategories: () =>
    api.get<ApiResponse<BlogCategory[]>>('/blog/categories'),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<BlogPost>>(`/blog/${slug}`),

  getById: (id: string) =>
    api.get<ApiResponse<BlogPost>>(`/blog/id/${id}`),

  getRelated: (id: string) =>
    api.get<ApiResponse<BlogPost[]>>(`/blog/${id}/related`),

  create: (data: FormData) =>
    api.upload<ApiResponse<BlogPost>>('/blog', data),

  update: (id: string, data: FormData) =>
    api.upload<ApiResponse<BlogPost>>(`/blog/${id}`, data),

  publish: (id: string) =>
    api.patch<ApiResponse<BlogPost>>(`/blog/${id}/publish`),

  unpublish: (id: string) =>
    api.patch<ApiResponse<BlogPost>>(`/blog/${id}/unpublish`),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/blog/${id}`),
};

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
export const reviewService = {
  getAll: (params?: { page?: number; limit?: number; providerId?: string; approved?: boolean }) =>
    api.get<PaginatedResponse<Review>>('/reviews', params),

  getApproved: (params?: { page?: number; limit?: number; providerId?: string }) =>
    api.get<PaginatedResponse<Review>>('/reviews/approved', params),

  getByProvider: (providerId: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Review>>(`/reviews/provider/${providerId}`, params),

  create: (data: Partial<Review>) =>
    api.post<ApiResponse<Review>>('/reviews', data),

  approve: (id: string) =>
    api.patch<ApiResponse<Review>>(`/reviews/${id}/approve`),

  reject: (id: string) =>
    api.patch<ApiResponse<Review>>(`/reviews/${id}/reject`),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/reviews/${id}`),
};

// ─── COVERAGE ─────────────────────────────────────────────────────────────────
export const coverageService = {
  check: (data: { address: string; city: string; postalCode: string }) =>
    api.post<ApiResponse<CoverageCheckResult>>('/coverage/check', data),

  getCities: () =>
    api.get<ApiResponse<string[]>>('/coverage/cities'),
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export const dashboardService = {
  getStats: () =>
    api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),

  getActivity: () =>
    api.get<ApiResponse<{ recentReviews: any[]; recentPosts: any[] }>>('/dashboard/activity'),

  getAnalytics: (period?: string) =>
    api.get<ApiResponse<any>>('/dashboard/analytics', period ? { period } : undefined),
};

// ─── LEADS ────────────────────────────────────────────────────────────────────
export const leadService = {
  create: (data: CreateLeadPayload) =>
    api.post<ApiResponse<{ lead: Lead; whatsappUrl: string }>>('/leads', data),

  getAll: (params?: { page?: number; limit?: number; status?: string; source?: string; dateFrom?: string; dateTo?: string }) =>
    api.get<PaginatedResponse<Lead>>('/leads', params),

  getById: (id: string) =>
    api.get<ApiResponse<Lead>>(`/leads/${id}`),

  getStats: () =>
    api.get<ApiResponse<LeadStats>>('/leads/stats'),

  updateStatus: (id: string, data: { status: string; notes?: string }) =>
    api.patch<ApiResponse<Lead>>(`/leads/${id}/status`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/leads/${id}`),

  trackVisit: (data: { page: string; referrer?: string }) =>
    api.post('/leads/track-visit', data),
};
