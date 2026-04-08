import MasonryGrid from "@/components/World";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_CATEGORY_SLUG } from "@/sanity/lib/queries";
import { Brain, Cpu, Sparkles, Binary, CloudCog, Network, TrendingUp, Calendar } from "lucide-react";
import { NewsletterForm } from "@/components/global/Newsletter-form";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 2592000; // Revalidate every hour

export default async function AI() {
  const mainBlogs = await client.fetch(
    BLOG_BY_CATEGORY_SLUG,
    { slug: "ai" },
    {
      next: {
        tags: ["technology/ai"],
        revalidate: 2592000,
      },
    }
  );
  const trendingPosts = mainBlogs?.slice(0, 4) || [];

  // function formatTimeShort(dateString: string): string {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  //   if (diffInSeconds < 60) return "just now";
  //   const diffInMinutes = Math.floor(diffInSeconds / 60);
  //   if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  //   const diffInHours = Math.floor(diffInMinutes / 60);
  //   if (diffInHours < 24) return `${diffInHours}h ago`;
  //   return `${Math.floor(diffInHours / 24)}d ago`;
  // }

  function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

  function getPostDetailUrl(post: any): string {
    if (!post.categories || post.categories.length === 0) {
      return `/blogs/${post.slug?.current}`;
    }
    for (const category of post.categories) {
      const categoryTitle = category.title?.toLowerCase();
      const categorySlug = category.slug?.current?.toLowerCase();
      if (categoryTitle === "ai" || categorySlug === "ai") {
        return `/technology/ai/${post.slug?.current}`;
      }
      if (category.parent) {
        const parentTitle = category.parent.title?.toLowerCase();
        const parentSlug = category.parent.slug?.current?.toLowerCase();
        if (parentTitle === "ai" || parentSlug === "ai") {
          return `/technology/ai/${post.slug?.current}`;
        }
      }
    }
    return `/blogs/${post.slug?.current}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-8 relative z-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white my-4 md:px-0 px-4">
          Artificial Intelligence
        </h1>
      </div>

      {/* Trending Section */}
      <section className="py-4 bg-gray-50 dark:bg-gray-800">
        <div className="px-0 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post: any) => (
                <Link key={post._id} href={getPostDetailUrl(post)}>
                  <article className="bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.mainImage?.asset ? urlFor(post.mainImage).url() : "/fallback-image.jpg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {post.categories?.[0]?.title || 'AI'}
                        </span>
                      </div>
                    </div>
                    <div className="py-2 md:px-2 px-4">
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
                        <span>{formatDate(post._createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-xl text-gray-900 dark:text-white md:mb-2 mb-4 line-clamp-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ">
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
      <main className="max-w-7xl mx-auto mt-5 px-0 md:px-6 lg:px-8 pb-20">
        {mainBlogs?.length > 3 ? (
          <MasonryGrid posts={mainBlogs.slice(4)} />
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
              <Cpu className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-gray-600 text-lg">
              No AI articles yet – check back soon for the latest research!
            </p>
          </div>
        )}
      </main>

      {/* Animated CTA Section */}
      <div className="mt-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
          </div>

          <div className="relative z-10">
            <CloudCog className="h-16 w-16 text-white mx-auto mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Never Miss an AI Update
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of AI enthusiasts staying informed about the
              latest breakthroughs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <div className="bg-card rounded-2xl p-6 text-white">
                <NewsletterForm
                  variant="inline"
                  title="Weekly Updates"
                  description="Get the latest news and insights delivered to your inbox."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Elements */}
      <div className="fixed top-20 right-10 w-8 h-8 bg-blue-400 rounded-full blur-xl opacity-40 animate-float-slow"></div>
      <div className="fixed bottom-40 left-5% w-6 h-6 bg-purple-400 rounded-full blur-xl opacity-30 animate-float-medium delay-2000"></div>
      <div className="fixed top-1/3 left-15% w-4 h-4 bg-cyan-400 rounded-full blur-xl opacity-50 animate-float-fast delay-1000"></div>
    </div>
  );
}

export const metadata = {
  title: "Artificial Intelligence - Cutting Edge AI Research & Insights",
  description:
    "Discover the latest breakthroughs in artificial intelligence, machine learning, neural networks, and AI applications. Stay ahead of the curve with cutting-edge insights.",
  keywords: [
    "artificial intelligence",
    "AI",
    "machine learning",
    "neural networks",
    "deep learning",
    "AI research",
    "computer vision",
    "NLP",
  ],
};
