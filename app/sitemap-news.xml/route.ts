import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 1800 // 30 minutes

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  _updatedAt?: string;
  excerpt?: string;
  categories?: Array<{ title: string; slug?: { current: string } }>;
  author?: { name: string };
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function mapToNewsKeywords(categories?: Array<{ title: string; slug?: { current: string } }>): string {
  if (!categories || categories.length === 0) return 'Technology, News';
  
  const keywords = categories.map(cat => {
    const categoryMap: { [key: string]: string } = {
      'news': 'Breaking News, Current Events, Headlines',
      'world': 'World News, International, Global Affairs',
      'business': 'Business, Finance, Economy, Markets',
      'ai': 'Artificial Intelligence, AI, Machine Learning',
      'cybersecurity': 'Cybersecurity, Security, Hacking',
      'programming': 'Programming, Coding, Software Development',
      'gadgets': 'Gadgets, Tech, Electronics',
      'tech-news': 'Technology, Tech News, Innovation',
      'emerging-tech': 'Emerging Technology, Innovation, Future Tech',
      'mentalhealth': 'Mental Health, Wellness, Psychology',
      'wellness': 'Wellness, Health, Self-Care',
      'weightloss': 'Weight Loss, Fitness, Health',
    };
    
    const categorySlug = cat.slug?.current || cat.title.toLowerCase();
    return categoryMap[categorySlug] || cat.title;
  });
  
  const keywordString = keywords.join(', ');
  return keywordString.length > 0 ? keywordString.slice(0, 250) : 'News, Current Events';
}

async function fetchRecentNewsPosts(): Promise<SanityPost[]> {
  noStore();
  try {
    // Increased from 3 to 5 days to capture more news content
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    
    const posts = await client.fetch<SanityPost[]>(`
      *[_type == "post" && 
        defined(publishedAt) && 
        publishedAt <= now() && 
        publishedAt >= $fiveDaysAgo && 
        count((categories[]->slug.current)[@ in ["news", "world", "business", "tech-news"]]) > 0] 
      | order(publishedAt desc) [0...1000] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        _updatedAt,
        excerpt,
        categories[]->{
          title,
          "slug": slug.current
        },
        author->{
          name
        }
      }
    `, { fiveDaysAgo });

    return posts || [];
  } catch (error) {
    console.error('Error fetching recent news posts:', error);
    return [];
  }
}

export async function GET() {
  noStore(); // Critical: Prevent caching
  
  const baseUrl = 'https://www.geokhub.com';

  try {
    const posts = await fetchRecentNewsPosts();

    console.log(`📰 News sitemap: ${posts.length} recent news posts (last 5 days)`);

    // Google News requires at least one article
    if (posts.length === 0) {
      // If no recent news, try to get the single most recent news post
      const fallbackPost = await client.fetch<SanityPost[]>(`
        *[_type == "post" && 
          defined(publishedAt) && 
          publishedAt <= now() && 
          count((categories[]->slug.current)[@ in ["news", "world", "business", "tech-news"]]) > 0] 
        | order(publishedAt desc) [0] {
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          _updatedAt,
          excerpt,
          categories[]->{
            title,
            "slug": slug.current
          },
          author->{
            name
          }
        }
      `);

      if (fallbackPost.length > 0) {
        posts.push(fallbackPost[0]);
        console.log(`📰 Using fallback: Most recent news post from ${new Date(fallbackPost[0].publishedAt).toLocaleDateString()}`);
      }
    }

    // helper to compute canonical path for news entries
    function getPostPathForNews(post: SanityPost): string {
      const slug = post.slug || '';
      const cats = post.categories || [];

      for (const cat of cats) {
        const cslug = (cat.slug || cat.title || '').toLowerCase();
        if (cslug === 'world') return `/news/world/${slug}`;
        if (cslug === 'business') return `/news/business/${slug}`;
        if (cslug === 'news') return `/news/${slug}`;
        if (['ai','tech-news','emerging-tech','cybersecurity','programming','gadgets'].includes(cslug)) {
          return `/technology/${cslug}/${slug}`;
        }
      }

      return `/blogs/${slug}`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${posts.map(post => {
    const postUrl = `${baseUrl}${getPostPathForNews(post)}`;
    const pubDate = new Date(post.publishedAt).toISOString();
    const newsKeywords = mapToNewsKeywords(post.categories);
    
    return `
  <url>
    <loc>${escapeXml(postUrl)}</loc>
    <news:news>
      <news:publication>
        <news:name>GeoKHub</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(post.title || 'Untitled')}</news:title>
      <news:keywords>${escapeXml(newsKeywords)}</news:keywords>
    </news:news>
    <lastmod>${new Date(post._updatedAt || post.publishedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join('')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
      },
    });

  } catch (error) {
    console.error('❌ Error generating news sitemap:', error);
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>GeoKHub</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString()}</news:publication_date>
      <news:title>GeoKHub - Latest News & Technology Updates</news:title>
      <news:keywords>Technology, News, Updates, Innovation</news:keywords>
    </news:news>
  </url>
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
      },
    });
  }
}