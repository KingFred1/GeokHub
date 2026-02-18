import { client } from '@/sanity/lib/client'

export async function GET() {
  try {
    const articles = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        _createdAt
      }[0...20]
    `)
    
    return new Response(JSON.stringify({
      totalArticles: articles?.length || 0,
      articles: articles?.map(a => ({
        title: a.title,
        slug: a.slug?.current,
        publishedAt: a.publishedAt,
        isRecent: new Date(a.publishedAt) > new Date(Date.now() - 48 * 60 * 60 * 1000)
      })) || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}