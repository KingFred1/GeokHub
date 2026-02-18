import { client } from '@/sanity/lib/client';
import { BLOG_QUERY } from '@/sanity/lib/queries';

interface RSSAuthor {
  name?: string;
}

interface RSSCategory {
  title: string;
}

interface RSSPost {
  title: string;
  excerpt?: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  author?: RSSAuthor;
  categories?: RSSCategory[];
}

function isValidPost(post: unknown): post is RSSPost {
  return (
    typeof post === 'object' &&
    post !== null &&
    'title' in post &&
    'slug' in post &&
    typeof (post as RSSPost).slug === 'object' &&
    'current' in (post as RSSPost).slug &&
    'publishedAt' in post
  );
}

export async function GET() {
  try {
    // Fetch your latest posts from Sanity with proper typing
    const posts = await client.fetch<RSSPost[]>(BLOG_QUERY);
    
    // Validate posts and filter out invalid ones
    const validPosts = posts.filter(isValidPost);
    
    if (validPosts.length === 0) {
      return new Response('No posts available', { status: 404 });
    }

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Geokhub - Latest News &amp; Updates</title>
    <description>Your go-to source for the latest news, technology, health, and sports updates.</description>
    <link>https://www.geokhub.com</link>
    <language>en-us</language>
    <atom:link href="https://www.geokhub.com/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <generator>Geokhub CMS</generator>
    
    ${validPosts.map((post: RSSPost) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || 'Read the full article on Geokhub'}]]></description>
      <link>https://www.geokhub.com/blogs/${post.slug.current}</link>
      <guid isPermaLink="true">https://www.geokhub.com/blogs/${post.slug.current}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author><![CDATA[${post.author?.name || 'Geokhub Team'}]]></author>
      ${post.categories?.map((cat: RSSCategory) => `<category><![CDATA[${cat.title}]]></category>`).join('') || ''}
    </item>
    `).join('')}
  </channel>
</rss>`;

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}