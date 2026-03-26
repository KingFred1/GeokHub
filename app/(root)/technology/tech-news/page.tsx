import SubCatSkeleton from "@/components/global/skeleton/SubCatSkeleton";
import MasonryGrid from "@/components/World";
import { client } from "@/sanity/lib/client";
import { Suspense } from "react";
import { Cpu, TrendingUp, Clock, Zap } from "lucide-react";
import { NewsletterForm } from "@/components/global/Newsletter-form";
import PaginationControls from "@/components/PaginationControls";
import { BLOG_BY_CATEGORY_SLUG_PAGINATED } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 2592000; // 1 day


interface TechnologyContentProps {
  page?: number;
}

async function TechnologyContent({ page = 1 }: TechnologyContentProps) {
  const postsPerPage = 12;
  const currentPage = Math.max(1, page);
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  
  try {
    // Get total count
    const totalCountQuery = `count(*[_type == "post" && count((categories[]->slug.current)[@ == "tech-news"]) > 0])`;
    const totalCount = await client.fetch(totalCountQuery);
    
    // Get paginated posts
    const mainBlogs = await client.fetch(
      BLOG_BY_CATEGORY_SLUG_PAGINATED,
      { 
        slug: "tech-news",
        start: start,
        end: end
      },
      {
        cache: "no-store",
        next: {
          tags: ["technology/tech-news"],
          revalidate: 2592000,
        },
      }
    );
    
    return {
      posts: mainBlogs || [],
      totalCount: totalCount || 0,
      currentPage,
      postsPerPage
    };
  } catch (error) {
    console.error("Error fetching technology content:", error);
    return {
      posts: [],
      totalCount: 0,
      currentPage: 1,
      postsPerPage: 12
    };
  }
}

async function TechnologyWithPagination({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  
  const data = await TechnologyContent({ page });
  
  return (
    <>
      <Suspense fallback={<SubCatSkeleton />}>
        <MasonryGrid posts={data.posts} />
      </Suspense>
      
      {/* Pagination Controls */}
      {data.totalCount > data.postsPerPage && (
        <div className="mt-12">
          <PaginationControls
            currentPage={data.currentPage}
            totalItems={data.totalCount}
            itemsPerPage={data.postsPerPage}
            baseUrl="/technology/tech-news"
          />
        </div>
      )}
      
      {/* No Results Message */}
      {data.posts.length === 0 && data.totalCount === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <Cpu className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No Tech News Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Check back soon for the latest technology updates.
          </p>
        </div>
      )}
    </>
  );
}

export default async function Technology({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  
  // Get total count for metadata
  const totalCountQuery = `count(*[_type == "post" && count((categories[]->slug.current)[@ == "tech-news"]) > 0])`;
  const totalCount = await client.fetch(totalCountQuery);
  const totalPages = Math.ceil((totalCount || 0) / 12);
  
  return (
    <div className="min-h-screen bg-background dark:bg-darkbackground transition-colors">
      {/* Main Content */}
      <main className="px-0 md:px-4 lg:px-8 py-8">
        {/* Featured Tech News Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="md:px-0 px-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {page > 1 ? `Tech News - Page ${page}` : "Latest Tech News"}
              </h2>
              {/* <p className="text-gray-600 dark:text-gray-400 mt-2">
                {page > 1 
                  ? `Page ${page} of technology news and updates`
                  : "Stay informed with the most recent developments in technology"
                }
                {totalCount > 0 && ` • ${totalCount} total articles`}
              </p> */}
            </div>
            
            {/* Page Stats */}
            {totalCount > 12 && (
              <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </div>
            )}
          </div>

          <TechnologyWithPagination searchParams={searchParams} />
        </section>

        {/* Newsletter Subscription */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-6 text-white">
              <NewsletterForm
                variant="inline"
                title="Weekly Updates"
                description="Get the latest news and insights delivered to your inbox."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Update metadata to support pagination
export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  
  return {
    title: page > 1 
      ? `Tech News - Page ${page} | Latest Technology Updates & Innovations`
      : "Tech News - Latest Technology Updates & Innovations",
    description: page > 1
      ? `Page ${page} of technology news, trends, and innovations. Get updates on AI, programming, cybersecurity, gadgets and more.`
      : "Stay informed with the latest technology news, trends, and innovations. Get updates on AI, programming, cybersecurity, gadgets and more.",
    keywords: [
      "technology news",
      "tech updates",
      "AI news",
      "programming",
      "cybersecurity",
      "gadgets",
    ],
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};