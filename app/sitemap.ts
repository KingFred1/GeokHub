import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { getCanonicalPath, getSlugString } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 3600 Change to 1 hour for faster updates

// Simple XML escaping
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeUrl(url: string): string {
  if (!url) return '';
  return escapeXml(url).replace(/ /g, '%20');
}

interface SanityPost {
  slug: { current: string }
  _updatedAt: string
  publishedAt: string
  categories?: Array<{ slug?: { current: string } }>
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.geokhub.com';

  try {
    // ========================
    // FETCH ALL PUBLISHED POSTS
    // ========================
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

    console.log(`📊 Total posts fetched: ${posts?.length || 0}`);

    // ========================
    // STATIC PAGES (HIGH PRIORITY)
    // ========================
    const staticRoutes: MetadataRoute.Sitemap = [
      { 
        url: escapeUrl(baseUrl), 
        lastModified: new Date(), 
        changeFrequency: 'daily',
        priority: 1.0 
      },
      { 
        url: escapeUrl(`${baseUrl}/about`), 
        lastModified: new Date(), 
        changeFrequency: 'weekly',
        priority: 0.5 
      },
      { 
        url: escapeUrl(`${baseUrl}/contact`), 
        lastModified: new Date(), 
        changeFrequency: 'monthly',
        priority: 0.4 
      },
    ];

    // ========================
    // MAIN CATEGORY PAGES
    // ========================
    const mainCategoryRoutes: MetadataRoute.Sitemap = [
      { 
        url: escapeUrl(`${baseUrl}/news`), 
        lastModified: new Date(), 
        changeFrequency: 'daily',
        priority: 0.9 
      },
      { 
        url: escapeUrl(`${baseUrl}/lifestyle/category/lifestyle`), 
        lastModified: new Date(), 
        changeFrequency: 'daily',
        priority: 0.9 
      },
    ];

    // ========================
    // CATEGORY SUBCATEGORIES
    // ========================
    const subcategoryRoutes: MetadataRoute.Sitemap = [
      // Technology
      { url: escapeUrl(`${baseUrl}/technology/tech-news`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
      { url: escapeUrl(`${baseUrl}/technology/ai`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/technology/cybersecurity`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/technology/programming`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/technology/gadgets`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/technology/emerging-tech`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/technology/cloud-devops`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      
      // Lifestyle categories
      { url: escapeUrl(`${baseUrl}/lifestyle/category/mentalhealth`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/lifestyle/category/wellness`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/lifestyle/category/weightloss`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      
      // News
      { url: escapeUrl(`${baseUrl}/news/world`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/news/business`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    ];

    // ========================
    // POST URLS - Optimized for indexing
    // ========================
    const postRoutes: MetadataRoute.Sitemap = [];

    for (const post of (posts || [])) {
      const canonicalPath = getCanonicalPath(post);
      const slugValue = getSlugString(post.slug);

      if (canonicalPath.startsWith("/blogs/")) {
        console.log(`⚠️ Skipping post with uncategorised slug: ${slugValue}`);
        continue;
      }

      const lastModified = new Date(post._updatedAt || post.publishedAt);
      const postAge = Date.now() - lastModified.getTime();
      const daysOld = postAge / (1000 * 60 * 60 * 24);

      // Higher priority for newer posts to get indexed faster
      let priority = 0.6;
      let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly';

      if (daysOld < 1) { // Less than 1 day old
        priority = 0.9;
        changeFrequency = 'daily';
      } else if (daysOld < 7) { // Less than 1 week
        priority = 0.8;
        changeFrequency = 'daily';
      } else if (daysOld < 30) { // Less than 1 month
        priority = 0.7;
        changeFrequency = 'weekly';
      } else if (daysOld < 90) { // Less than 3 months
        priority = 0.6;
        changeFrequency = 'weekly';
      } else {
        priority = 0.5;
        changeFrequency = 'monthly';
      }

      const postUrl = `${baseUrl}${canonicalPath}`;
      postRoutes.push({
        url: escapeUrl(postUrl),
        lastModified,
        changeFrequency,
        priority,
      });
    }

    // Sort posts by lastModified (newest first) for better indexing
    postRoutes.sort((a, b) => {
      if (!a.lastModified || !b.lastModified) return 0;
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    });

    const allUrls = [
      ...staticRoutes,
      ...mainCategoryRoutes,
      ...subcategoryRoutes,
      ...postRoutes,
    ];

    console.log(`\n✅ Sitemap generated with ${allUrls.length} URLs`);
    console.log(`📊 New posts (last 24h): ${postRoutes.filter(p => p.priority === 0.9).length}`);
    console.log(`📊 Recent posts (last 7d): ${postRoutes.filter(p => p.priority === 0.8).length}`);

    return allUrls;

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return [
      { url: escapeUrl(baseUrl), lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: escapeUrl(`${baseUrl}/news`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
      { url: escapeUrl(`${baseUrl}/lifestyle/category/lifestyle`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ];
  }
}