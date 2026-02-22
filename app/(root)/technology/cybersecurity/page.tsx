import MasonryGrid from "@/components/World";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { BLOG_BY_CATEGORY_SLUG } from "@/sanity/lib/queries";
import { Shield, Lock, Fingerprint, Network, Bug, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

// trending icons used later ephemeral

export const dynamic = "force-dynamic";
export const revalidate = 86400 ; // 1 day
// // or
// export const revalidate = 1800; // 30 minutes
// // or  
// export const revalidate = 900; // 15 minutes

export default async function Cybersecurity() {
  const mainBlogs = await client.fetch(
    BLOG_BY_CATEGORY_SLUG,
    { slug: "cybersecurity" },
    {
      cache: "no-store",
      next: {
        tags: ["technology/cybersecurity"],
        revalidate: 86400, // 1 day
      },
    }
  );
  const trendingPosts = mainBlogs?.slice(0, 3) || [];

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

  function getPostDetailUrl(post: any): string {
    if (!post.categories || post.categories.length === 0) {
      return `/blogs/${post.slug?.current}`;
    }
    for (const category of post.categories) {
      const categoryTitle = category.title?.toLowerCase();
      const categorySlug = category.slug?.current?.toLowerCase();
      if (categoryTitle === "cybersecurity" || categorySlug === "cybersecurity") {
        return `/technology/cybersecurity/${post.slug?.current}`;
      }
      if (category.parent) {
        const parentTitle = category.parent.title?.toLowerCase();
        const parentSlug = category.parent.slug?.current?.toLowerCase();
        if (parentTitle === "cybersecurity" || parentSlug === "cybersecurity") {
          return `/technology/cybersecurity/${post.slug?.current}`;
        }
      }
    }
    return `/blogs/${post.slug?.current}`;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Trending Section */}
      <section className="py-4 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-orange-600" />
              Trending Cybersecurity
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post: any) => (
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
                          {post.categories?.[0]?.title || 'Cybersecurity'}
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
              ))
            ) : (
              [1, 2, 3].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm">
                  <div className="animate-pulse">
                    <div className="w-14 h-14 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Cybersecurity Coverage
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay informed on the latest threats, defense techniques, encryption breakthroughs, and privacy tips from the front lines of cybersecurity.
            </p>
          </div>
          {mainBlogs?.length > 3 ? (
            <MasonryGrid posts={mainBlogs.slice(4)} />
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="text-gray-600 text-lg">
                No cybersecurity posts yet – check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: "Cybersecurity - Latest Threats, Protection Strategies & Best Practices",
  description: "Stay updated on the latest cybersecurity threats, defense mechanisms, encryption technologies, and industry best practices to protect your digital assets.",
  keywords: ["cybersecurity", "network security", "encryption", "threat detection", "data protection", "cyber threats"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};