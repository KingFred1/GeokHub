import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.geokhub.com';
  const currentDate = new Date().toISOString();

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${baseUrl}/sitemap.xml</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${baseUrl}/sitemap-news.xml</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>
    </sitemapindex>`,
    {
      headers: { 'Content-Type': 'application/xml' },
    }
  );
}
