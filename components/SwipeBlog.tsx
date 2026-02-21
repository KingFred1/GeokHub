"use client";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
import React, { useState, useEffect } from "react";
// Import Swiper and modules directly - no dynamic import needed
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SwipeBlogSkeleton from "./global/SwipeBlogSkeleton";
import { Clock } from "lucide-react";
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
    
    if (categoryTitle === "ai" || categorySlug === "ai") {
      return `/technology/ai/${post.slug?.current}`;
    }

    if (categoryTitle === "programming" || categorySlug === "programming") {
      return `/technology/programming/${post.slug?.current}`;
    }

    if (categoryTitle === "cloud-devops" || categorySlug === "cloud-devops") {
      return `/technology/cloud-devops/${post.slug?.current}`;
    }

    if (categoryTitle === "emerging-tech" || categorySlug === "emerging-tech") {
      return `/technology/emerging-tech/${post.slug?.current}`;
    }

    if (categoryTitle === "gadgets" || categorySlug === "gadgets") {
      return `/technology/gadgets/${post.slug?.current}`;
    }

    if (categoryTitle === "cybersecurity" || categorySlug === "cybersecurity") {
      return `/technology/cybersecurity/${post.slug?.current}`;
    }

    if (categoryTitle === "tech-news" || categorySlug === "tech-news") {
      return `/technology/tech-news/${post.slug?.current}`;
    }

    if (categoryTitle === "lifestyle" || categorySlug === "lifestyle") {
      return `/lifestyle/${post.slug?.current}`;
    }


    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${post.slug?.current}`;
    }
    
    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${post.slug?.current}`;
    }

    if (categoryTitle === "business" || categorySlug === "business") {
      return `/news/business/${post.slug?.current}`;
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

      if (parentTitle === "gadgets" || parentSlug === "gadgets") {
        return `/gadgets/${post.slug?.current}`;
      }
    }
  }

  // Default to /blogs/ if no specific category matches
  return `/blogs/${post.slug?.current}`;
}
const SwipeBlog = ({ posts }: { posts: Post[] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoading = !posts || posts.length === 0;
  
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };

  if (!isMounted || isLoading) {
    return <SwipeBlogSkeleton />;
  }

  const featuredDateString = posts[activeIndex]?._updatedAt || posts[0]?._updatedAt || "";
  const formattedTime = formatTimeShort(featuredDateString);

  return (
    <div className="relative w-full my-4 md:my-6 md:mb-8">
      <div className="relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          loop={true}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true, dynamicBullets: true }}
          onSlideChange={handleSlideChange}
          className="mySwiper relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg"
        >
          {posts.map((post) => (
            <SwiperSlide key={post._id}>
              <article className="group w-full h-full relative">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                  <Link href={getPostDetailUrl(post)} className="block h-full">
                    <img
                      src={post.mainImage?.asset
                        ? urlFor(post.mainImage).width(1200).height(800).quality(80).format("webp").url()
                        : "/fallback-image.jpg"}
                      alt={post.title}
                      className="object-cover h-full w-full"
                    />
                  </Link>
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded">
                      Featured
                    </span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Content Overlay */}
        {posts.length > 0 && (() => {
          const featured = posts[activeIndex] || posts[0];

          let plainText = "";
          if (Array.isArray(featured.body)) {
            const firstBlock = featured.body.find(
              (block) => block._type === "block" && Array.isArray(block.children)
            );
            if (firstBlock) {
              plainText = firstBlock.children
                .map((child: any) => child.text)
                .join(" ")
                .replace(/\s+/g, " ")
                .substring(0, 100);
            }
          }

          const authorImgUrl = featured.author?.image
            ? urlFor(featured.author.image).format("webp").url()
            : "/fallback-author.jpg";

          return (
            <div className="absolute z-30 bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-card dark:bg-card backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 max-w-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={authorImgUrl}
                    alt={featured.author?.name || "Author"}
                    className="rounded-full h-6 w-6 md:h-8 md:w-8"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {featured.author?.name}
                  </span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <time dateTime={featured.publishedAt}>{formattedTime}</time>
                </div>
              </div>

              <Link href={getPostDetailUrl(featured)}>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 line-clamp-2 mb-2">
                  {featured.title}
                </h2>
                {plainText && (
                  <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm line-clamp-2 mb-3">
                    {plainText}...
                  </p>
                )}
              </Link>

              <div className="flex items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={getPostDetailUrl(featured)}
                  className="ml-auto text-xs md:text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Read more →
                </Link>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default SwipeBlog;