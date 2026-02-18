import NewsSwiper from "@/components/NewsSwiper";
import MasonryGrid from "@/components/World";
import SideBlog from "@/components/SideBlog";
import { client } from "@/sanity/lib/client";
import { BLOGS_BY_NEWS_SLUGS } from "@/sanity/lib/queries";
import {
  Globe,
  TrendingUp,
  Briefcase,
  Newspaper,
  X,
} from "lucide-react";
import { Category, Post } from "@/type";
import Link from "next/link";
import { Suspense } from "react";

interface NewsServerProps {
  categorySlug?: string;
  initialPosts: Post[];
  newsCategories: Category[];
}

// Define news category config
const categoryConfig = [
  {
    slug: "news",
    icon: Newspaper,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    name: "All News",
  },
  {
    slug: "world",
    icon: Globe,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    name: "World",
  },
  {
    slug: "business",
    icon: Briefcase,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    name: "Business",
  },
];

// Client component wrapper for NewsSwiper with error boundary
function NewsSwiperWrapper({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No featured posts available</p>
        </div>
      </div>
    );
  }

  return <NewsSwiper post={posts} />;
}

// Loading component for NewsSwiper
function NewsSwiperFallback() {
  return (
    <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse">
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading featured news...</p>
        </div>
      </div>
    </div>
  );
}

export default async function NewsServer({
  categorySlug = "news",
  initialPosts,
  newsCategories,
}: NewsServerProps) {
  // Filter posts based on category
  const filteredPosts = categorySlug === "news" 
    ? initialPosts 
    : initialPosts.filter((post) =>
        post.categories?.some((cat) => cat.slug === categorySlug)
      );

  const activeCategory = categorySlug;
  
  // Ensure we have posts for the swiper
  const swiperPosts = filteredPosts.slice(0, 2);
  const hasSwiperPosts = swiperPosts && swiperPosts.length > 0;

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-2xl p-6 mb-8">
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative">
            Latest News & Headlines
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto relative">
            Stay updated with breaking news, world events, and business reports
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {categoryConfig.map((category) => {
            const IconComponent = category.icon;
            const categoryData = newsCategories.find(
              (c) => c.slug === category.slug
            );
            const displayName = categoryData?.title || category.name;

            return (
              <Link
                key={category.slug}
                href={`/news/${category.slug === "news" ? "" : category.slug}`}
                className={`${category.color} px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all ${
                  activeCategory === category.slug
                    ? "ring-2 ring-offset-2 ring-current scale-105"
                    : "opacity-90 hover:opacity-100 hover:scale-105"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="ml-2">{displayName}</span>
              </Link>
            );
          })}
        </div>

        {/* Active Filter Indicator */}
        {activeCategory !== "news" && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Showing:{" "}
              {newsCategories.find((c) => c.slug === activeCategory)?.title ||
                activeCategory}{" "}
              ({filteredPosts.length} articles)
            </span>
            <Link
              href="/news"
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 md:gap-6 mb-8 lg:mb-10 gap-4">
        {/* Featured News Swiper */}
        <div className="lg:col-span-8 md:col-span-12 col-span-12 order-1 lg:pr-7">
          <div className="md:bg-white md:dark:bg-gray-800 rounded-2xl md:p-4 shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeCategory === "news"
                  ? "Top Headlines"
                  : `${
                      newsCategories.find((c) => c.slug === activeCategory)
                        ?.title || activeCategory
                    } News`}
              </h2>
            </div>
            
            {/* Wrap NewsSwiper in Suspense with error handling */}
            <Suspense fallback={<NewsSwiperFallback />}>
              {hasSwiperPosts ? (
                <NewsSwiperWrapper posts={swiperPosts} />
              ) : (
                <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No featured posts available</p>
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </div>

        {/* Sidebar Latest */}
        <div className="lg:col-span-4 md:col-span-12 col-span-12 order-2 hidden lg:block">
          <div className="md:bg-white md:dark:bg-gray-800 rounded-2xl md:p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Latest Updates
            </h2>
            <div className="flex flex-col gap-4">
              {filteredPosts.slice(2, 3).map((post) => (
                <div key={post._id}>
                  <SideBlog post={post} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* More News */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            More News
          </h2>
          <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
            {filteredPosts.length} articles
          </span>
        </div>
        {filteredPosts.length > 3 ? (
          <MasonryGrid posts={filteredPosts.slice(3)} />
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              No articles found
            </h3>
            <Link
              href="/news"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All News
            </Link>
          </div>
        )}
      </div>
    </>
  );
}