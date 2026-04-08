import { SEARCH_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import Link from "next/link";

// lightweight arrow icon to avoid pulling in the lucide-react bundle
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);


// server components for static render
import PickForYou from "@/components/PickForYou";
import HomeBlog from "@/components/HomeBlog";
import TechnologyCat from "@/components/TechnologyCat";
import LatestNews from "@/components/LatestNews";
import TextNewsGrid from "@/components/TextNewsGrid";

import StaticFeaturedPosts from "@/components/StaticFeaturedPosts";
import StaticGadgetsGrid from "@/components/StaticGadgetsGrid";

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
    "ai": *[_type=="post" && (
      count((categories[]->slug.current)[@=="ai"])>0 ||
      count((categories[]->parent->slug.current)[@=="ai"])>0
    )] | order(publishedAt desc)[0..8] {
      _id,title,slug,publishedAt,_updatedAt,
      author->{name,image},
      categories[]->{title,slug,parent->{title,slug}},
      mainImage,body,seoTitle,metaDescription,keywords
    },
    "cybersecurity": *[_type=="post" && (
      count((categories[]->slug.current)[@=="cybersecurity"])>0 ||
      count((categories[]->parent->slug.current)[@=="cybersecurity"])>0
    )] | order(publishedAt desc)[0..8] {
      _id,title,slug,publishedAt,_updatedAt,
      author->{name,image},
      categories[]->{title,slug,parent->{title,slug}},
      mainImage,body,seoTitle,metaDescription,keywords
    },
  "technology": *[_type=="post" && (
      count((categories[]->slug.current)[@=="ai"])>0 ||
      // count((categories[]->slug.current)[@=="programming"])>0 ||
      // count((categories[]->slug.current)[@=="cloud-devops"])>0 ||
      // count((categories[]->slug.current)[@=="emerging-tech"])>0 ||
      // count((categories[]->slug.current)[@=="gadgets"])>0 ||
      count((categories[]->slug.current)[@=="cybersecurity"])>0 ||
      count((categories[]->parent->slug.current)[@=="ai"])>0 ||
      count((categories[]->parent->slug.current)[@=="programming"])>0 ||
      count((categories[]->parent->slug.current)[@=="cloud-devops"])>0 ||
      count((categories[]->parent->slug.current)[@=="emerging-tech"])>0 ||
      count((categories[]->parent->slug.current)[@=="gadgets"])>0 ||
      count((categories[]->parent->slug.current)[@=="cybersecurity"])>0
    )] | order(publishedAt desc)[0..30] {
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
      ai: any[];
      cybersecurity: any[];
      lifestyle: any[];
      technology: any[];
    } = await client.fetch(HOME_CATEGORIES_QUERY);

    const searchResults = searchTerm
      ? await client.fetch(SEARCH_QUERY, { searchTerm: `*${searchTerm}*` })
      : [];

    return [
      // result.news,
      result.ai,
      result.cybersecurity,
      // result.lifestyle,
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
    ai = [],
    cybersecurity = [],
    // gadgets = [],
    // lifestyle = [],
    technology = [],
    searchResults = [],
  ] = data;

  // debugging: log counts so we can see if technology posts arrived
  // console.log("home data counts:", {
  //   forYou: forYou.length,
  //   latestNews: latestNews.length,
  //   gadgets: gadgets.length,
  //   lifestyle: lifestyle.length,
  //   technology: technology.length,
  // });

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto md:px-12">
        {/* Hero Section */}
        {!searchTerm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
            <div className="lg:col-span-6 col-span-12">
              <StaticFeaturedPosts posts={ai.slice(0, 1)} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <div className="md:mt-7">
                <Link 
                  href="/technology/cybersecurity"
                  className="flex hover:underline font-bold text-xl mb-4 text-dark dark:text-gray-200 pl-2"
                >
                  Cybersecurity Latest
                  <ArrowRightIcon />
                </Link>
                <div className="rounded-lg">
                  <div className="grid md:grid-cols-1 md:gap-4">
                    {cybersecurity
                      .slice(0, 2)
                      .map(
                        (post) =>
                          post?._id && (
                            <PickForYou key={post._id} post={post} />
                          ),
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!searchTerm && (
          <>
            {/* <TextNewsGrid posts={forYou.slice(1, 4)} /> */}
            
            <div className="mb-12">
              <LatestNews posts={ai.slice(2, 8)} />
            </div>

            {/* <StaticGadgetsGrid post={gadgets} /> */}

            <div className="mb-12">
              <Link href="/technology/cybersecurity" className=" flex hover:underline font-semibold text-xl mb-4 text-dark dark:text-gray-200 pl-2">
                Cybersecurity
                <ArrowRightIcon />
              </Link>
              <div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {cybersecurity
                  .slice(2, 8)
                  .map(
                    (post) =>
                      post?._id && <HomeBlog key={post._id} post={post} />,
                  )}
              </div>
            </div>
            <div className="space-y-12">
              {technology.length > 0 ? (
                <TechnologyCat posts={technology} />
              ) : (
                <p className="text-center text-gray-500">
                  No technology articles available right now.
                </p>
              )}
            </div>
          </>
        )}

        {searchTerm && (
          <div className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.length > 0 ? (
                searchResults.map(
                  (post) =>
                    post?._id && <HomeBlog key={post._id} post={post} />,
                )
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
