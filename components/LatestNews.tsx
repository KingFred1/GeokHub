"use client"

import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import { Calendar, ArrowRight} from "lucide-react";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";

import { useFormattedTimeShort } from "@/hooks/useClientTime";

function getSlugValue(post: Post): string | undefined {
  if (!post) return undefined;
  if (typeof (post as any).slug === "string") return (post as any).slug;
  return (post as any).slug?.current;
}

function getPostDetailUrl(post: Post): string {
  const slugValue = getSlugValue(post) ?? "";

  // Check if post has categories
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${slugValue}`;
  }

  // Check each category for "news" or "world"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();

    if (categoryTitle === "ai" || categorySlug === "ai") {
      return `/technology/ai/${slugValue}`;
    }

    if (categoryTitle === "tech-news" || categorySlug === "tech-news") {
      return `/technology/tech-news/${slugValue}`;
    }
    
    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${slugValue}`;
    }
    
    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${slugValue}`;
    }
    
    // Also check parent category if exists
    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();
      
      if (parentTitle === "news" || parentSlug === "news") {
        return `/news/${slugValue}`;
      }
      
      if (parentTitle === "world" || parentSlug === "world") {
        return `/news/world/${slugValue}`;
      }
    }
  }

  // Default to /blogs/ if no specific category matches
  return `/blogs/${slugValue}`;
}

type LatestNewsProps = {
  posts: Post[];
};

export default function LatestNews({ posts }: LatestNewsProps) {
  const getPlainText = (post: Post) => {
    if (!post.body) return post.excerpt || "Read more about this story...";

    try {
      if (Array.isArray(post.body)) {
        const firstBlock = post.body.find(
          (block) => block._type === "block" && Array.isArray(block.children)
        );
        if (firstBlock) {
          return (
            firstBlock.children
              .map((child: any) => child.text || "")
              .join("")
              .substring(0, 100) + "..."
          );
        }
      } else if (typeof post.body === "string") {
        return (
          post.body.substring(0, 100).replace(/[#*_`~>\[\]\(\)]/g, "") + "..."
        );
      }
    } catch {
      // Fallback if parsing fails
    }

    return post.excerpt || "Read more about this story...";
  };



  // Safe posts handling
  const displayPosts = posts?.slice(0, 6) || [];


  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            Latest Tech News
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayPosts.map((post) => {
            const imageUrl = post.mainImage?.asset
              ? urlFor(post.mainImage)
                  .width(400)
                  .height(300)
                  .quality(80)
                  .format("webp")
                  .auto("format")
                  .url()
              : null;

            const authorImageUrl = post.author?.image
              ? urlFor(post.author.image)
                  .width(48)
                  .height(48)
                  .quality(80)
                  .format("webp")
                  .url()
              : null;

                // Get the correct detail page URL based on category
    const detailUrl = getPostDetailUrl(post);

        const formattedTime = useFormattedTimeShort(post.publishedAt);


            return (
              <article
                key={post._id}
                className="bg-card dark:bg-card rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
              >
                {/* Image */}
                <a
                  href={detailUrl}
                  className="block flex-shrink-0"
                >
                  <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-card dark:bg-card flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                    {post.categories && post.categories.length > 0 && (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {post.categories[0]?.title || "News"}
                        </span>
                      </div>
                    )}
                  </div>
                </a>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                    <div className="flex items-center gap-1">
                      {authorImageUrl && (
                        <img
                          src={authorImageUrl}
                          alt={post.author?.name || "Author"}
                          className="rounded-full h-5 w-5 sm:h-6 sm:w-6"
                          loading="lazy"
                        />
                      )}
                      <span className="font-medium text-xs sm:text-sm">
                        {post.author?.name || "Staff Writer"}
                      </span>
                    </div>
                    <span className="mx-1 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="sm:hidden" />
                      <Calendar size={14} className="hidden sm:block" />
                      <span className="text-xs sm:text-sm">
                        {formattedTime}
                      </span>
                    </div>
                  </div>

                  <a href={detailUrl}>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                  </a>

                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-1">
                    {getPlainText(post)}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    {/* <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <LikeButton postId={post._id} />
                        <Link href={`/blogs/${post.slug?.current}/#comments`}>
                          <CommentCount postId={post._id} />
                        </Link>
                      </div>
                    </div> */}

                    <a
                      href={detailUrl}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center"
                    >
                      Read more
                      <ArrowRight size={12} className="ml-1 sm:ml-1" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <a
            href="/technology/tech-news"
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium text-sm sm:text-base"
          >
            View All News
            <ArrowRight size={14} className="ml-2 sm:ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
