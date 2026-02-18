import SubCatSkeleton from "@/components/global/skeleton/SubCatSkeleton";
import MasonryGrid from "@/components/World";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_CATEGORY_SLUG } from "@/sanity/lib/queries";
import { Suspense } from "react";
import { Rocket, TrendingUp, ArrowRight, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

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

function getPostDetailUrl(post: Post): string {
  // Check if post has categories
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${post.slug?.current}`;
  }

  // Check each category for "news" or "world"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();
    

    if (categoryTitle === "emerging-tech" || categorySlug === "emerging-tech") {
      return `/technology/emerging-tech/${post.slug?.current}`;
    }

    
    // Also check parent category if exists
    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();
      
      if (parentTitle === "emerging-tech" || parentSlug === "emerging-tech") {
        return `/technology/emerging-tech/${post.slug?.current}`;
      }
      
  
    }
  }

  // Default to /blogs/ if no specific category matches
  return `/blogs/${post.slug?.current}`;
}


// Server component that fetches data
async function EmergingTechContent() {
  const mainBlogs = await client.fetch(
    BLOG_BY_CATEGORY_SLUG,
    { slug: "emerging-tech" },
    {
      cache: "no-store",
      next: {
        tags: ["technology/emerging-tech"],
        revalidate: 3600,
      },
    }
  );

  return (
    <div className="mt-10">
      {mainBlogs?.length > 3 ? (
        <MasonryGrid posts={mainBlogs.slice(4)} />
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-gray-600 text-lg">
            No emerging tech updates available. Check back later for the latest innovations!
          </p>
        </div>
      )}
    </div>
  );
}

// Trending posts component
async function TrendingEmergingTech() {
  const trendingPosts = await client.fetch(
    BLOG_BY_CATEGORY_SLUG,
    { slug: "emerging-tech" },
    {
      cache: "no-store",
      next: {
        tags: ["technology/emerging-tech"],
        revalidate: 3600,
      },
    }
  );

  const trending = trendingPosts?.slice(0, 3) || [];

  if (trending.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-card rounded-xl p-6 shadow-sm">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {trending.map((post) => (
        <Link key={post._id} href={getPostDetailUrl(post)}>
          <article className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="relative h-44 overflow-hidden">
              <img
                src={post.mainImage?.asset ? urlFor(post.mainImage).url() : "/fallback-image.jpg"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {post.categories?.[0]?.title || 'Emerging Tech'}
                </span>
              </div>
            </div>

            <div className="p-2">
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

              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2 line-clamp-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              )}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

// Client component for the interactive parts
function EmergingTechClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Trending Section */}
      <section className="py-4 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-orange-600" />
              Trending Emerging Tech
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
            <TrendingEmergingTech />
          </Suspense>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Emerging Technology Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover breakthroughs in blockchain, quantum computing, AR/VR, spatial computing, and other transformative technologies.
            </p>
          </div>

          <Suspense fallback={<SubCatSkeleton />}>
            <EmergingTechContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

// Main page component
export default function EmergingTechPage() {
  return <EmergingTechClient />;
}

export const metadata = {
  title: "Emerging Technology | Web3, Quantum Computing, AR/VR & Future Tech",
  description: "Explore cutting-edge technologies including blockchain, quantum computing, spatial computing, AR/VR, and other transformative innovations shaping our future.",
  keywords: ["emerging technology", "web3", "blockchain", "quantum computing", "ar vr", "spatial computing", "future tech", "metaverse", "innovation"],
};