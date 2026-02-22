// components/StaticGadgetsGrid.tsx
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function getPostDetailUrl(post: Post): string {
  // Check if post has categories
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${post.slug?.current}`;
  }

  // Check each category
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();
    
    if (categoryTitle === "gadgets" || categorySlug === "gadgets") {
      return `/technology/gadgets/${post.slug?.current}`;
    }

    if (categoryTitle === "tech-news" || categorySlug === "tech-news") {
      return `/technology/tech-news/${post.slug?.current}`;
    }

    if (categoryTitle === "ai" || categorySlug === "ai") {
      return `/technology/ai/${post.slug?.current}`;
    }

    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${post.slug?.current}`;
    }
    
    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${post.slug?.current}`;
    }
    
    // Also check parent category if exists
    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();
      
      if (parentTitle === "news" || parentSlug === "news") {
        return `/news/${post.slug?.current}`;
      }
      
      if (parentTitle === "world" || parentSlug === "world") {
        return `/news/world/${post.slug?.current}`;
      }
    }
  }

  // Default to /blogs/ if no specific category matches
  return `/blogs/${post.slug?.current}`;
}

interface Props {
  post: Post[];
}

export default function StaticGadgetsGrid({ post }: Props) {
  if (!post || post.length === 0) return null;

  const gadgets = post.slice(0, 4); // Show first 4 items

  return (
    <section className="w-full py-8 border-y border-gray-200 dark:border-gray-700">
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Gadget Reviews
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              In-depth analysis of the latest technology
            </p>
          </div>
          
          <Link
            href="/technology/gadgets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium rounded-lg transition-colors shrink-0"
          >
            View All Reviews
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Static Grid - NO SWIPER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gadgets.map((item) => {
            const imageUrl = item.mainImage?.asset
              ? urlFor(item.mainImage)
                  .width(500)
                  .height(350)
                  .quality(90)
                  .format("webp")
                  .url()
              : "/fallback-gadget.jpg";

            const category = item.categories?.[0]?.title || "Electronics";
            const detailUrl = getPostDetailUrl(item);

            return (
              <article 
                key={item._id}
                className="group bg-card dark:bg-card rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md overflow-hidden h-full flex flex-col"
              >
                {/* Image */}
                <Link href={detailUrl} className="block overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={imageUrl}
                    alt={item.title || "Gadget review"}
                    loading="lazy"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {/* Content */}
                <div className="p-3 flex-1 flex flex-col">
                  {/* Category Badge */}
                  {/* <span className="inline-block px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full mb-3 w-fit">
                    {category}
                  </span> */}
                  
                  {/* Title */}
                  <Link href={detailUrl} className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-3">
                      {item.title || "Gadget Review"}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  {item.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}

                  {/* Read More Link */}
                  <Link
                    href={detailUrl}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium rounded transition-colors text-sm"
                  >
                    Read Analysis
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Independent reviews • Expert analysis • Latest gadgets
          </p>
        </div>
      </div>
    </section>
  );
}