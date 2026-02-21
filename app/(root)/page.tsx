import { SEARCH_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import HomeSkeleton from "@/components/global/skeleton/HomeSkeleton";
import Link from "next/link";

// lightweight arrow icon to avoid pulling in the lucide-react bundle
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// client wrappers for components that depend on browser APIs
import ClientOnlySwipeBlog from "@/components/ClientOnlySwipeBlog";
import ClientOnlyGadgetsSection from "@/components/ClientOnlyGadgetsSection";

// server components for static render
import PickForYou from "@/components/PickForYou";
import HomeBlog from "@/components/HomeBlog";
import TechnologyCat from "@/components/TechnologyCat";
import LatestNews from "@/components/LatestNews";
import TextNewsGrid from "@/components/TextNewsGrid";

// ISR configuration
export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "Home - GeokHub",
  description:
    "Latest technology updates, AI developments, software tutorials, and digital lifestyle tips to enhance your modern life.",
};

// bundled query returning small slices for each category
const HOME_CATEGORIES_QUERY = `{
  "news": *[_type=="post" && (
      count((categories[]->slug.current)[@=="news"])>0 ||
      count((categories[]->parent->slug.current)[@=="news"])>0
    )] | order(publishedAt desc)[0..8] {
      _id,title,slug,publishedAt,_updatedAt,
      author->{name,image},
      categories[]->{title,slug,parent->{title,slug}},
      mainImage,body,seoTitle,metaDescription,keywords
    },
  "techNews": *[_type=="post" && (
      count((categories[]->slug.current)[@=="tech-news"])>0 ||
      count((categories[]->parent->slug.current)[@=="tech-news"])>0
    )] | order(publishedAt desc)[0..8] {
      _id,title,slug,publishedAt,_updatedAt,
      author->{name,image},
      categories[]->{title,slug,parent->{title,slug}},
      mainImage,body,seoTitle,metaDescription,keywords
    },
  "gadgets": *[_type=="post" && (
      count((categories[]->slug.current)[@=="gadgets"])>0 ||
      count((categories[]->parent->slug.current)[@=="gadgets"])>0
    )] | order(publishedAt desc)[0..8] {
      _id,title,slug,publishedAt,_updatedAt,
      author->{name,image},
      categories[]->{title,slug,parent->{title,slug}},
      mainImage,body,seoTitle,metaDescription,keywords
    },
  "lifestyle": *[_type=="post" && (
      count((categories[]->slug.current)[@=="lifestyle"])>0 ||
      count((categories[]->parent->slug.current)[@=="lifestyle"])>0
    )] | order(publishedAt desc)[0..8] {
      _id,title,slug,publishedAt,_updatedAt,
      author->{name,image},
      categories[]->{title,slug,parent->{title,slug}},
      mainImage,body,seoTitle,metaDescription,keywords
    },
  "technology": *[_type=="post" && (
      count((categories[]->slug.current)[@=="technology"])>0 ||
      count((categories[]->parent->slug.current)[@=="technology"])>0
    )] | order(publishedAt desc)[0..8] {
      _id,title,slug,publishedAt,_updatedAt,
      author->{name,image},
      categories[]->{title,slug,parent->{title,slug}},
      mainImage,body,seoTitle,metaDescription,keywords
    }
}`;

async function getHomeData(searchTerm?: string) {
  try {
    const result: {
      news: any[];
      techNews: any[];
      gadgets: any[];
      lifestyle: any[];
      technology: any[];
    } = await client.fetch(HOME_CATEGORIES_QUERY);

    const searchResults = searchTerm
      ? await client.fetch(SEARCH_QUERY, { searchTerm: `*${searchTerm}*` })
      : [];

    return [
      result.news,
      result.techNews,
      result.gadgets,
      result.lifestyle,
      result.technology,
      searchResults,
    ];
  } catch (e) {
    console.error("Home data fetching failed:", e);
    return [[], [], [], [], [], []];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const searchTerm = query || "";

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
        {/* Hero Section */}
        {!searchTerm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-2">
            <div className="lg:col-span-6 col-span-12">
              <ClientOnlySwipeBlog posts={forYou.slice(0, 2)} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <div className="md:mt-7">
                <h1 className="font-bold text-2xl mb-4 text-dark dark:text-gray-200 pl-2">
                  Top Stories
                </h1>
                <div className="rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    {latestNews.slice(0, 2).map((post) => (
                      post?._id && <PickForYou key={post._id} post={post} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!searchTerm && (
          <>
            <TextNewsGrid posts={forYou.slice(2, 5)} />
            <ClientOnlyGadgetsSection post={gadgets} />
            <div className="mb-12">
              <LatestNews posts={latestNews.slice(2, 8)} />
            </div>
            <div className="mb-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Lifestyle
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {lifestyle.slice(0, 8).map((post) => (
                  post?._id && <HomeBlog key={post._id} post={post} />
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-8">
                <Link
                  href="/lifestyles"
                  className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  View All Lifestyle Articles
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
            <div className="space-y-12">
              <TechnologyCat posts={technology} />
            </div>
          </>
        )}

        {searchTerm && (
          <div className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.length > 0 ? (
                searchResults.map((post) => (
                  post?._id && <HomeBlog key={post._id} post={post} />
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
}
