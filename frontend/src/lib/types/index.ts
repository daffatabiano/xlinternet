// ─── Provider ────────────────────────────────────────────────────────────────
export interface Provider {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  tagline: string;
  type: 'fiber' | 'wireless' | 'cable' | 'hybrid';
  coverageAreas: CoverageArea[];
  rating: number;
  reviewCount: number;
  minPrice: number;
  maxSpeed: number;
  features: string[];
  pros: string[];
  cons: string[];
  website: string;
  phone: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CoverageArea {
  id: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  isAvailable: boolean;
}

// ─── Package ─────────────────────────────────────────────────────────────────
export interface Package {
  id: string;
  name: string;
  slug: string;
  provider: Provider;
  providerId: string;
  speed: number;           // Mbps
  price: number;           // IDR per month
  installationFee: number; // IDR
  contractMonths: number;  // 0 = no contract
  quota: 'unlimited' | number; // GB
  latency: number;         // ms
  features: string[];
  isPopular: boolean;
  isFeatured: boolean;
  category: 'basic' | 'standard' | 'premium' | 'gaming' | 'business';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: BlogCategory;
  categoryId: string;
  author: Author;
  authorId: string;
  tags: string[];
  readTime: number;        // minutes
  viewCount: number;
  isPublished: boolean;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  userCity: string;
  provider: Provider;
  providerId: string;
  package?: Package;
  packageId?: string;
  rating: number;          // 1-5
  speedRating: number;
  priceRating: number;
  supportRating: number;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
}

// ─── Coverage ─────────────────────────────────────────────────────────────────
export interface CoverageCheckResult {
  address: string;
  city: string;
  postalCode: string;
  availableProviders: {
    provider: Provider;
    packages: Package[];
    coverageType: 'full' | 'partial';
  }[];
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────
export interface PackageFilters {
  providerId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minSpeed?: number;
  maxSpeed?: number;
  contractMonths?: number;
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'speed' | 'rating' | 'popular';
}

export interface ProviderFilters {
  type?: string;
  city?: string;
  minRating?: number;
  page?: number;
  limit?: number;
}

// ─── Admin / Auth ──────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalProviders: number;
  totalPackages: number;
  totalReviews: number;
  totalBlogPosts: number;
  totalPageViews: number;
  newReviewsThisMonth: number;
  pendingReviews: number;
  topProviders: { provider: Provider; score: number }[];
  totalLeads?: number;
  newLeadsToday?: number;
  convertedLeads?: number;
  conversionRate?: number;
}

// ─── Lead ──────────────────────────────────────────────────────────────────────
export type LeadSource = 'WEBSITE' | 'COVERAGE_CHECK' | 'PACKAGE_DETAIL' | 'COMPARE_PAGE' | 'BLOG' | 'POPUP' | 'WHATSAPP_BUTTON' | 'CONTACT_FORM' | 'STICKY_CTA';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  interest: string;
  packageId?: string;
  package?: Pick<Package, 'id' | 'name' | 'slug'>;
  providerId?: string;
  provider?: Pick<Provider, 'id' | 'name' | 'slug'>;
  source: LeadSource;
  status: LeadStatus;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  whatsappSent: boolean;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  newToday: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  conversionRate: number;
  bySource: { source: string; count: number }[];
  dailyLeads: { date: string; count: number }[];
}

export interface CreateLeadPayload {
  name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  interest: string;
  packageId?: string;
  providerId?: string;
  source?: LeadSource;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}
