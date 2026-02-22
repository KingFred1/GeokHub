// server component: interactivity moved to LifestyleClient
import ClientNewsSwiper from "@/components/ClientNewsSwiper";
import MasonryGrid from "@/components/World";
import SideBlog from "@/components/SideBlog";
import {
  Sparkles,
  Brain,
  Activity,
  Scale,
  TrendingUp,
  X,
} from "lucide-react";
import { Category, Post } from "@/type";
import Link from "next/link";
import LifestyleClient from "@/components/category/LifestyleClient";

interface LifestyleServerProps {
  categorySlug?: string;
  initialPosts: Post[];
  lifestyleCategories: Category[];
}

// Define category icons and colors
const categoryConfig = [
  {
    slug: "lifestyle",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    name: "All Lifestyle",
  },
  {
    slug: "mentalhealth",
    icon: Brain,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    name: "Mental Health",
  },
  {
    slug: "wellness",
    icon: Activity,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    name: "Wellness",
  },
  {
    slug: "weightloss",
    icon: Scale,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    name: "Weight Loss",
  },
];

export default function LifestyleServer({
  categorySlug = "lifestyle",
  initialPosts,
  lifestyleCategories,
}: LifestyleServerProps) {
  // compute filtered posts server-side
  const allPosts = initialPosts || [];
  const filteredPosts =
    categorySlug === "lifestyle"
      ? allPosts
      : allPosts.filter((post) =>
          post.categories?.some((cat) => {
            const catSlug =
              typeof cat.slug === "string" ? cat.slug : cat.slug?.current;
            return catSlug === categorySlug;
          })
        );

  const featuredPosts = filteredPosts.slice(0, 4);
  const sideBlogPost = filteredPosts.slice(4, 5);
  const initialDisplay = filteredPosts.slice(0, 17);
  const hasMore = initialDisplay.length < filteredPosts.length;
  const activeCategory = categorySlug;

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-8">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10% w-20 h-20 bg-pink-300 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-15% w-16 h-16 bg-orange-300 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-20% w-12 h-12 bg-yellow-300 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10% w-14 h-14 bg-rose-300 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Icon */}
          <div className="relative inline-block mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-2xl">
              <Sparkles className="h-10 w-10 text-pink-600 dark:text-pink-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative">
            Lifestyle & Wellness
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-pink-500 rounded-full"></span>
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto relative">
            Discover inspiration for living well - from mental health and
            wellness to weight loss, and personal growth
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>{filteredPosts.length} Articles</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span>{categoryConfig.length} Categories</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              <span>Daily Updates</span>
            </div>
            {initialDisplay.length > 0 && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                <span>Showing {initialDisplay.length} of {filteredPosts.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {categoryConfig.map((category) => {
            const IconComponent = category.icon;
            const categoryData = lifestyleCategories.find((c) => {
              const catSlug = typeof c.slug === 'string' ? c.slug : c.slug?.current;
              return catSlug === category.slug;
            });
            const displayName = categoryData?.title || category.name;

            return (
              <Link
                key={category.slug}
                href={`/lifestyles/${category.slug === "lifestyle" ? "" : category.slug}`}
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
        {activeCategory !== "lifestyle" && (
          <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 px-4 py-2 rounded-full">
            <span className="text-sm text-pink-700 dark:text-pink-300">
              Showing:{" "}
              {lifestyleCategories.find((c) => {
                const catSlug = typeof c.slug === 'string' ? c.slug : c.slug?.current;
                return catSlug === activeCategory;
              })?.title || activeCategory}
              {` (${filteredPosts.length} articles)`}
            </span>
            <Link
              href="/lifestyle"
              className="text-pink-500 hover:text-pink-700 dark:hover:text-pink-300"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 md:gap-6 mb-8 lg:mb-10">
        {/* NewsSwiper */}
        <div className="lg:col-span-8 md:col-span-12 col-span-12 order-1">
          <div className="md:bg-white md:dark:bg-gray-800 rounded-2xl md:p-4 shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-pink-600 dark:text-pink-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeCategory === "lifestyle"
                  ? "Trending in Lifestyle"
                  : `Trending in ${lifestyleCategories.find((c) => {
                      const catSlug = typeof c.slug === 'string' ? c.slug : c.slug?.current;
                      return catSlug === activeCategory;
                    })?.title || activeCategory}`}
              </h2>
            </div>
            {featuredPosts.length > 0 ? (
              <ClientNewsSwiper post={featuredPosts} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No trending articles available</p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Stories */}
        <div className="lg:col-span-4 md:col-span-12 col-span-12 order-2 hidden lg:block">
          <div className="md:bg-white md:dark:bg-gray-800 rounded-2xl md:p-4 shadow-sm">
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Featured Stories
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {sideBlogPost.length > 0 ? (
                sideBlogPost.map((post) => (
                  <div key={post._id}>
                    <SideBlog post={post} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No featured stories available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* More Stories with Load More */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-pink-600 dark:text-pink-400 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeCategory === "lifestyle"
                ? "More Lifestyle Stories"
                : `More ${lifestyleCategories.find((c) => {
                    const catSlug = typeof c.slug === 'string' ? c.slug : c.slug?.current;
                    return catSlug === activeCategory;
                  })?.title || activeCategory} Stories`}
            </h2>
            <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              Showing {initialDisplay.length} of {filteredPosts.length} articles
            </span>
          </div>
          
          {/* Load More Info */}
          {hasMore && (
            <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
              {filteredPosts.length - initialDisplay.length} more articles available
            </div>
          )}
        </div>
        
        {filteredPosts.length > 0 ? (
          <>
            {/* Show posts from position 5 onwards (after featured posts) */}
            <MasonryGrid posts={initialDisplay.slice(5)} />

            {/* interactive load‑more handled in client component */}
            <LifestyleClient
              initialPosts={initialDisplay}
              allPosts={filteredPosts}
              activeCategory={activeCategory}
              lifestyleCategories={lifestyleCategories}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {activeCategory === "lifestyle"
                ? "No articles available in Lifestyle yet."
                : `No articles available in ${lifestyleCategories.find((c) => {
                    const catSlug = typeof c.slug === 'string' ? c.slug : c.slug?.current;
                    return catSlug === activeCategory;
                  })?.title || activeCategory} yet.`}
            </p>
            <Link
              href="/lifestyle"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              View All Articles
            </Link>
          </div>
        )}
      </div>
    </>
  );
}