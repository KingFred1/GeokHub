// server component: no "use client" directive

import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";
// import CardOptions from "./global/CardOptions";
// import Image from "next/image";
import {
  Eye,
  ArrowRight,
  Share2,
  Bookmark,
  Clock,
  Calendar,
} from "lucide-react";

import { formatTimeShort } from "@/lib/formatTime";

function getPostDetailUrl(post: Post): string {
  // Check if post has categories
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${post.slug?.current}`;
  }

  // Check each category for "news" or "world"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();

    if (categoryTitle === "lifestyle" || categorySlug === "lifestyle") {
      return `/lifestyle/${post.slug?.current}`;
    }

    if (categoryTitle === "mentalhealth" || categorySlug === "mentalhealth") {
      return `/mentalhealth/${post.slug?.current}`;
    }

    if (categoryTitle === "wellness" || categorySlug === "wellness") {
      return `/wellness/${post.slug?.current}`;
    }

    if (categoryTitle === "weightloss" || categorySlug === "weightloss") {
      return `/weightloss/${post.slug?.current}`;
    }

    if (categoryTitle === "tech-news" || categorySlug === "tech-news") {
      return `/technology/tech-news/${post.slug?.current}`;
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

const HomeBlog = ({ post }: { post: Post }) => {
  const {
    title,
    slug,
    author,
    mainImage,
    publishedAt,
    _updatedAt,
    categories,
  } = post;
  const postSlug = slug?.current ? `/blogs/${slug.current}` : "#";
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage)
        .width(1200) 
        .height(800)
        .quality(80)
        .format("webp")
        .auto("format")
        .url()
    : "/fallback-image.jpg";
  const authorImgUrl = author?.image
    ? urlFor(author.image).format("webp").url()
    : "/fallback-author.jpg";

  // Extract first paragraph for excerpt
  let excerpt = "";
  if (Array.isArray(post.body)) {
    const firstBlock = post.body.find(
      (block) => block._type === "block" && Array.isArray(block.children)
    );
    if (firstBlock) {
      excerpt = firstBlock.children
        .map((child) => child.text)
        .join("")
        .substring(0, 120);
    }
  }

  if (excerpt.length > 120) {
    excerpt = excerpt + "...";
  }

  // Get the correct detail page URL based on category
  const detailUrl = getPostDetailUrl(post);

  // relative time computed at render (server) to avoid client hook
  const formattedTime = formatTimeShort(publishedAt || "");

  return (
    <article className="group relative bg-white dark:bg-card overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:from-blue-900/5 dark:to-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

      {/* Category badge */}
      {categories && categories.length > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-600 text-white shadow-md">
            {categories[0]?.title || "Uncategorized"}
          </span>
        </div>
      )}

      {/* Card options (top right) */}
      {/* <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <CardOptions post={post} />
      </div> */}

      {/* Image section with overlay effect */}
      <div className="relative overflow-hidden md:h-50 h-56">
        <Link href={detailUrl} className="block h-full">
          <div className="relative h-full">
            <img
              src={imageUrl}
              loading="eager" 
              className={"object-cover transition-all duration-700 opacity-100 scale-100"}
              alt={title}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Shine effect on hover */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-white/20 group-hover:animate-shine transition-all duration-1000" />
            </div>
          </div>
        </Link>
      </div>

      {/* Content section */}
      <div className="relative p-3 z-10">
        {/* Author and date */}
        {/* <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="relative  h-6 w-6 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
              <img
                src={authorImgUrl}
                className="object-cover"
                alt={author?.name || "Author"}
                loading="lazy"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {author?.name}
            </span>
          </div>
          <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          
        </div> */}

        {/* Title */}
        <Link href={detailUrl}>
          <h2 className=" text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:underline transition-colors duration-300 line-clamp-3 leading-tight">
            {title}
          </h2>
        </Link>

        <div className="flex items-center my-2 gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <time dateTime={publishedAt}>
              {formatTimeShort(_updatedAt)}
            </time>
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 text-sm leading-relaxed">
            {excerpt}
          </p>
        )}

        {/* Engagement stats and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 bg-black dark:bg-white mb-2">
          {/* <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <LikeButton postId={post._id} />
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <Link href={`/blogs/${post.slug?.current}/#comments`}>
                <CommentCount postId={post._id} />
              </Link>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Eye size={14} />
              <span>1.2k</span>
            </div>
          </div> */}

          {/* Read more button */}
          {/* <Link
            href={detailUrl}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group/readmore transition-colors"
          >
            Read more
            <ArrowRight
              size={14}
              className="group-hover/readmore:translate-x-1 transition-transform"
            />
          </Link> */}
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-all duration-500 pointer-events-none" />
    </article>
  );
};

export default HomeBlog;
