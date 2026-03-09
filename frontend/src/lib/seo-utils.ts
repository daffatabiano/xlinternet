/**
 * SEO Utilities - Helper functions untuk sitemap generation
 */

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xlfiberid.vercel.app';

/**
 * Fetch Blog Posts untuk sitemap
 */
export async function getBlogPostsForSitemap(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog?published=true&limit=50000`, {
      next: { revalidate: 3600 }, // 1 jam
    });

    if (!res.ok) return [];

    const data = await res.json();
    const posts = Array.isArray(data) ? data : data.data || [];

    return posts.map((post: any) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch Providers/ISP untuk sitemap
 */
export async function getProvidersForSitemap(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/providers?active=true&limit=50000`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const providers = Array.isArray(data) ? data : data.data || [];

    return providers.map((provider: any) => ({
      url: `${SITE_URL}/provider/${provider.slug}`,
      lastModified: provider.updatedAt ? new Date(provider.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
}

/**
 * Fetch Packages untuk sitemap
 */
export async function getPackagesForSitemap(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/packages?active=true&limit=50000`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const packages = Array.isArray(data) ? data : data.data || [];

    return packages.map((pkg: any) => ({
      url: `${SITE_URL}/paket-internet/${pkg.slug}`,
      lastModified: pkg.updatedAt ? new Date(pkg.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

/**
 * Fetch Coverage Areas untuk sitemap (Dynamic Location Pages)
 */
export async function getCoverageAreasForSitemap(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/coverage?active=true&limit=50000`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const areas = Array.isArray(data) ? data : data.data || [];

    // Group by city to avoid duplicates
    const uniqueCities = new Map<string, any>();
    areas.forEach((area: any) => {
      const key = `${area.city}-${area.province}`;
      if (!uniqueCities.has(key)) {
        uniqueCities.set(key, area);
      }
    });

    return Array.from(uniqueCities.values()).map((area: any) => ({
      url: `${SITE_URL}/coverage-check/${area.city.toLowerCase().replace(/\s+/g, '-')}-${area.province.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching coverage areas:', error);
    return [];
  }
}

/**
 * ISP-specific landing pages (keywords untuk Jakarta)
 */
export function getISPLandingPages(): SitemapEntry[] {
  const keywords = [
    { slug: 'wifi-murah-jakarta', city: 'Jakarta' },
    { slug: 'wifi-cepat-jakarta', city: 'Jakarta' },
    { slug: 'internet-fiber-jakarta', city: 'Jakarta' },
    { slug: 'wifi-bisnis-jakarta', city: 'Jakarta' },
    { slug: 'paket-internet-murah-bandung', city: 'Bandung' },
    { slug: 'wifi-cepat-bandung', city: 'Bandung' },
    { slug: 'internet-rumah-surabaya', city: 'Surabaya' },
    { slug: 'wifi-gaming-jakarta', city: 'Jakarta' },
    { slug: 'internet-stabil-jakarta', city: 'Jakarta' },
    { slug: 'provider-terbaik-jakarta', city: 'Jakarta' },
  ];

  return keywords.map((kw) => ({
    url: `${SITE_URL}/landing/${kw.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

/**
 * Static Pages
 */
export function getStaticPages(): SitemapEntry[] {
  const currentDate = new Date();

  return [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/paket-internet`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/provider`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/coverage-check`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/review`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/kebijakan-privasi`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/syarat-dan-ketentuan`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/careers`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
