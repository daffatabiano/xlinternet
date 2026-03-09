import { MetadataRoute } from "next";
import {
  getStaticPages,
  getBlogPostsForSitemap,
  getProvidersForSitemap,
  getPackagesForSitemap,
  getCoverageAreasForSitemap,
  getISPLandingPages,
} from "@/lib/seo-utils";

// Revalidate sitemap setiap 1 jam
// Ini memastikan Google crawl sitemap terbaru dengan URL yang terupdate
export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xlfiberid.vercel.app";

/**
 * Main Sitemap dengan static pages + dynamic URLs
 *
 * STRUKTUR:
 * ✔ Static pages (home, about, contact, etc) - priority tinggi
 * ✔ Blog posts - auto-fetch dari database
 * ✔ Providers/ISP - auto-fetch dari database
 * ✔ Packages - auto-fetch dari database
 * ✔ Coverage areas - auto-fetch dari database
 * ✔ Landing pages - keyword-optimized untuk SEO
 *
 * REVALIDASI: Setiap 1 jam (3600 detik)
 * Ini menjamin Google selalu punya URL terbaru
 *
 * CATATAN: Jika total URLs > 50,000, split menjadi multiple sitemaps
 * dan gunakan sitemap index di /api/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Parallel fetch untuk performa maksimal
  const [staticPages, blogPosts, providers, packages, coverageAreas, landingPages] =
    await Promise.all([
      Promise.resolve(getStaticPages()),
      getBlogPostsForSitemap(),
      getProvidersForSitemap(),
      getPackagesForSitemap(),
      getCoverageAreasForSitemap(),
      Promise.resolve(getISPLandingPages()),
    ]);

  // Combine semua URLs
  const allUrls: MetadataRoute.Sitemap = [
    ...staticPages,
    ...blogPosts,
    ...providers,
    ...packages,
    ...coverageAreas,
    ...landingPages,
  ];

  // Hapus duplicates berdasarkan URL
  const urlMap = new Map<string, MetadataRoute.Sitemap[0]>();
  allUrls.forEach((entry) => {
    if (!urlMap.has(entry.url)) {
      urlMap.set(entry.url, entry);
    }
  });

  return Array.from(urlMap.values());
}