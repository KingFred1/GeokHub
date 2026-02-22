"use client";

import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
import { ArrowRight, Zap, ExternalLink } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface GadgetsSectionProps {
  post: Post[];
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

export default function GadgetsSection({ post }: GadgetsSectionProps) {
  if (!post || post.length === 0) return null;

  const gadgets = post.slice(0, 6);

  return (
    <section className="w-full py-4 border-y border-gray-100 dark:border-gray-800 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
              <Zap className="h-4 w-4" />
              <span>Expert Reviews</span>
            </div> */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Gadget Analysis
            </h2>
            {/* <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
              In-depth reviews and professional insights on the latest technology
            </p> */}
          </div>
          
          <Link
            href="/technology/gadgets"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors shrink-0"
          >
            View All Reviews
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-bullet',
            bulletActiveClass: 'swiper-bullet-active'
          }}
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          breakpoints={{
            320: { slidesPerView: 1.1 },
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
            1280: { slidesPerView: 3.5 },
          }}
          className="pb-12"
        >
          {gadgets.map((item) => {
            const imageUrl = item.mainImage?.asset
              ? urlFor(item.mainImage)
                  .width(500)
                  .height(350)
                  .quality(90)
                  .format("webp")
                  .auto("format")
                  .url()
              : "/fallback-gadget.jpg";

            const category = item.categories?.[0]?.title || "Electronics";

              // Get the correct detail page URL based on category
              const detailUrl = getPostDetailUrl(item);

            return (
              <SwiperSlide key={item._id}>
                <article className="group bg-card dark:bg-card rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md overflow-hidden h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative overflow-hidden flex-shrink-0">
                    <Link 
                      href={detailUrl}
                      className="block aspect-[4/3] bg-gray-100 dark:bg-gray-700 relative"
                    >
                      <img
                        src={imageUrl}
                        alt={item.title || "Tech gadget"}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-200/50 dark:border-gray-700/50">
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Title */}
                    <Link href={detailUrl} className="flex-1 mb-3">
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                        {item.title || "Gadget Review"}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    {item.excerpt && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {item.excerpt}
                      </p>
                    )}

                    {/* Professional CTAs */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/blogs/${item.slug?.current || "#"}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium rounded transition-colors text-sm"
                      >
                        Read Analysis
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                      
                      <Link
                        href={`/blogs/${item.slug?.current || "#"}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors text-sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Pagination Styles */}
        <style jsx>{`
          .swiper-bullet {
            width: 6px;
            height: 6px;
            background: rgba(156, 163, 175, 0.6);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0 3px;
          }
          .swiper-bullet-active {
            width: 20px;
            background: #374151;
            border-radius: 4px;
          }
          .dark .swiper-bullet {
            background: rgba(75, 85, 99, 0.6);
          }
          .dark .swiper-bullet-active {
            background: #d1d5db;
          }
        `}</style>

        {/* Professional Footer */}
        <div className="text-center mt-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Independent reviews with Amazon affiliate links
            </p>
            <Link
              href="/technology/gadgets"
              className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Explore All Gadget Reviews
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}