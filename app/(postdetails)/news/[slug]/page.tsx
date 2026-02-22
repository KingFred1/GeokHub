import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { notFound, redirect } from "next/navigation";
import markdownit from "markdown-it";
import removeMarkdown from "remove-markdown";
import { Metadata } from "next";
import { CodeScript } from "@/components/CodeScript";
import Link from "next/link";
import View from "@/components/View";
// Suspense/skeleton removed; view counter rendered server-side
import TextToSpeechPlayer from "@/components/global/TextToSpeechPlayer";
import SocialShare from "@/components/global/SocialShare";
import MasonryGrid from "@/components/World";
import FloatingActionBar from "@/components/global/FloatingActionBar";
import markdownItLinkAttributes from "markdown-it-link-attributes";
import BlogContentWithReadMore from "@/components/global/BlogContentWithReadMore";
import SidebarShareButton from "@/components/global/SidebarShareButton";
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Clock,
  MapPin,
  Newspaper,
} from "lucide-react";
import { NewsletterForm } from "@/components/global/Newsletter-form";
import {
  BLOG_BY_CATEGORY_SLUG,
  RELATED_POSTS_QUERY,
} from "@/sanity/lib/queries";

import ImageSliderWrapper from "@/components/ImageSliderWrapper";

// Initialize markdown parser with better configuration
const md = markdownit({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
}).use(markdownItLinkAttributes, {
  pattern: /^https?:\/\//,
  attrs: {
    target: "_blank",
    rel: "noopener noreferrer nofollow",
  },
});

// CRITICAL: Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 86400;

// METADATA
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;

    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        title,
        author->{name},
        categories[]->{title},
        mainImage,
        seoTitle,
        metaDescription,
        excerpt,
        body,
        publishedAt
      }`,
      { slug },
      { next: { revalidate: 86400 } },
    );

    if (!post) {
      return {
        title: "News Article Not Found - GeokHub",
        description: "The requested news article could not be found.",
        robots: "noindex, nofollow",
      };
    }

    const canonicalUrl = `https://www.geokhub.com/news/${slug}`;
    const baseUrl = "https://www.geokhub.com";
    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .url()
      : `${baseUrl}/og-image.jpg`;

    const description =
      post.excerpt ||
      (post.body
        ? removeMarkdown(post.body).substring(0, 160)
        : "Breaking news coverage on GeokHub");

    return {
      metadataBase: new URL("https://www.geokhub.com"),
      title: post.seoTitle || `${post.title} - GeokHub News`,
      description: post.metaDescription || description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: post.title,
        description,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author?.name || "GeokHub News Team"],
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
        siteName: "GeokHub News",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [imageUrl],
        creator: "@geokhub",
      },
    };
  } catch (error) {
    // Avoid signaling "noindex" on transient errors — keep pages indexable by default.
    return {
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }
}

// Time formatting function
function formatReadableDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getSlugValue(post: any): string | undefined {
  if (!post) return undefined;
  if (typeof post.slug === "string") return post.slug;
  return post.slug?.current;
}

