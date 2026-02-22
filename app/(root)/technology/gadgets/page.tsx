import MasonryGrid from "@/components/World";
import PaginationControls from "@/components/PaginationControls";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_CATEGORY_SLUG } from "@/sanity/lib/queries";
import { Zap, TrendingUp, ArrowRight, Calendar } from "lucide-react";
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

function getSlugValue(post: any): string | undefined {
  if (!post?.slug) return undefined;
  return typeof post.slug === "string" ? post.slug : post.slug.current;
}

function getPostDetailUrl(post: any): string {
  const slugValue = getSlugValue(post) ?? "";
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${slugValue}`;
  }
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
  return `/blogs/${slugValue}`;
}

export default async function GadgetsPage({ searchParams }: { searchParams?: { page?: string } } = {}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const postsPerPage = 12;
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;

  // fetch total count
  const totalCountQuery = `count(*[_type == "post" && count((categories[]->slug.current)[@ == "gadgets"]) > 0])`;
  const totalCount = await client.fetch(totalCountQuery);

  // fetch paginated posts
  const mainBlogs = await client.fetch(
    BLOG_BY_CATEGORY_SLUG,
    { slug: "gadgets", start, end },
    { cache: "no-store", next: { tags: ["technology/gadgets"], revalidate: 3600 } }
  );

  const trending = mainBlogs?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Trending */}
      <section className="py-4 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-orange-600" />
              Trending Gadgets
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trending.length > 0 ? (
              trending.map((post) => (
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
                          {post.categories?.[0]?.title || 'Gadgets'}
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
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-zap-100 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-zap-600" />
                </div>
                <p className="text-gray-600 text-lg">
                  No gadgets content available yet; check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Gadget Reviews & News
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay ahead with reviews of the newest gadgets and in-depth tech analysis.
            </p>
          </div>
          {mainBlogs?.length > 3 ? (
            <>
              <MasonryGrid posts={mainBlogs.slice(4)} />
              {totalCount > postsPerPage && (
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
              <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No gadget articles found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Check back soon for the latest gadget reviews and news.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}