import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

// Cache for post existence checks (reduces Sanity API calls)
const postCache = new Map<string, boolean>()
const CACHE_DURATION = 3600000 // 1 hour

async function checkPostExists(slug: string): Promise<boolean> {
  // Check cache first
  const cached = postCache.get(slug)
  if (cached !== undefined) {
    return cached
  }

  try {
    const post = await client.fetch<{ _id: string }>(`
      *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        _id
      }
    `, { slug })

    const exists = !!post
    postCache.set(slug, exists)
    
    // Clear cache after duration
    setTimeout(() => postCache.delete(slug), CACHE_DURATION)
    
    return exists
  } catch (error) {
    console.error(`Error checking post ${slug}:`, error)
    return false
  }
}

async function getBestRedirect(slug: string): Promise<string> {
  try {
    // Try to find similar posts by keywords
    const keywords = slug.split('-').filter(word => word.length > 3)
    
    if (keywords.length > 0) {
      // Search for posts with similar keywords
      const similarPosts = await client.fetch<{ slug: string, title: string }[]>(`
        *[_type == "post" && !(_id in path("drafts.**")) && publishedAt <= now()] | order(publishedAt desc)[0...10] {
          "slug": slug.current,
          title
        }
      `)
      
      // Find best match
      for (const post of similarPosts) {
        const postKeywords = post.slug.split('-').filter(word => word.length > 3)
        const commonKeywords = keywords.filter(kw => 
          postKeywords.some(pk => pk.includes(kw) || kw.includes(pk))
        )
        
        if (commonKeywords.length > 0) {
          return `/blogs/${post.slug}`
        }
      }
      
      // Return most recent post as fallback
      if (similarPosts.length > 0) {
        return `/blogs/${similarPosts[0].slug}`
      }
    }
  } catch (error) {
    console.error('Error finding similar post:', error)
  }
  
  // Ultimate fallback
  return '/technology'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug.join('/')
  
  // Check if this post exists
  const postExists = await checkPostExists(slug)
  
  if (!postExists) {
    // Post doesn't exist - find best redirect
    const redirectUrl = await getBestRedirect(slug)
    
    // 301 Permanent Redirect (SEO-friendly)
    return NextResponse.redirect(new URL(redirectUrl, request.url), 301)
  }
  
  // Post exists - let Next.js handle the normal page
  // This will fall through to your normal blog page component
  return NextResponse.next()
}