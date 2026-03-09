import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xlfiberid.vercel.app";

/**
 * robots.ts - Petunjuk untuk search engine crawlers
 *
 * Fitur:
 * ✔ Allow semua crawler kecuali spammers
 * ✔ Point ke semua sitemaps (utama + subs)
 * ✔ Crawl delay untuk proteksi server
 * ✔ Block bot yang tidak perlu
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─── Allow Googlebot dan search engines ──────────────────────────────────
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp", "YandexBot", "BaiduSpider"],
        allow: ["/"],
        disallow: ["/admin", "/api", "/private", "/.next"],
        crawlDelay: 1, // 1 detik delay antar request
      },

      // ─── Default rule untuk semua crawler ──────────────────────────────────
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin", "/api", "/private", "/.next", "/_next"],
        crawlDelay: 2, // 2 detik delay untuk crawler umum
      },

      // ─── Block bad actors ──────────────────────────────────────────────────
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "MJ12bot",
          "DotBot",
          "SiteAuditBot",
        ],
        disallow: ["/"],
      },
    ],

    // ─── Sitemap Configuration ────────────────────────────────────────────────
    // Includes: Static pages + Dynamic sitemaps
    // Auto-updated setiap 1 jam
    sitemap: [
      `${SITE_URL}/sitemap.xml`, // Main sitemap dengan static pages
      `${SITE_URL}/api/sitemap-blog`, // Blog posts sitemap
      `${SITE_URL}/api/sitemap-providers`, // Providers/ISP sitemap
      `${SITE_URL}/api/sitemap-packages`, // Packages/Paket internet sitemap
      `${SITE_URL}/api/sitemap-coverage`, // Coverage areas sitemap
      `${SITE_URL}/api/sitemap-landing`, // ISP landing pages sitemap
    ],
  };
}
