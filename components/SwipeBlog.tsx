"use client";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";
import SwipeBlogSkeleton from "./global/SwipeBlogSkeleton";
// import CardOptions from "./global/CardOptions";
import Image from "next/image";
import { Clock } from "lucide-react";
import { ImGoogle } from "react-icons/im";

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
      return `/lifestyle/post/${post.slug?.current}`;
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
  const isLoading = !posts || posts.length === 0;
  const [activeIndex, setActiveIndex] = useState(0);
  // Always call hooks in the same order — compute featured dateString safely
  const featuredDateString =
    (posts && posts.length > 0 && (posts[activeIndex]?._updatedAt || posts[0]?._updatedAt)) || "";
  const formattedTime = formatTimeShort(featuredDateString);
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };


  return (
    <div className="relative w-full my-4 md:my-6 md:mb-8">
      {isLoading ? (
        <SwipeBlogSkeleton />
      ) : (
        <div className="relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            loop={true}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
              // Mobile-friendly pagination positioning
              dynamicBullets: true,
              dynamicMainBullets: 3,
            }}
            onSlideChange={handleSlideChange}
            className="mySwiper relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg"
          >
            {posts.map((post) => (
              <SwiperSlide key={post._id} className="w-full relative">
                <article className="group w-full h-full relative">
                  <div className="relative w-full h-full">
                    {/* CardOptions button - Hidden on mobile, visible on hover */}
                    {/* <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"> 
                      <CardOptions post={post} />
                    </div> */}

                    {/* Gradient Overlay - Stronger on mobile for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

                    <Link
                      href={getPostDetailUrl(post)}
                      className="block h-full"
                    >
                      <img
                        src={
                          post.mainImage?.asset
                            ? urlFor(post.mainImage)
                                .width(1200)
                                .height(800)
                                .quality(80)
                                .format("webp")
                                .auto("format")
                                .url()
                            : "/fallback-image.jpg"
                        }
                        alt={post.title}
                        loading="eager"
                        width={1200}
                        height={630}
                        className="object-cover h-full w-full"
                      />
                    </Link>

                    {/* Category Badge */}
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

          {/* Custom CSS for pagination bullets */}
          <style jsx>{`
            .swiper-pagination-bullet {
              background-color: rgba(255, 255, 255, 0.6);
              opacity: 0.7;
              width: 8px;
              height: 8px;
              margin: 0 4px;
            }
            .swiper-pagination-bullet-active {
              background-color: rgb(255, 255, 255);
              opacity: 1;
              width: 10px;
              height: 10px;
            }

            /* Mobile-specific styles */
            @media (max-width: 768px) {
              .swiper-pagination-bullet {
                width: 6px;
                height: 6px;
                margin: 0 3px;
              }
              .swiper-pagination-bullet-active {
                width: 8px;
                height: 8px;
              }
            }
          `}</style>

          {/* Content Overlay - Responsive positioning */}
          {posts.length > 0 &&
            (() => {
              const featured = posts[activeIndex] || posts[0];

              // Extract plain text safely
              let plainText = "";
              if (Array.isArray(featured.body)) {
                const firstBlock = featured.body.find(
                  (block) =>
                    block._type === "block" && Array.isArray(block.children)
                );
                if (firstBlock) {
                  plainText = firstBlock.children
                    .map((child: any) => child.text) // only visible text
                    .join(" ")
                    .replace(/\s+/g, " ") // normalize spaces
                    .substring(0, 100);
                }
              } else if (typeof featured.body === "string") {
                plainText = featured.body
                  .replace(/https?:\/\/\S+/g, "") // strip links
                  .replace(/[#*_`~>\[\]\(\)]/g, "") // strip markdown
                  .substring(0, 100);
              }

              const authorImgUrl = featured.author?.image
                ? urlFor(featured.author.image).format("webp").url()
                : "/fallback-author.jpg";

                

              return (
                <div className="absolute z-30 bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-card dark:bg-card backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 max-w-2xl">
                  {/* Author and Date - Stack on mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={authorImgUrl}
                          alt={featured.author?.name || "Author"}
                          className="object-cover "
                          sizes="(max-width: 640px) 24px, 32px"
                          loading="eager"
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-xs md:text-sm">
                        {featured.author?.name}
                      </span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1 text-xs md:text-sm">
                      <Clock size={12} className="flex-shrink-0" />
                      <time dateTime={featured.publishedAt}>
                        {formattedTime}
                      </time>
                    </div>
                  </div>

                  {/* Title and Excerpt */}
                  <Link href={getPostDetailUrl(featured)}>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 mb-2 md:mb-3 leading-tight">
                      {featured.title}
                    </h2>
                    {plainText && (
                      <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm line-clamp-2 mb-3 md:mb-4 leading-relaxed">
                        {plainText}...
                      </p>
                    )}
                  </Link>

                  {/* Engagement Stats - Compact on mobile */}
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {/* <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      <LikeButton postId={featured._id} compact={true} />
                      <Link href={`/blogs/${featured.slug?.current}/#comments`}>
                        <CommentCount postId={featured._id} compact={true} />
                      </Link>
                    </div> */}

                    <Link
                      href={getPostDetailUrl(featured)}
                      className="ml-auto text-xs md:text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors whitespace-nowrap"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
};

export default SwipeBlog;
