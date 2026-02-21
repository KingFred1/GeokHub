// server component – no hooks needed

import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";
import { User, Clock } from "lucide-react";

import { formatTimeShort } from "@/lib/formatTime";

interface MasonryGridProps {
  posts: Post[];
}

function getSlugValue(post: Post): string | undefined {
  if (!post?.slug) return undefined;
  return typeof post.slug === "string" ? post.slug : post.slug.current;
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

    if (categoryTitle === "programming" || categorySlug === "programming") {
      return `/technology/programming/${slugValue}`;
    }

    if (categoryTitle === "cloud-devops" || categorySlug === "cloud-devops") {
      return `/technology/cloud-devops/${slugValue}`;
    }

    if (categoryTitle === "emerging-tech" || categorySlug === "emerging-tech") {
      return `/technology/emerging-tech/${slugValue}`;
    }

    if (categoryTitle === "gadgets" || categorySlug === "gadgets") {
      return `/technology/gadgets/${slugValue}`;
    }

    if (categoryTitle === "cybersecurity" || categorySlug === "cybersecurity") {
      return `/technology/cybersecurity/${slugValue}`;
    }

    if (categoryTitle === "tech-news" || categorySlug === "tech-news") {
      return `/technology/tech-news/${slugValue}`;
    }

     if (categoryTitle === "lifestyle" || categorySlug === "lifestyle") {
      return `/lifestyle/${slugValue}`;
    }


    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${slugValue}`;
    }
    
    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${slugValue}`;
    }

    if (categoryTitle === "business" || categorySlug === "business") {
      return `/news/business/${slugValue}`;
    }

    // Mental health categories may be stored as "mentalhealth", "mental-health", or "Mental Health"
    const isMentalHealthCategory = (categoryTitle && categoryTitle.includes("mental") && categoryTitle.includes("health")) || categoryTitle === "mentalhealth" || categoryTitle === "mentalhealth" || (categorySlug && (categorySlug.includes("mental") && categorySlug.includes("health"))) || categorySlug === "mentalhealth" || categorySlug === "mentalhealth";
    if (isMentalHealthCategory) {
      return `/mentalhealth/${slugValue}`;
    }

    if (categoryTitle === "wellness" || categorySlug === "wellness") {
      return `/wellness/${slugValue}`;
    }

    if (categoryTitle === "weightloss" || categorySlug === "weightloss") {
      return `/weightloss/${slugValue}`;
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

      if (parentTitle === "gadgets" || parentSlug === "gadgets") {
        return `/gadgets/${slugValue}`;
      }
    }
  }

  // Default to /blogs/ if no specific category matches
  return `/blogs/${slugValue}`;
}

export default function MasonryGrid({ posts }: MasonryGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-4">
          No tech news articles found
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Check back later for the latest technology updates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {posts.map((post, index) => {
        const {
          _id,
          title,
          slug,
          mainImage,
          excerpt,
          author,
          categories,
          publishedAt,
          _updatedAt,
        } = post;
        const slugValue = typeof slug === "string" ? slug : slug?.current;
        const postSlug = slugValue ? `/blogs/${slugValue}` : "#";
        const imageUrl = mainImage?.asset
          ? urlFor(mainImage)
              .width(1200)
              .height(800)
              .quality(80)
              .format("webp")
              .auto("format")
              .url()
          : "/fallback-image.jpg";

        // Get the correct detail page URL based on category
        const detailUrl = getPostDetailUrl(post);

        const formattedTime = formatTimeShort(post._updatedAt);

        return (
          <article
            key={_id}
            className="bg-card dark:bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700"
          >
            
            {/* Image */}
            <Link
              href={detailUrl}
              className="block relative overflow-hidden md:h-40 h-44 "
            >
              <img
                src={imageUrl}
                width={1200}
                height={800}
                alt={title || "Tech news article"}
                className="w-full object-cover h-full group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
              {/* Tech News Badge */}
              {/* <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  Tech
                </span>
              </div> */}
            </Link>

            {/* Content */}
            <div className="p-2">
              {/* Meta Info */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 md:mb-1 mb-2">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{author?.name || "Tech Editor"}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <time dateTime={publishedAt}>
                    {formattedTime}
                  </time>
                </div>
              </div>

              {/* Title */}
              <Link href={detailUrl}>
                <h3 className="md:text-lg text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-3 mb-3">
                  {title}
                </h3>
              </Link>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                  {excerpt}
                </p>
              )}

              {/* Engagement Stats */}
              {/* <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <LikeButton postId={_id} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Link href={`${postSlug}#comments`}>
                      <CommentCount postId={_id} />
                    </Link>
                  </div>
                </div>

                <Link
                  href={detailUrl}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Read more →
                </Link>
              </div> */}
            </div>
          </article>
        );
      })}
    </div>
  );
}
