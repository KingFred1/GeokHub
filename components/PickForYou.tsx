// server component – no hooks needed
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";
import { Clock } from "lucide-react";
// import { formatTimeShort } from "@/lib/formatTime";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}


type PickForYouProps = {
  post: Post;
};

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

    if (categoryTitle === "tech-news" || categorySlug === "tech-news") {
        return `/technology/tech-news/${post.slug?.current}`;
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

      if (parentTitle === "tech-news" || parentSlug === "tech-news") {
        return `/technology/tech-news/${post.slug?.current}`;
      }
    }
  }

  // Default to /blogs/ if no specific category matches
  return `/blogs/${post.slug?.current}`;
}

export default function PickForYou({ post }: PickForYouProps) {
  const { title, slug, author, mainImage, _id, publishedAt, _updatedAt } = post;

  const postSlug = slug?.current ? `/blogs/${slug.current}` : "#";

  const imageUrl = post.mainImage?.asset
  ? urlFor(post.mainImage)
      .width(1200)        
      .height(630)
      .quality(80)
      .format('webp')
      .auto('format')
      .url()
  : "/fallback-image.jpg";

  // Extract first paragraph from body
  let plainText = "";
  if (Array.isArray(post.body)) {
    const firstBlock = post.body.find(
      (block) => block._type === "block" && Array.isArray(block.children)
    );
    if (firstBlock) {
      plainText = firstBlock.children
        .map((child) => child.text)
        .join("")
        .substring(0, 120);
    }
  } else if (typeof post.body === "string") {
    plainText = post.body.substring(0, 120).replace(/[#*_`~>\[\]\(\)]/g, "");
  }

  if (plainText.length > 120) {
    plainText = plainText + "...";
  }

    // const formattedTime = formatTimeShort(publishedAt || "");


  // Get the correct detail page URL based on category
    const detailUrl = getPostDetailUrl(post);

  return (
    <article className="bg-card dark:bg-card border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden grid md:grid-cols-2 cursor-pointer">
      {/* Image Section */}
      <Link href={detailUrl} className="block relative overflow-hidden">
        <img
          src={imageUrl}
          width={1200}
          height={800}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          alt={title}
          loading="eager"
        />
        {/* Featured Badge */}
        {/* <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Featured
        </div> */}
      </Link>

      {/* Content Section */}
      <div className="p-4">

        {/* Title */}
        <Link href={detailUrl}>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white hover:underline lg:line-clamp-3 line-clamp-3 mb-2 transition-colors">
            {title}
          </h3>
        </Link>

                {/* Author and Date */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
          {/* {author?.image && (
            <img
              src={urlFor(author.image).format("webp").url()}
              alt={author?.name || "Author"}
              className="rounded-full h-6 w-6"
              loading="lazy"
            />
          )}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {author?.name}
          </span>
          <span className="mx-1">•</span> */}
          <Clock size={14} />
          <time dateTime={publishedAt} className="ml-1">
            {formatDate(publishedAt)}
          </time>
        </div>

        {/* Excerpt */}
        {/* <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
          {plainText}
        </p> */}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 bg-black dark:bg-white">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 ">
            {/* <div className="flex items-center gap-1">
              <LikeButton postId={_id} />
            </div>
            <div className="flex items-center gap-1">
              <Link
                href={`/blogs/${slug.current}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <CommentCount postId={_id} />
              </Link>
            </div> */}
          </div>

          {/* Read More */}
          {/* <Link
            href={detailUrl}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Read more →
          </Link> */}
        </div>
      </div>
    </article>
  );
}
