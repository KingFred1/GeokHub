import SubCatSkeleton from "@/components/global/skeleton/SubCatSkeleton";
import MasonryGrid from "@/components/World";
import PaginationControls from "@/components/PaginationControls";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_CATEGORY_SLUG } from "@/sanity/lib/queries";
import { Suspense } from "react";
import { Zap, TrendingUp, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Format time function
function formatTimeShort(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
}

function getSlugValue(post: Post): string | undefined {
  if (!post?.slug) return undefined;
  return typeof post.slug === "string" ? post.slug : post.slug.current;
}

function getPostDetailUrl(post: Post): string {
  const slugValue = getSlugValue(post) ?? "";

  // Check if post has categories
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${slugValue}`;
  }

  // Check each category for "news" or "world"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();
    

    if (categoryTitle === "gadgets" || categorySlug === "gadgets") {
      return `/technology/gadgets/${slugValue}`;
    }

    if (categoryTitle === "tech-news" || categorySlug === "tech-news") {
        return `/technology/tech-news/${slugValue}`;
    }

    if (categoryTitle === "ai" || categorySlug === "ai") {
      return `/technology/ai/${slugValue}`;
    }


    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${slugValue}`;
    }
    
    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${slugValue}`;
    }
    
    // Also check parent category if exists
    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();
      
      if (parentTitle === "news" || parentSlug === "news") {
        return `/news/${slugValue}`;
      }
      
      if (parentTitle === "world" || parentSlug === "world") {
        return `/world/${slugValue}`;
      }
    }
  }

  // Default to /blogs/ if no specific category matches
  return `/blogs/${slugValue}`;
}

// Get total count query
const GET_TOTAL_COUNT = `count(*[_type == "post" && count((categories[]->slug.current)[@ == $slug]) > 0])`;

// Get paginated posts query
const GET_PAGINATED_POSTS = `
  *[_type == "post" && 
    count((categories[]->slug.current)[@ == $slug]) > 0
  ] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _createdAt,
    _updatedAt,
    excerpt,
    author -> {
      name, image
    },
    views,
    categories[]->{
      title,
      "slug": slug.current
    },
    mainImage,
    body,
    seoTitle,
    metaDescription,
    keywords
  }
`;

// Server component for trending posts
async function TrendingGadgets() {
  const trendingPosts = await client.fetch(
    BLOG_BY_CATEGORY_SLUG,
    { slug: "gadgets" },
    {
      cache: "no-store",
      next: {
        tags: ["technology/gadgets"],
        revalidate: 3600,
      },
    }
  );

  const trending = trendingPosts?.slice(0, 4) || [];

  if (trending.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="w-14 h-14 bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {trending.map((post: any) => (
        <Link key={post._id} href={getPostDetailUrl(post)}>
          <article className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
            {/* Post Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={post.mainImage?.asset ? urlFor(post.mainImage).url() : "/fallback-image.jpg"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {post.categories?.[0]?.title || 'Gadgets'}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-2">
              {/* Author and Date */}
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-3">
                {post.author?.image && (
                  <img
                    src={urlFor(post.author.image).url()}
                    alt={post.author.name}
                    className="rounded-full h-6 w-6"
                  />
                )}
                <span className="font-medium">{post.author?.name}</span>
                <span>•</span>
                <Calendar size={12} />
                <span>{formatTimeShort(post._createdAt)}</span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

// Main content with pagination
async function MainContent({ page = 1 }: { page: number }) {
  const postsPerPage = 12;
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  
  try {
    // Get total count
    const totalCount = await client.fetch(GET_TOTAL_COUNT, { slug: "gadgets" });
    
    // Get paginated posts
    const posts = await client.fetch(
      GET_PAGINATED_POSTS,
      { 
        slug: "gadgets",
        start,
        end
      },
      {
        cache: "no-store",
        next: {
          tags: ["technology/gadgets"],
          revalidate: 3600,
        },
      }
    );
    
    const totalPages = Math.ceil((totalCount || 0) / postsPerPage);
    
    return (
      <div className="mt-10">
        {posts.length > 0 ? (
          <>
            <MasonryGrid posts={posts.slice(4)} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12">
                <PaginationControls
                  currentPage={page}
                  totalItems={totalCount}
                  itemsPerPage={postsPerPage}
                  baseUrl="/technology/gadgets"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-600 text-lg">
              No gadget updates available at the moment. Check back later for the latest tech!
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching main content:", error);
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Zap className="h-8 w-8 text-red-600" />
        </div>
        <p className="text-gray-600 text-lg">
          Error loading gadget content. Please try again later.
        </p>
      </div>
    );
  }
}

interface GadgetsPageProps {
  searchParams: Promise<{ page?: string }>;
}

// Hero Section component
function HeroSection({ page, totalCount, totalPages }: { page: number; totalCount: number; totalPages: number }) {
  return (
    <section className="">
      
    </section>
  );
}

export default async function GadgetsPage({ searchParams }: GadgetsPageProps) {
  const params = await searchParams;
  const page = params.page ? Math.max(1, parseInt(params.page)) : 1;
  
  // Get total count for stats
  const totalCount = await client.fetch(GET_TOTAL_COUNT, { slug: "gadgets" });
  const totalPages = Math.ceil((totalCount || 0) / 12);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection page={page} totalCount={totalCount} totalPages={totalPages} />

      {/* Trending Section */}
      <section className="py-12 bg-background">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
              Trending Gadgets
            </h2>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm">
                  <div className="animate-pulse">
                    <div className="w-14 h-14 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <TrendingGadgets />
          </Suspense>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {page > 1 ? `Gadgets - Page ${page}` : "Latest Gadget Reviews & News"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {page > 1 
                ? `Page ${page} of gadget reviews and technology news`
                : "Stay informed with the most recent gadget releases, expert reviews, and technology breakthroughs."
              }
              {totalCount > 0 && ` • ${totalCount} total articles`}
            </p>
          </div>

          <Suspense fallback={<SubCatSkeleton />}>
            <MainContent page={page} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ searchParams }: GadgetsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  
  return {
    title: page > 1 
      ? `Gadgets & Tech - Page ${page} | Latest Reviews & Innovations`
      : "Latest Gadgets & Tech News | Reviews & Innovations",
    description: page > 1
      ? `Page ${page} of gadget reviews, tech news, and cutting-edge innovations. Stay updated on smartphones, wearables, laptops, and more.`
      : "Discover the newest gadgets, in-depth tech reviews, and cutting-edge innovations. Stay updated on smartphones, wearables, laptops, and more.",
    keywords: ["gadgets", "technology", "tech news", "device reviews", "smartphones", "wearables", "gaming gear", "tech innovations"],
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};