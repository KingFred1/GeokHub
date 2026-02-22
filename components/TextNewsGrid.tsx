// server component – no need for client bundle

import Link from "next/link";
import { Post } from "@/types";
import { Calendar } from "lucide-react";

interface TextNewsGridProps {
  posts: Post[];
  title?: string;
}

function getPostDetailUrl(post: Post): string {
  // Check if post has categories
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${post.slug?.current}`;
  }

  // Check each category for "news" or "world"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();
    
    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${post.slug?.current}`;
    }
    
    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${post.slug?.current}`;
    }

    if (categoryTitle === "business" || categorySlug === "business") {
      return `/news/business/${post.slug?.current}`;
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


function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function TextNewsGrid({ posts, title }: TextNewsGridProps) {



  return (
    <section className="my-8 mt-2">
      {title && (
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts?.map((post) => {
          const slug = post?.slug?.current;
          if (!slug) return null;

          const postSlug = `/blogs/${slug}`;

          // ---------- EXCERPT HANDLING ----------
          let plainText = "";

          if (Array.isArray(post.body)) {
            const firstBlock = post.body.find(
              (block) =>
                block._type === "block" && Array.isArray(block.children)
            );

            if (firstBlock) {
              plainText = firstBlock.children
                .map((child: any) => child.text)
                .join(" ")
                .replace(/\s+/g, " ")
                .substring(0, 250);
            }
          } else if (typeof post.body === "string") {
            plainText = post.body
              .replace(/https?:\/\/\S+/g, "")
              .replace(/[#*_`~>\[\]\(\)]/g, "")
              .substring(0, 250);
          }
          // ---------------------------------------

          // Get the correct detail page URL based on category
          const detailUrl = getPostDetailUrl(post);

          return (
            <Link
              href={detailUrl}
              key={post._id}
              className="group border-b border-gray-300 dark:border-gray-700 pb-5"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 hover:underline">
                {post.title}
              </h3>

              {plainText && (
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 ">
                  {plainText}...
                </p>
              )}

             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <span>•</span>
                <span>{post.author?.name || "GeokHub"}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
