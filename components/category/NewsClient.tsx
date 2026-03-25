"use client";

import { useState, useEffect } from "react";
import NewsSkeleton from "@/components/global/skeleton/NewsSkeleton";
import NewsSwiper from "@/components/NewsSwiper";
import MasonryGrid from "@/components/World";
import SideBlog from "@/components/SideBlog";
import { client } from "@/sanity/lib/client";
import { BLOGS_BY_NEWS_SLUGS } from "@/sanity/lib/queries";
import {
  Globe,
  TrendingUp,
  Briefcase,
  RefreshCw,
  X,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Category, Post } from "@/type";

interface NewsClientProps {
  initialPosts: Post[];
  newsCategories: Category[];
}

export default function NewsClient({
  initialPosts,
  newsCategories,
}: NewsClientProps) {
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const [activeCategory, setActiveCategory] = useState("news");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12); // Number of posts per page
  const [loadingMore, setLoadingMore] = useState(false);

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

  // Calculate paginated posts
  const getPaginatedPosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Get current page posts
  const currentPosts = getPaginatedPosts();

  // Filter posts when category changes
  useEffect(() => {
    if (activeCategory === "news") {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter((post) => {
        // Check if post has categories
        if (!post.categories || !Array.isArray(post.categories)) {
          return false;
        }
        
        // Check for category slug match
        return post.categories.some((cat) => {
          // Handle both string slugs and object slugs
          const catSlug = typeof cat.slug === 'string' ? cat.slug : cat.slug?.current;
          return catSlug === activeCategory;
        });
      });
      setFilteredPosts(filtered);
    }
    // Reset to page 1 when category changes
    setCurrentPage(1);
  }, [activeCategory, allPosts]);

  // Load all news posts (for all categories)
  const loadAllNewsPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newsSlugs = ["news", "world", "business"];
      const posts = await client.fetch(BLOGS_BY_NEWS_SLUGS, {
        slugs: newsSlugs,
      });
      
      if (!posts || !Array.isArray(posts)) {
        throw new Error("No posts returned from Sanity");
      }
      
      setAllPosts(posts);
      setFilteredPosts(posts);
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error("Error loading news posts:", error);
      setError(error instanceof Error ? error.message : "Failed to load news");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with initialPosts and load fresh data
  useEffect(() => {
    // Set initial posts
    setAllPosts(initialPosts);
    setFilteredPosts(initialPosts);
    setCurrentPage(1);
  }, [initialPosts]);

  // Refresh all data
  const refreshAllData = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await loadAllNewsPosts();
    } catch (error) {
      console.error("Error refreshing news data:", error);
      setError(error instanceof Error ? error.message : "Failed to refresh news");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setActiveCategory(categorySlug);
  };

  // Get display name for category
  const getCategoryDisplayName = (slug: string) => {
    const category = newsCategories.find((c) => {
      const catSlug = typeof c.slug === 'string' ? c.slug : c.slug?.current;
      return catSlug === slug;
    });
    return category?.title || slug;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    
    // Scroll to top of news section smoothly
    const newsSection = document.querySelector('h2.text-2xl.font-bold');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Load more posts (for infinite scroll alternative)
  const loadMorePosts = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Generate page numbers
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxPagesToShow - 1);
      
      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // if (isLoading) {
  //   return <NewsSkeleton />;
  // }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error Loading News</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshAllData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      {/* <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-2xl p-6 mb-8">
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative">
            Latest News & Headlines
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto relative">
            Stay updated with breaking news, world events, and business reports
          </p>

          <button
            onClick={refreshAllData}
            disabled={refreshing}
            className="mt-6 relative inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Latest Updates"}
          </button>
        </div>
      </div> */}

      {/* Category Filters */}
      <div className="flex flex-col items-center my-4">
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {categoryConfig.map((category) => {
            const IconComponent = category.icon;
            const categoryData = newsCategories.find((c) => {
              const catSlug = typeof c.slug === 'string' ? c.slug : c.slug?.current;
              return catSlug === category.slug;
            });
            const displayName = categoryData?.title || category.name;

            return (
              <button
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
                className={`${category.color} px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all ${
                  activeCategory === category.slug
                    ? "ring-2 ring-offset-2 ring-current scale-105"
                    : "opacity-90 hover:opacity-100 hover:scale-105"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="ml-2">{displayName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicator */}
        {activeCategory !== "news" && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Showing: {getCategoryDisplayName(activeCategory)} ({filteredPosts.length} articles)
            </span>
            <button
              onClick={() => handleCategoryChange("news")}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 md:gap-6 mb-8 lg:mb-10 gap-4">
        {/* Featured News Swiper */}
        <div className="lg:col-span-8 md:col-span-12 col-span-12 order-1">
          <div className="bg-card  md:p-4 shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white px-2 md:px-0">
                {activeCategory === "news"
                  ? "Top Headlines"
                  : `${getCategoryDisplayName(activeCategory)} News`}
              </h2>
            </div>
            {filteredPosts.length >= 3 ? (
              <NewsSwiper post={filteredPosts.slice(0, 3)} />
            ) : filteredPosts.length > 0 ? (
              <NewsSwiper post={filteredPosts} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No featured articles available</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Latest */}
        <div className="lg:col-span-4 md:col-span-12 col-span-12 order-2">
          <div className="bg-card md:p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Latest Updates
            </h2>
            <div className="flex flex-col gap-4">
              {filteredPosts.slice(3, 4).map((post) => (
                <div key={post._id}>
                  <SideBlog post={post} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* More News with Pagination */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              More News
            </h2>
            <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              {currentPosts.length} of {filteredPosts.length} articles • Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
        
        {/* Current Page Posts */}
        {currentPosts.length > 0 ? (
          <>
            <MasonryGrid posts={currentPosts.slice(4)} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {(currentPage - 1) * postsPerPage + 1} to{" "}
                  {Math.min(currentPage * postsPerPage, filteredPosts.length)} of{" "}
                  {filteredPosts.length} articles
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {generatePageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  
                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Load More Button (Alternative) */}
            {currentPage < totalPages && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More (${Math.min(postsPerPage, filteredPosts.length - currentPage * postsPerPage)} more articles)`
                  )}
                </button>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Showing {currentPage * postsPerPage} of {filteredPosts.length} articles
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              No articles found in {getCategoryDisplayName(activeCategory)}
            </h3>
            <button
              onClick={() => handleCategoryChange("news")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All News
            </button>
          </div>
        )}
      </div>
    </>
  );
}