// Function to get post detail URL based on category
function getPostUrl(post: any): string {
  const slugValue = getSlugValue(post) ?? "";

  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${slugValue}`;
  }

  // Check each category for "news", "world" or "business"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();

    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${slugValue}`;
    }

    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${slugValue}`;
    }

    if (categoryTitle === "business" || categorySlug === "business") {
      return `/news/business/${slugValue}`;
    }

    // Also check parent category if exists
    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();

      if (parentTitle === "news" || parentSlug === "news") {
        return `/news/${slugValue}`;
      }

      if (parentTitle === "world" || parentSlug === "world") {
        return `/news/world/${slugValue}`;
      }

      if (parentTitle === "business" || parentSlug === "business") {
        return `/news/business/${slugValue}`;
      }
    }
  }

  return `/blogs/${slugValue}`;
}

// MAIN COMPONENT
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const baseUrl = "https://www.geokhub.com";

    // Fetch the news post - using inline query like in blogs page
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        publishedAt,
        _createdAt,
        _updatedAt,
        author -> {
          name,
          image,
          bio
        },
        views,
        categories[]->{
          _id,
          title,
          slug,
          parent->{
            title,
            slug
          }
        },
        mainImage,
    galleryImages[] {
      asset->,
      alt,
      caption
    },
    images[]{
      ...,
      asset->
    },
        body,
        seoTitle,
        metaDescription,
        keywords,
        excerpt,
        location,
        sources,
        breakingNews,
        featured,
        readTime
      }`,
      { slug: decodedSlug },
      {
        next: { revalidate: 86400 },
        timeout: 15000,
      },
    );

    // ========== 404 CHECK ==========
    if (!post || !post.slug?.current) {
      notFound();
    }

    // ========== SECTION CHECK (news | world) ==========
    function getPrimarySection(
      post: any,
    ): { slug: string; title?: string } | undefined {
      if (!post?.categories) return undefined;

      for (const cat of post.categories) {
        const title = cat.title?.toLowerCase();
        const slug = cat.slug?.current?.toLowerCase();
        const parentSlug = cat.parent?.slug?.current?.toLowerCase();

        if (title === "news" || slug === "news" || parentSlug === "news") {
          return { slug: "news", title: cat.title };
        }

        if (title === "world" || slug === "world" || parentSlug === "world") {
          return { slug: "world", title: cat.title };
        }

        // Treat business posts as a news sub-section: /news/business/slug
        if (
          title === "business" ||
          slug === "business" ||
          parentSlug === "business"
        ) {
          return { slug: "business", title: cat.title };
        }
      }

      return undefined;
    }

    const primarySection = getPrimarySection(post);

    // Redirect to blog if not a recognized section (news/world/business)
    if (!primarySection) {
      redirect(`/blogs/${decodedSlug}`);
    }

    // Compute section-aware slug and map `business` to `/news/business`
    let sectionSlug = primarySection?.slug || "news";
    if (sectionSlug === "business") sectionSlug = "news/business";

    // ========== CHECK PUBLICATION DATE ==========
    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      notFound();
    }

    // ========== FETCH RELATED DATA ==========
    const [breakingNews, relatedNews] = await Promise.all([
      client.fetch(
        BLOG_BY_CATEGORY_SLUG,
        { slug: sectionSlug },
        { timeout: 10000 },
      ),
      client.fetch(
        RELATED_POSTS_QUERY,
        {
          categoryId: post?.categories?.[0]?._id,
          slug: post?.slug?.current,
        },
        { timeout: 10000 },
      ),
    ]);

    // Add URLs to related posts
    const breakingNewsWithUrls =
      breakingNews?.map((news: any) => ({
        ...news,
        url: getPostUrl(news),
      })) || [];

    const relatedNewsWithUrls =
      relatedNews?.map((news: any) => ({
        ...news,
        url: getPostUrl(news),
      })) || [];

    // ========== PREPARE DATA ==========
    const parsedContent = post.body
      ? md.render(post.body)
      : "<p>No content available</p>";
    const plainTextContent = post.body
      ? removeMarkdown(post.body)
      : "No content available";
    const readTime =
      post.readTime ||
      Math.max(1, Math.ceil(plainTextContent.split(" ").length / 200));

    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .url()
      : `${baseUrl}/og-image.jpg`;

    // Canonical URL for the article
    const canonicalUrl = `https://www.geokhub.com/${sectionSlug}/${decodedSlug}`;

    // ========== JSON-LD ==========
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: post.title || "Breaking News",
      description: post.excerpt || plainTextContent.substring(0, 160),
      author: {
        "@type": "Person",
        name: post.author?.name || "GeokHub News Team",
        ...(post.author?.image && { image: urlFor(post.author.image).url() }),
      },
      datePublished: post.publishedAt || post._createdAt,
      dateModified: post._updatedAt || post.publishedAt || post._createdAt,
      image: imageUrl,
      url: canonicalUrl,
      publisher: {
        "@type": "NewsMediaOrganization",
        name: "GeokHub News",
        url: "https://www.geokhub.com/news",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/icons/geokhub-news.png`,
        },
      },
      articleSection: post.categories?.[0]?.title || "Breaking News",
      ...(post.breakingNews && { dateline: "BREAKING NEWS" }),
      ...(post.location && { locationCreated: post.location }),
    };

    // ========== RENDER ==========
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CodeScript />

        {/* Mobile Floating Action Bar */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <FloatingActionBar
            postId={post._id}
            postUrl={canonicalUrl}
            postTitle={post.title}
            postDescription={post.excerpt}
          />
        </div>

        <div className="min-h-screen bg-gray-50 dark:bg-background">
          <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-5 py-4">
            <div className="flex flex-col lg:flex-row gap-5 min-h-0">
              {/* Left Sidebar - Desktop Engagement Tools */}
              <div className="hidden lg:block lg:w-20 flex-shrink-0 z-50">
                <div className="sticky top-24 h-fit">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-6 p-4 bg-white dark:bg-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <SidebarShareButton
                        postId={post._id}
                        postUrl={canonicalUrl}
                        postTitle={post.title}
                        postDescription={post.excerpt}
                      />
                      <div className="w-8 h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                      <div className="text-center">
                          <View slug={decodedSlug} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 max-w-3xl mx-auto min-w-0">
                {/* Breaking News Banner */}
                {post.breakingNews && (
                  <div className="mb-6 bg-red-600 text-white p-4 rounded-lg animate-pulse">
                    <div className="flex items-center gap-2">
                      <Newspaper size={20} />
                      <span className="font-bold uppercase tracking-wider">
                        BREAKING NEWS
                      </span>
                    </div>
                    <p className="mt-2">{post.title}</p>
                  </div>
                )}

                {/* Article Container */}
                <article className="bg-white dark:bg-card shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden md:px-">
                  {/* Article Header */}
                  <div className="p-2 md:p-3 lg:p-2">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight tracking-tight">
                      {post.title}
                    </h1>

                    {/* Author and Metadata */}
                    <div className="flex sm:flex-row sm:items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        {post.author?.image && (
                          <img
                            src={urlFor(post.author.image).url()}
                            alt={post.author.name}
                            className="rounded-full h-5 w-5"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {post.author?.name || "GeokHub Reporter"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:ml-auto">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <time
                            dateTime={post.publishedAt}
                            className="font-medium"
                          >
                            {formatReadableDate(post.publishedAt)}
                          </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen size={16} />
                          <span className="font-medium">
                            {readTime} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative ">
                    {/* Check if we have gallery images */}
                    {post.galleryImages && post.galleryImages.length > 0 ? (
                      <>
                        <ImageSliderWrapper
                          images={post.galleryImages}
                          className="h-64 md:h-80 lg:h-96"
                        />
                      </>
                    ) : post.images && post.images.length > 0 ? (
                      // Fallback to images[] array if galleryImages doesn't exist but images[] does
                      <>
                        <ImageSliderWrapper
                          images={post.images.map((img: any) => ({
                            asset: img.asset,
                            alt: img.alt || post.title,
                            caption: img.caption,
                          }))}
                          className="h-64 md:h-80 lg:h-96"
                        />
                      </>
                    ) : (
                      // Fallback to single main image
                      <div className="relative h-64 md:h-80 lg:h-96">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          loading="eager"
                          width={1200}
                          height={630}
                          className="object-cover h-full w-full"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-2 md:p-3 lg:p-2">
                    {/* Article Header */}
                    <header className="mb-8">
                      {/* Location and Time */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {post.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span className="font-medium">{post.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Text-to-Speech Player */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 mb-6">
                        <TextToSpeechPlayer content={plainTextContent} />
                      </div>
                    </header>

                    {/* Article Body */}
                    <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none mb-10">
                      <div
                        className="
      prose-headings:font-bold 
      prose-headings:text-gray-900 
      prose-headings:dark:text-white 
      prose-p:text-gray-700 
      prose-p:dark:text-gray-300 
      prose-a:text-blue-600 
      prose-a:dark:text-blue-400 
      prose-strong:text-gray-900 
      prose-strong:dark:text-white
      first-letter:text-5xl 
      first-letter:font-bold 
      first-letter:float-left 
      first-letter:mr-2 
      first-letter:leading-[0.9] 
      first-letter:text-red-600 
      dark:first-letter:text-red-400
    "
                      >
                        <BlogContentWithReadMore
                          parsedContent={parsedContent}
                          plainTextContent={plainTextContent}
                          wordLimit={150}
                        />
                      </div>
                    </div>

                    {/* Sources Section */}
                    {post.sources && post.sources.length > 0 && (
                      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Sources
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {post.sources.map((source, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-600 mt-1">•</span>
                              <span>{source}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Article Footer */}
                    <footer className="border-t border-gray-200 dark:border-gray-700 pt-8">
                      {/* Social Sharing */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Share this news
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Help others stay informed
                          </p>
                        </div>
                        <SocialShare url={canonicalUrl} title={post.title} />
                      </div>

                      {/* Tags */}
                      {post.keywords && post.keywords.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Topics
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {post.keywords.slice(0, 8).map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </footer>
                  </div>
                </article>
              </div>

              {/* Right Sidebar */}
              <aside className="lg:w-80">
                <div className="sticky top-32 space-y-8">
                  {/* Breaking News Sidebar - Like "Recommended for You" in blogs */}
                  <div className="bg-white dark:bg-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 hidden lg:block">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Newspaper size={20} className="text-red-600" />
                      Latest News
                    </h2>
                    <div className="space-y-4">
                      {breakingNewsWithUrls?.length > 0 ? (
                        breakingNewsWithUrls
                          .slice(1, 4)
                          .map((newsItem: any) => {
                            // Ensure we have a valid slug string
                            const slugString =
                              newsItem.slug?.current || newsItem.slug;
                            if (!slugString) return null; // Skip if no slug

                            return (
                              <a
                                key={slugString} // Use the actual slug string
                                href={newsItem.url}
                                className="block group"
                              >
                                <div className="flex gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2">
                                      {newsItem.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {formatReadableDate(newsItem.publishedAt)}
                                    </p>
                                  </div>
                                </div>
                              </a>
                            );
                          })
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No latest news
                        </p>
                      )}
                    </div>
                  </div>

                  {/* KO-FI WIDGET */}
                  {/* <div className="">
                    <iframe
                      id="kofiframe"
                      src="https://ko-fi.com/geokhub/?hidefeed=true&widget=true&embed=true&preview=true"
                      style={{
                        border: "none",
                        width: "100%",
                        padding: "2px",
                        background: "#f9f9f9",
                      }}
                      height="400"
                      title="geokhub"
                    />
                  </div> */}

                  {/* Newsletter Signup */}
                  <div className="bg-red-600 rounded-2xl p-6 text-white">
                    <NewsletterForm
                      variant="inline"
                      title="Breaking News Alerts"
                      description="Get the latest news updates delivered directly to your inbox."
                      theme="dark"
                    />
                  </div>
                </div>
              </aside>
            </div>

            {/* Related News Section - Like "Related Posts" in blogs */}
            {relatedNewsWithUrls && relatedNewsWithUrls.length > 0 && (
              <section className="mt-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {sectionSlug.endsWith("world")
                      ? "More World News"
                      : sectionSlug.endsWith("business")
                        ? "More Business News"
                        : "More News"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {sectionSlug.endsWith("world")
                      ? "Stay updated with international headlines and global affairs"
                      : sectionSlug.endsWith("business")
                        ? "Stay informed on business and market news"
                        : "Stay updated with more breaking news and important updates"}
                  </p>
                </div>
                <MasonryGrid posts={relatedNewsWithUrls.slice(4, 13)} />
                <div className="text-center mt-8">
                  <Link
                    href={`/${sectionSlug}`}
                    className={`${sectionSlug === "world" ? "inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300" : "inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"} font-semibold`}
                  >
                    {sectionSlug.endsWith("world")
                      ? "View all world articles"
                      : sectionSlug.endsWith("business")
                        ? "View all business articles"
                        : "View all news articles"}
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}

// STATIC PARAMS
export async function generateStaticParams() {
  const posts = await client.fetch(`
      *[_type == "post" && 
        defined(slug.current) && 
        defined(categories) && 
        count((categories[]->slug.current)[@ in ["news", "world", "business"]]) > 0
      ]{

      "slug": slug.current
    }
  `);

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}
