import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getCanonicalPath, getSlugString } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface SanityPost {
  slug: { current: string }
  _updatedAt: string
  publishedAt: string
  categories?: Array<{ slug?: { current: string } }>
}

async function generateSitemapUrls() {
  const baseUrl = 'https://www.geokhub.com';

  // Fetch all published posts
  const posts = await client.fetch<SanityPost[]>(`
    *[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) {
      "slug": slug.current,
      _updatedAt,
      publishedAt,
      categories[]->{
        "slug": slug.current
      }
    }
  `, {}, { next: { revalidate: 86400 } });

  // Static pages
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Main category pages
  const mainCategoryRoutes = [
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/lifestyle/category/lifestyle`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  // Subcategory pages
  const subcategoryRoutes = [
    { url: `${baseUrl}/technology/tech-news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/technology/ai`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/technology/cybersecurity`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/technology/programming`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/technology/gadgets`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/technology/emerging-tech`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/technology/cloud-devops`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/lifestyle/category/mentalhealth`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/lifestyle/category/wellness`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/lifestyle/category/weightloss`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/news/world`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/news/business`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  // Post routes
  const postRoutes = [];

  for (const post of (posts || [])) {
    const canonicalPath = getCanonicalPath(post);
    const slugValue = getSlugString(post.slug);

    if (canonicalPath.startsWith("/blogs/")) continue;

    const lastModified = new Date(post._updatedAt || post.publishedAt);
    const daysOld = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);

    let priority = 0.6;
    let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly';

    if (daysOld < 1) {
      priority = 0.9;
      changeFrequency = 'daily';
    } else if (daysOld < 7) {
      priority = 0.8;
      changeFrequency = 'daily';
    } else if (daysOld < 30) {
      priority = 0.7;
      changeFrequency = 'weekly';
    } else if (daysOld < 90) {
      priority = 0.6;
      changeFrequency = 'weekly';
    } else {
      priority = 0.5;
      changeFrequency = 'monthly';
    }

    postRoutes.push({
      url: `${baseUrl}${canonicalPath}`,
      lastModified,
      changeFrequency,
      priority,
    });
  }

  // Sort posts by lastModified (newest first)
  postRoutes.sort((a, b) => {
    if (!a.lastModified || !b.lastModified) return 0;
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  return [...staticRoutes, ...mainCategoryRoutes, ...subcategoryRoutes, ...postRoutes];
}

export async function GET() {
  try {
    const urls = await generateSitemapUrls();
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.url)}</loc>
    <lastmod>${new Date(url.lastModified || new Date()).toISOString()}</lastmod>
    <changefreq>${url.changeFrequency || 'weekly'}</changefreq>
    <priority>${url.priority || 0.5}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    // Fallback sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.geokhub.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.geokhub.com/news</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.geokhub.com/lifestyle/category/lifestyle</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}