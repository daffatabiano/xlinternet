import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  providerService, packageService, blogService,
  reviewService, coverageService, dashboardService, leadService,
} from '@/lib/api/services';
import type { PackageFilters, ProviderFilters, CreateLeadPayload } from '@/lib/types';

// ─── QUERY KEYS ───────────────────────────────────────────────────────────────
export const queryKeys = {
  providers:      (f?: ProviderFilters) => ['providers', f] as const,
  provider:       (slug: string)         => ['provider', slug] as const,
  packages:       (f?: PackageFilters)   => ['packages', f] as const,
  package:        (slug: string)         => ['package', slug] as const,
  blog:           (p?: object)           => ['blog', p] as const,
  blogPost:       (slug: string)         => ['blog-post', slug] as const,
  reviews:        (p?: object)           => ['reviews', p] as const,
  dashboardStats: ()                     => ['dashboard-stats'] as const,
};

// ─── PROVIDERS ────────────────────────────────────────────────────────────────
export function useProviders(filters?: ProviderFilters) {
  return useQuery({
    queryKey: queryKeys.providers(filters),
    queryFn:  async () => {
      const result = await providerService.getAll(filters);
      return {
        data: result.data ?? [],
        meta: result.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
        message: '',
        success: true,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProviders() {
  return useQuery({
    queryKey: ['providers', 'featured'],
    queryFn:  async () => {
      const result = await providerService.getFeatured();
      return result.data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useProvider(slug: string) {
  return useQuery({
    queryKey: queryKeys.provider(slug),
    queryFn:  () => providerService.getBySlug(slug),
    enabled:  !!slug,
  });
}

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
export function usePackages(filters?: PackageFilters) {
  return useQuery({
    queryKey: queryKeys.packages(filters),
    queryFn:  async () => {
      const result = await packageService.getAll(filters);
      return {
        data: result.data ?? [],
        meta: result.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
        message: '',
        success: true,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedPackages() {
  return useQuery({
    queryKey: ['packages', 'featured'],
    queryFn:  async () => {
      const result = await packageService.getFeatured();
      return result.data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────
export function useBlogPosts(params?: { page?: number; limit?: number; category?: string }) {
  return useQuery({
    queryKey: queryKeys.blog(params),
    queryFn:  async () => {
      const result = await blogService.getPublished(params);
      return {
        data: result.data ?? [],
        meta: result.meta ?? { total: 0, page: params?.page || 1, limit: params?.limit || 10, totalPages: 1 },
        message: '',
        success: true,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: queryKeys.blogPost(slug),
    queryFn:  () => blogService.getBySlug(slug),
    enabled:  !!slug,
  });
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
export function useReviews(params?: { page?: number; limit?: number; providerId?: string }) {
  return useQuery({
    queryKey: queryKeys.reviews(params),
    queryFn:  async () => {
      const result = await reviewService.getApproved(params);
      return {
        data: result.data ?? [],
        meta: result.meta ?? { total: 0, page: params?.page || 1, limit: params?.limit || 10, totalPages: 1 },
        message: '',
        success: true,
      };
    },
    staleTime: 3 * 60 * 1000,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewService.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  });
}

// ─── COVERAGE ─────────────────────────────────────────────────────────────────
export function useCoverageCheck() {
  return useMutation({
    mutationFn: coverageService.check,
  });
}

export function useCoverageCities() {
  return useQuery({
    queryKey: ['coverage', 'cities'],
    queryFn:  async () => {
      const result = await coverageService.getCities();
      return result.data ?? [];
    },
    staleTime: 30 * 60 * 1000,
  });
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats(),
    queryFn:  async () => {
      const result = await dashboardService.getStats();
      return result.data ?? null;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn:  async () => {
      const result = await dashboardService.getActivity();
      return result.data ?? { recentReviews: [], recentPosts: [] };
    },
    staleTime: 60 * 1000,
  });
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
export function useAnalyticsOverview(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'overview', period],
    queryFn:  async () => {
      const result = await dashboardService.getAnalytics(period);
      return result.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── SCROLL ANIMATION ────────────────────────────────────────────────────────
export function useScrollReveal(threshold = 0.15) {
  const { ref, inView } = useInView({ threshold, triggerOnce: true });
  return { ref, inView };
}

// ─── DEBOUNCED VALUE ─────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ─── LOCAL STORAGE ───────────────────────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// ─── NAVBAR SCROLL ───────────────────────────────────────────────────────────
export function useNavbarScroll(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// ─── COMPARE SELECTION ────────────────────────────────────────────────────────
export function useCompareSelection(maxItems = 4) {
  const [selected, setSelected] = useLocalStorage<string[]>('compare_providers', []);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= maxItems) return prev;
      return [...prev, id];
    });
  }, [maxItems, setSelected]);

  const clear = useCallback(() => setSelected([]), [setSelected]);
  const isSelected = useCallback((id: string) => selected.includes(id), [selected]);

  return { selected, toggle, clear, isSelected };
}

// ─── LEADS ───────────────────────────────────────────────────────────────────
export function useCreateLead() {
  return useMutation({
    mutationFn: (data: CreateLeadPayload) => leadService.create(data),
  });
}

export function useLeads(params?: { page?: number; limit?: number; status?: string; source?: string }) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn:  () => leadService.getAll(params),
    staleTime: 30 * 1000,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: ['lead-stats'],
    queryFn:  () => leadService.getStats(),
    staleTime: 30 * 1000,
  });
}
