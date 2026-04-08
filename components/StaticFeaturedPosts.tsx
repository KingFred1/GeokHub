// components/StaticFeaturedPosts.tsx
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getPostDetailUrl(post: Post): string {
  if (!post.categories?.length) return `/blogs/${post.slug?.current}`;
  
  for (const cat of post.categories) {
    const title = cat.title?.toLowerCase();
    if (title === "news") return `/news/${post.slug?.current}`;
    if (title === "tech-news") return `/technology/tech-news/${post.slug?.current}`;
    if (title === "gadgets") return `/technology/gadgets/${post.slug?.current}`;
    if (title === "lifestyle") return `/lifestyle/${post.slug?.current}`;
    if (title === "ai") return `/technology/ai/${post.slug?.current}`;
    if (title === "programming") return `/technology/programming/${post.slug?.current}`;
    if (title === "cybersecurity") return `/technology/cybersecurity/${post.slug?.current}`;
    if (title === "world") return `/news/world/${post.slug?.current}`;
    if (title === "business") return `/news/business/${post.slug?.current}`;
    if (title === "mentalhealth") return `/mentalhealth/${post.slug?.current}`;
    if (title === "wellness") return `/wellness/${post.slug?.current}`;
  }
  
  return `/blogs/${post.slug?.current}`;
}

interface Props {
  posts: Post[];
}

export default function StaticFeaturedPosts({ posts }: Props) {
  if (!posts?.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  
  const featuredPosts = posts.slice(0, 1);

  return (
    <div className="grid grid-cols-1 mt-5">
      {featuredPosts.map((post, index) => (
        <Link 
          key={post._id} 
          href={getPostDetailUrl(post)}
          className="group block"
        >
          <article className="bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 h-full flex flex-col">


           {/* Image */}
            <div className="overflow-hidden">
              <img
                src={post.mainImage?.asset
                  ? urlFor(post.mainImage)
                      .width(600)
                      .height(340)
                      .quality(80)
                      .format('webp')
                      .url()
                  : "/fallback-image.jpg"}
                alt={post.title}
                className="w-full h-full md:aspect-[18/9] object-cover group-hover:scale-105 transition-transform duration-300"
                loading={index < 2 ? "eager" : "lazy"}
              />
            </div>

          {/* Content */}
            <div className="p-4 flex-1">
              
              {/* Title */}
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:underline transition-colors md:line-clamp-2 line-clamp-3">
                {post.title}
              </h2>
              
              {/* Excerpt */}
              {(post.excerpt || post.body) && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1 line-clamp-2">
                  {post.metaDescription || (typeof post.body === 'string' 
                    ? post.body.substring(0, 120) + '...' 
                    : 'Read more...')}
                </p>
              )}
              
              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {/* <span>•</span>
                <span>{post.author?.name || "GeokHub"}</span> */}
              </div>
            </div>
                        
           
          </article>
        </Link>
      ))}
    </div>
  );
}