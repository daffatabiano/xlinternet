import { MetadataRoute } from "next";
import { getProvidersForSitemap } from "@/lib/seo-utils";

// Revalidate setiap 1 jam
export const revalidate = 3600;

/**
 * Sitemap untuk Providers/ISP
 * Endpoint: /api/sitemap-providers
 * Dibatasi max 50,000 URLs per sitemap
 */
export async function GET(): Promise<Response> {
  try {
    const providers = await getProvidersForSitemap();

    const xml = generateSitemapXml(providers);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating providers sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}

function generateSitemapXml(entries: any[]): string {
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map(
        (entry) =>
          `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString().split("T")[0]}</lastmod>` : ""}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ""}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ""}
  </url>`
      )
      .join("\n") +
    "\n</urlset>";

  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
