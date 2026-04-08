import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getCanonicalPath, getSlugString } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour for faster updates

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
  categories?: Array<{ 
    slug?: { current: string }
    title?: string
    parent?: { slug?: { current: string }, title?: string }
  }>
}

async function generateSitemapUrls() {
  const baseUrl = 'https://www.geokhub.com';

  // Fetch only AI and Cybersecurity published posts for better performance
  const posts = await client.fetch<SanityPost[]>(`
    *[_type == "post" && defined(slug.current) && publishedAt <= now() && (
      count((categories[]->slug.current)[@ in ["ai", "artificial-intelligence", "cybersecurity", "security"]]) > 0 ||
      count((categories[]->parent->slug.current)[@ in ["ai", "artificial-intelligence", "cybersecurity", "security"]]) > 0 ||
      count((lower(categories[]->title))[@ in ["ai", "artificial intelligence", "cybersecurity", "security"]]) > 0 ||
      count((lower(categories[]->parent->title))[@ in ["ai", "artificial intelligence", "cybersecurity", "security"]]) > 0
    )] | order(publishedAt desc) {
      "slug": slug.current,
      _updatedAt,
      publishedAt,
      categories[]->{
        title,
        "slug": slug.current,
        parent->{
          title,
          "slug": slug.current
        }
      }
    }
  `, {}, { next: { revalidate: 3600 } }); // Revalidate every hour

  // Static pages - keep only essential ones
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Active category pages - only AI and Cybersecurity
  const categoryRoutes = [
    { url: `${baseUrl}/technology/ai`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/technology/cybersecurity`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
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

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
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
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // Cache for 30 minutes
      },
    });
  } catch {
    // Fallback sitemap on error - only active pages
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.geokhub.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.geokhub.com/technology/ai</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.geokhub.com/technology/cybersecurity</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
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