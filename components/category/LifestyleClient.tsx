
'use client';

import { useState } from "react";
import MasonryGrid from "@/components/World";
import { Sparkles, Loader2, X } from "lucide-react";
import Link from "next/link";
import { Post, Category } from "@/type";

interface Props {
  initialPosts: Post[];
  allPosts: Post[];
  activeCategory: string;
  lifestyleCategories: Category[];
}

export default function LifestyleClient({
  initialPosts,
  allPosts,
  activeCategory,
  lifestyleCategories,
}: Props) {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>(initialPosts);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredPosts = allPosts; // already pre‑filtered by server
  const postsPerLoad = 17;
  const hasMore = displayedPosts.length < filteredPosts.length;

  const loadMorePosts = async () => {
    setLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDisplayedPosts((prev) => {
      const start = prev.length;
      const next = filteredPosts.slice(start, start + postsPerLoad);
      return [...prev, ...next];
    });
    setLoadingMore(false);
  };

  return (
    <>
      {displayedPosts.length > 0 ? (
        <>
          <MasonryGrid posts={displayedPosts.slice(5)} />

          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMorePosts}
                disabled={loadingMore}
                className="px-8 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center mx-auto"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Loading More Articles...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Load {Math.min(postsPerLoad, filteredPosts.length - displayedPosts.length)} More Articles
                  </>
                )}
              </button>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {filteredPosts.length - displayedPosts.length} articles remaining
              </p>
            </div>
          )}

          {!hasMore && filteredPosts.length > 0 && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                You've reached the end!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                All {filteredPosts.length} articles have been loaded.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/lifestyle"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Back to All Lifestyle
                </Link>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Scroll to Top
                </button>
              </div>
            </div>
          )}
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
              : `No articles available in ${
                  lifestyleCategories.find((c) => {
                    const catSlug = typeof c.slug === 'string' ? c.slug : c.slug?.current;
                    return catSlug === activeCategory;
                  })?.title || activeCategory
                } yet.`}
          </p>
          <Link
            href="/lifestyle"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      )}
    </>
  );
}
