"use client";

import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";

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

export default function GadgetsSection({ post }: GadgetsSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!post || post.length === 0) return null;
  
  // Show loading placeholder until mounted
  if (!isMounted) {
    return (
      <section className="w-full py-4 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const gadgets = post.slice(0, 6);

  return (
    <section className="w-full py-4 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Gadget Analysis
          </h2>
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
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1.1 },
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
          }}
          className="pb-12"
        >
          {gadgets.map((item) => {
            const imageUrl = item.mainImage?.asset
              ? urlFor(item.mainImage).width(500).height(350).quality(90).format("webp").url()
              : "/fallback-gadget.jpg";

            const detailUrl = getPostDetailUrl(item);

            return (
              <SwiperSlide key={item._id}>
                <article className="group bg-card dark:bg-card rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md overflow-hidden h-full flex flex-col">
                  <div className="relative overflow-hidden flex-shrink-0">
                    <Link href={detailUrl} className="block aspect-[4/3] bg-gray-100 dark:bg-gray-700">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <Link href={detailUrl} className="flex-1 mb-3">
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white hover:text-blue-600 line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={detailUrl}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium rounded transition-colors text-sm"
                      >
                        Read Analysis
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}