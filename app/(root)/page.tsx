import {
  BLOG_QUERY,
  BLOG_BY_CATEGORY_SLUG,
  SEARCH_QUERY,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { Suspense } from "react";
import { Metadata } from "next";
import HomeSkeleton from "@/components/global/skeleton/HomeSkeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HydrationFix from "@/components/HydrationFix"; // ADD THIS

// Import your components normally
import PickForYou from "@/components/PickForYou";
import SwipeBlog from "@/components/SwipeBlog";
import HomeBlog from "@/components/HomeBlog";
import TechnologyCat from "@/components/TechnologyCat";
import LatestNews from "@/components/LatestNews";
import GadgetsSection from "@/components/GadgetsSection";
import TextNewsGrid from "@/components/TextNewsGrid";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Home - GeokHub",
  description: "Latest technology updates, AI developments, software tutorials, and digital lifestyle tips to enhance your modern life.",
};

async function getHomeData(searchTerm?: string) {
  try {
    const queries = [
      client.fetch(BLOG_BY_CATEGORY_SLUG, { slug: "news" }),
      client.fetch(BLOG_BY_CATEGORY_SLUG, { slug: "tech-news" }),
      client.fetch(BLOG_BY_CATEGORY_SLUG, { slug: "gadgets" }),
      client.fetch(BLOG_BY_CATEGORY_SLUG, { slug: "lifestyle" }),
      client.fetch(BLOG_BY_CATEGORY_SLUG, { slug: "technology" }),
      searchTerm
        ? client.fetch(SEARCH_QUERY, { searchTerm: `*${searchTerm}*` })
        : Promise.resolve([]),
    ];

    const results = await Promise.allSettled(queries);
    
    return results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value || [];
      } else {
        return [];
      }
    });
  } catch (error) {
    console.error('Home data fetching failed:', error);
    return [[], [], [], [], [], []];
  }
}

const HomeContent = async ({ searchTerm }: { searchTerm?: string }) => {
  const data = await getHomeData(searchTerm);
  
  const [
    forYou = [],
    latestNews = [],
    gadgets = [],
    lifestyle = [],
    technology = [],
    searchResults = [],
  ] = data;

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section - ALL CLIENT COMPONENTS WRAPPED */}
        {!searchTerm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-2">
            <div className="lg:col-span-6 col-span-12">
              <HydrationFix 
                fallback={<div className="min-h-[400px] animate-pulse bg-gray-100 rounded-lg" />}
              >
                <SwipeBlog posts={forYou.slice(0, 2)} />
              </HydrationFix>
            </div>

            <div className="lg:col-span-6 col-span-12">
              <div className="md:mt-7">
                <h1 className="font-bold text-2xl mb-4 text-dark dark:text-gray-200 pl-2">
                  Top Stories
                </h1>
                <div className="rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    {latestNews.slice(0, 2).map((post) => (
                      post?.slug?.current && (
                        <HydrationFix 
                          key={post._id}
                          fallback={<div className="min-h-[200px] animate-pulse bg-gray-100 rounded-lg" />}
                        >
                          <PickForYou post={post} />
                        </HydrationFix>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!searchTerm && (
          <>
            <HydrationFix 
              fallback={<div className="min-h-[200px] animate-pulse bg-gray-100 rounded-lg my-6" />}
            >
              <TextNewsGrid posts={forYou.slice(2, 5)} />
            </HydrationFix>

            <HydrationFix 
              fallback={<div className="min-h-[400px] animate-pulse bg-gray-100 rounded-lg my-6" />}
            >
              <GadgetsSection post={gadgets} />
            </HydrationFix>

            <div className="mb-12">
              <HydrationFix 
                fallback={<div className="min-h-[400px] animate-pulse bg-gray-100 rounded-lg" />}
              >
                {/* <LatestNews posts={latestNews.slice(2, 8)} /> */}
              </HydrationFix>
            </div>

            <div className="mb-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Lifestyle
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {lifestyle.slice(0, 8).map((post) => (
                  post?._id && (
                    <HydrationFix 
                      key={post._id}
                      fallback={<div className="min-h-[300px] animate-pulse bg-gray-100 rounded-lg" />}
                    >
                      {/* <HomeBlog post={post} /> */}
                    </HydrationFix>
                  )
                ))}
              </div>

              <div className="text-center mt-6 sm:mt-8">
                <Link
                  href="/lifestyles"
                  className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  View All Lifestyle Articles
                  <ArrowRight size={14} className="ml-2 sm:ml-2" />
                </Link>
              </div>
            </div>

            <div className="space-y-12">
              <HydrationFix 
                fallback={<div className="min-h-[400px] animate-pulse bg-gray-100 rounded-lg" />}
              >
                {/* <TechnologyCat posts={technology} /> */}
              </HydrationFix>
            </div>
          </>
        )}

        {searchTerm && (
          <div className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.length > 0 ? (
                searchResults.map((post) => (
                  post?._id && (
                    <HydrationFix 
                      key={post._id}
                      fallback={<div className="min-h-[300px] animate-pulse bg-gray-100 rounded-lg" />}
                    >
                      {/* <HomeBlog post={post} /> */}
                    </HydrationFix>
                  )
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-white dark:bg-gray-800 rounded-xl">
                  <p className="text-gray-500">
                    No results found for &quot;{searchTerm}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const searchTerm = query || "";

  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent searchTerm={searchTerm} />
    </Suspense>
  );
}