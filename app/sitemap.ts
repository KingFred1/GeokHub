import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { getCanonicalPath, getSlugString } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

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
    // FETCH ONLY ESSENTIAL POSTS - FIXED QUERY
    // ========================
    const posts = await client.fetch<SanityPost[]>(`
      *[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc)[0...2000] {
        "slug": slug.current,
        _updatedAt,
        publishedAt,
        categories[]->{
          "slug": slug.current
        }
      }
    `, {}, { next: { revalidate: 86400 } });

    console.log(`📊 Total posts fetched: ${posts?.length || 0}`);
    
    if (posts && posts.length > 0) {
      console.log('🔍 Sample post data:');
      console.log('First post:', {
        slug: posts[0].slug,
        hasSlug: !!posts[0].slug,
        slugType: typeof posts[0].slug,
        categories: posts[0].categories
      });
    }

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
        changeFrequency: 'monthly',
        priority: 0.3 
      },
    ];

    // ========================
    // MAIN CATEGORY PAGES (MEDIUM PRIORITY)
    // ========================
    const mainCategoryRoutes: MetadataRoute.Sitemap = [
      { 
        url: escapeUrl(`${baseUrl}/technology`), 
        lastModified: new Date(), 
        changeFrequency: 'daily',
        priority: 0.8 
      },
      { 
        url: escapeUrl(`${baseUrl}/lifestyle`), 
        lastModified: new Date(), 
        changeFrequency: 'daily',
        priority: 0.8 
      },
      { 
        url: escapeUrl(`${baseUrl}/news`), 
        lastModified: new Date(), 
        changeFrequency: 'daily',
        priority: 0.8 
      },
    ];

    // ========================
    // CATEGORY SUBCATEGORIES (LOWER PRIORITY)
    // ========================
    const subcategoryRoutes: MetadataRoute.Sitemap = [
      // Technology
      { url: escapeUrl(`${baseUrl}/technology/ai`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/technology/tech-news`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/technology/cybersecurity`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
      { url: escapeUrl(`${baseUrl}/technology/programming`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
      { url: escapeUrl(`${baseUrl}/technology/gadgets`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
      { url: escapeUrl(`${baseUrl}/technology/emerging-tech`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
      { url: escapeUrl(`${baseUrl}/technology/cloud-devops`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
      
      // Lifestyle subpages (now top‑level)
      { url: escapeUrl(`${baseUrl}/mentalhealth`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/wellness`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/weightloss`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
      
      // News
      { url: escapeUrl(`${baseUrl}/news/world`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
      { url: escapeUrl(`${baseUrl}/news/business`), lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    ];

    // ========================
    // POST URLS (ONLY CANONICAL - NO /blogs/ AT ALL)
    // ========================
    const postRoutes: MetadataRoute.Sitemap = [];

    for (const post of (posts || [])) {
      const canonicalPath = getCanonicalPath(post);
      const slugValue = getSlugString(post.slug);

      // filter out fallback /blogs entries (we don't want them in sitemap)
      if (canonicalPath.startsWith("/blogs/")) {
        console.log(`⚠️ Skipping post with uncategorised slug: ${slugValue}`);
        continue;
      }

      console.log(`🔗 Processing post with slug: ${slugValue} – canonical ${canonicalPath}`);

      const lastModified = new Date(post._updatedAt || post.publishedAt);
      const postAge = Date.now() - lastModified.getTime();
      const daysOld = postAge / (1000 * 60 * 60 * 24);

      let priority = 0.6;
      let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly';

      if (daysOld < 7) {
        priority = 0.8;
        changeFrequency = 'daily';
      } else if (daysOld < 30) {
        priority = 0.7;
        changeFrequency = 'weekly';
      } else {
        priority = 0.5;
        changeFrequency = 'monthly';
      }

      const postUrl = `${baseUrl}${canonicalPath}`;
      console.log(`   📝 Adding to sitemap: ${postUrl}`);

      postRoutes.push({
        url: escapeUrl(postUrl),
        lastModified,
        changeFrequency,
        priority,
      });
    }

    // ========================
    // COMBINE ALL URLS
    // ========================
    const allUrls = [
      ...staticRoutes,
      ...mainCategoryRoutes,
      ...subcategoryRoutes,
      ...postRoutes,
    ];

    console.log(`\n✅ Clean sitemap generated with ${allUrls.length} URLs`);
    console.log(`📊 Posts included: ${postRoutes.length}`);
    console.log(`🚫 Posts skipped: ${(posts?.length || 0) - postRoutes.length}`);

    // Log a few sample URLs to verify
    console.log('\n📝 Sample post URLs in sitemap:');
    postRoutes.slice(0, 5).forEach((route, i) => {
      console.log(`  ${i + 1}. ${route.url}`);
    });

    // Log a few skipped posts for debugging
    const skippedPosts = (posts || []).filter(post => {
      const slug = getSlugString(post.slug);
      return !postRoutes.find(route => route.url.includes(slug));
    }).slice(0, 3);
    
    if (skippedPosts.length > 0) {
      console.log('\n⚠️ Sample skipped posts:');
      skippedPosts.forEach((post, i) => {
        const slug = getSlugString(post.slug);
        console.log(`  ${i + 1}. ${slug} - Categories:`,
          post.categories?.map(c => getSlugString(c.slug)));
      });
    }

    return allUrls;

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    
    // Ultra simple fallback - NO /blogs/ URLs
    return [
      {
        url: escapeUrl(baseUrl),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: escapeUrl(`${baseUrl}/technology`),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: escapeUrl(`${baseUrl}/news`),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: escapeUrl(`${baseUrl}/lifestyle`),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];
  }
}