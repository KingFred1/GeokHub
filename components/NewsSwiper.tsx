"use client";

import React, { useState } from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";
import { Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { formatTimeShort } from "@/lib/formatTime";

function getSlugValue(post: Post): string | undefined {
  if (!post?.slug) return undefined;
  return typeof post.slug === "string" ? post.slug : post.slug.current;
}

// Helper function to determine the correct detail page URL
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
      return `/lifestyle/post/${slugValue}`;
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

const NewsSwiper = ({ post }: { post: Post[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);


  return (
    <div className="w-full relative group">
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: ".news-next-btn",
            prevEl: ".news-prev-btn",
          }}
          pagination={{
            clickable: true,
            el: ".news-pagination",
            bulletClass: "news-bullet",
            bulletActiveClass: "news-bullet-active",
            renderBullet: function (index, className) {
              return `<span class="${className}"></span>`;
            },
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={800}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="relative w-full h-72 xs:h-80 sm:h-84 md:h-96 lg:h-[350px] overflow-hidden"
        >
          {post.map((posts, index) => {
            const imageUrl = posts.mainImage?.asset
              ? urlFor(posts.mainImage)
                  .width(1200)
                  .height(800)
                  .quality(80)
                  .format("webp")
                  .auto("format")
                  .url()
              : "/fallback-image.jpg";

            // Get the correct detail page URL based on category
            const detailUrl = getPostDetailUrl(posts);

            const formattedTime = formatTimeShort(posts._updatedAt);

            return (
              <SwiperSlide key={posts._id} virtualIndex={index}>
                <article className="group flex flex-col items-start justify-end relative h-full w-full">
                  {/* Image with gradient overlay */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={imageUrl}
                      width={1200}
                      height={800}
                      alt={posts.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  </div>

                  {/* Card Options */}
                  {/* <div className="absolute top-3 right-3 z-20">
                    <CardOptions post={posts} />
                  </div> */}

                  {/* Content */}
                  <div className="relative z-10 w-full p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 mt-auto">
                    {/* Category and time */}
                    <div className="flex items-center gap-2 mb-3">
                      {posts.categories && posts.categories.length > 0 && (
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full whitespace-nowrap">
                          {posts.categories[0].title}
                        </span>
                      )}
                      <div className="flex items-center text-gray-300 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <time dateTime={posts.publishedAt}>
                          {formattedTime}
                        </time>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={detailUrl}>
                      <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight group-hover:underline transition-colors line-clamp-2">
                        {posts.title}
                      </h2>
                    </Link>

                    {/* Author and excerpt */}
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 xs:w-6 xs:h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {posts.author?.name?.charAt(0) || "A"}
                        </div>
                        <span className="text-gray-200 text-sm">
                          {posts.author?.name}
                        </span>
                      </div>

                      {posts.excerpt && (
                        <p className="text-gray-300 text-sm line-clamp-2 hidden xs:block flex-1 min-w-0 px-2">
                          {posts.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Mobile excerpt (shown below on small screens) */}
                    {posts.excerpt && (
                      <p className="text-gray-300 text-sm line-clamp-2 mb-4 xs:hidden">
                        {posts.excerpt}
                      </p>
                    )}

                    {/* Engagement buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/20">
                      {/* <div className="flex gap-3 xs:gap-4">
                        <LikeButton postId={posts._id} />
                        <Link
                          href={`${detailUrl}/#comments`}
                          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                        >
                          <CommentCount postId={posts._id} />
                        </Link>
                      </div> */}

                      <Link
                        href={detailUrl}
                        className="flex items-center gap-1 xs:gap-2 text-white hover:text-blue-300 transition-colors group/readmore"
                      >
                        <span className="text-xs xs:text-sm font-medium">Read more</span>
                        <ArrowRight className="h-3 w-3 xs:h-4 xs:w-4 group-hover/readmore:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Mobile-optimized navigation arrows */}
        <button className="news-prev-btn absolute top-1/2 left-2 xs:left-4 -translate-y-1/2 z-20 p-2 xs:p-3 bg-black/40 hover:bg-black/70 text-white rounded-full shadow-md transition-all">
          <ChevronLeft className="h-4 w-4 xs:h-6 xs:w-6" />
        </button>
        <button className="news-next-btn absolute top-1/2 right-2 xs:right-4 -translate-y-1/2 z-20 p-2 xs:p-3 bg-black/40 hover:bg-black/70 text-white rounded-full shadow-md transition-all">
          <ChevronRight className="h-4 w-4 xs:h-6 xs:w-6" />
        </button>

        {/* Custom pagination */}
        <div className="news-pagination absolute bottom-3 xs:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-1 xs:gap-2" />

        {/* Progress bar for autoplay */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 z-20">
          <div
            className="h-full bg-blue-600 transition-all duration-100"
            style={{
              width: `${((activeIndex + 1) / post.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .news-bullet {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .news-bullet-active {
          width: 16px;
          background: #fff;
          border-radius: 4px;
        }

        .news-pagination {
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 10px;
          backdrop-filter: blur(6px);
        }

        .swiper-pagination-bullet {
          opacity: 0.6;
        }

        .swiper-pagination-bullet-active {
          opacity: 1;
        }

        /* Mobile-specific optimizations */
        @media (max-width: 480px) {
          .news-pagination {
            padding: 3px 6px;
            border-radius: 8px;
          }
          
          .news-bullet {
            width: 5px;
            height: 5px;
          }
          
          .news-bullet-active {
            width: 14px;
          }
        }

        /* Extra small devices */
        @media (max-width: 360px) {
          .news-pagination {
            padding: 2px 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsSwiper;