"use client";

import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";
// import CardOptions from "./global/CardOptions";

import { useFormattedTimeShort } from "@/hooks/useClientTime";

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

    if (categoryTitle === "mentalhealth" || categorySlug === "mentalhealth") {
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

const SideBlogCard = ({ post }: { post: Post }) => {
  const { title, author, mainImage, slug, publishedAt, _updatedAt, _id } = post;
  const slugValue = typeof slug === "string" ? slug : slug?.current;
  const postSlug = slugValue ? `/blogs/${slugValue}` : "#";
  const imageUrl = mainImage?.asset
    ? urlFor(mainImage).width(1200).height(800).quality(80).format("jpg").url()
    : "/fallback.jpg";

      const detailUrl = getPostDetailUrl(post);

          const formattedTime = useFormattedTimeShort(_updatedAt);


  return (
    <div className="relative group ">
      <article className="w-full border dark:border-card rounded-lg bg-card shadow lg:h-full md:h-[54vh] overflow-hidden">
        <div className="relative w-full md:h-[30vh]">
          <Link href={detailUrl} className="block w-full h-full">
            <img
              src={imageUrl}
              width={1200}
              height={800}
              alt={title}
              className="w-full h-full object-cover rounded-t-md "
              loading="eager"
            />

            {/* Black overlay on hover */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-md md:rounded-md" />
          </Link>

          {/* <CardOptions post={post} /> */}
        </div>

        <div className="dark:text-white relative p-2">
          <div className="text-xs font-semibold py-1 text-gray-600 dark:text-gray-300">
            {author?.name && (
              <span>
                {author.name} <b>.</b>
              </span>
            )}{" "}
            <time dateTime={publishedAt}>{formattedTime}</time>
          </div>

          <Link
            href={detailUrl}
            className="hover:underline hover:text-primary transition-colors"
          >
            <h1 className="capitalize text-md font-semibold line-clamp-2 mt-1 mb-7">
              {title}
            </h1>
          </Link>

          {/* <div className="flex gap-2 absolute bottom-0">
            <LikeButton postId={_id} />
            <Link href={`${postSlug}#comments`}>
              <CommentCount postId={_id} />
            </Link>
          </div> */}
        </div>
      </article>
    </div>
  );
};

export default SideBlogCard;
