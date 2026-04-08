import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { notFound, redirect } from "next/navigation";
import markdownit from "markdown-it";
import removeMarkdown from "remove-markdown";
import { Metadata } from "next";
import { CodeScript } from "@/components/CodeScript";
import Link from "next/link";
import View from "@/components/View";
import TextToSpeechPlayer from "@/components/global/TextToSpeechPlayer";
import SocialShare from "@/components/global/SocialShare";
import MasonryGrid from "@/components/World";
import FloatingActionBar from "@/components/global/FloatingActionBar";
import markdownItLinkAttributes from "markdown-it-link-attributes";
import BlogContentWithReadMore from "@/components/global/BlogContentWithReadMore";
import SidebarShareButton from "@/components/global/SidebarShareButton";
import InlineArticleAd from "@/components/ads/InlineArticleAd";
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Clock,
  MapPin,
  Globe,
  Compass,
  Users,
  TrendingUp,
  Eye,
  Share2,
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

export const revalidate = 2592000;
export const dynamic = 'force-static';

// Helper function to get the correct URL path for a post
function getPostUrlPath(post: any, slug: string): string {
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${slug}`;
  }

  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();

    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${slug}`;
    }

    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${slug}`;
    }

    if (categoryTitle === "business" || categorySlug === "business") {
      return `/news/business/${slug}`;
    }

    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();

      if (parentTitle === "news" || parentSlug === "news") {
        return `/news/${slug}`;
      }

      if (parentTitle === "world" || parentSlug === "world") {
        return `/news/world/${slug}`;
      }

      if (parentTitle === "business" || parentSlug === "business") {
        return `/news/business/${slug}`;
      }
    }
  }

  return `/blogs/${slug}`;
}

// METADATA
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        title,
        author->{name},
        categories[]->{_id, title, slug, parent->{_id, title, slug}},
        mainImage,
        seoTitle,
        metaDescription,
        excerpt,
        body,
        publishedAt,
        location
      }`,
      { slug: decodedSlug },
      { next: { revalidate: 2592000 } },
    );

    if (!post) {
      return {
        title: "World News Article Not Found - GeokHub",
        description: "The requested world news article could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Verify this is a world news post
    const isWorldPost = post.categories?.some((cat: any) => {
      const catTitle = cat.title?.toLowerCase();
      const catSlug = cat.slug?.current?.toLowerCase();
      const parentSlug = cat.parent?.slug?.current?.toLowerCase();
      return (
        catTitle === "world" || catSlug === "world" || parentSlug === "world"
      );
    });

    if (!isWorldPost) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const canonicalUrl = `https://www.geokhub.com/news/world/${decodedSlug}`;
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
        : "Global news coverage on GeokHub");

    return {
      metadataBase: new URL("https://www.geokhub.com"),
      title: post.seoTitle || `${post.title} - GeokHub World News`,
      description: post.metaDescription || description,
      alternates: { 
        canonical: canonicalUrl,
      },
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
      openGraph: {
        title: post.title,
        description,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author?.name || "GeokHub World News Team"],
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
        siteName: "GeokHub World News",
        ...(post.location && { locale: post.location }),
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
    console.error("Error generating world news metadata:", error);
    return {
      robots: {
        index: true,
        follow: true,
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
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function getSlugValue(post: any): string | undefined {
  if (!post) return undefined;
  if (typeof post.slug === "string") return post.slug;
  return post.slug?.current;
}

// Function to get post detail URL based on category
function getPostUrl(post: any): string {
  const slugValue = getSlugValue(post) ?? "";
  if (!slugValue) return "#";
  return getPostUrlPath(post, slugValue);
}

// Function to get continent/region from location
function getContinentFromLocation(location: string): string {
  if (!location) return "Global";

  const continentMap: Record<string, string> = {
    africa: "Africa",
    asia: "Asia",
    europe: "Europe",
    "north america": "North America",
    "south america": "South America",
    australia: "Oceania",
    oceania: "Oceania",
    antarctica: "Antarctica",
    "middle east": "Middle East",
    caribbean: "Caribbean",
    pacific: "Pacific",
  };

  const locLower = location.toLowerCase();
  for (const [key, value] of Object.entries(continentMap)) {
    if (locLower.includes(key)) return value;
  }

  return "Global";
}

// MAIN COMPONENT
export default async function WorldDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const baseUrl = "https://www.geokhub.com";

    // Fetch the world news post
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
          bio,
          role
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
        readTime,
        estimatedReadingTime
      }`,
      { slug: decodedSlug },
      {
        next: { revalidate: 2592000 },
        timeout: 15000,
      },
    );

    // ========== 404 CHECK ==========
    if (!post || !post.slug?.current) {
      notFound();
    }

    // ========== WORLD CATEGORY CHECK ==========
    const isWorldPost = post.categories?.some((cat: any) => {
      const catTitle = cat.title?.toLowerCase();
      const catSlug = cat.slug?.current?.toLowerCase();
      const parentSlug = cat.parent?.slug?.current?.toLowerCase();
      return (
        catTitle === "world" || catSlug === "world" || parentSlug === "world"
      );
    });

    // ========== REJECT NON-WORLD POSTS WITH 404 ==========
    if (!isWorldPost) {
      notFound();
    }

    // ========== CHECK PUBLICATION DATE ==========
    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      notFound();
    }

    // ========== FETCH RELATED DATA ==========
    const [worldNews, relatedWorldNews, trendingWorld] = await Promise.all([
      client.fetch(
        BLOG_BY_CATEGORY_SLUG,
        { slug: "world" },
        { timeout: 10000 },
      ),
      client.fetch(
        RELATED_POSTS_QUERY,
        {
          categoryId: post?.categories?.[0]?._id || "",
          slug: post?.slug?.current,
        },
        { timeout: 10000 },
      ),
      client.fetch(
        `*[_type == "post" && count((categories[]->slug.current)[@ == "world"]) > 0] | order(views desc)[0...5] {
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          mainImage,
          galleryImages[] {
            asset->,
            alt,
            caption
          },
          excerpt,
          views,
          categories[]->{title, slug}
        }`,
        { next: { revalidate: 2592000 } },
      ),
    ]);

    // Add URLs to related posts
    const worldNewsWithUrls =
      worldNews?.map((news: any) => ({
        ...news,
        url: getPostUrl(news),
      })) || [];

    const relatedWorldNewsWithUrls =
      relatedWorldNews?.map((news: any) => ({
        ...news,
        url: getPostUrl(news),
      })) || [];

    const trendingWorldWithUrls =
      trendingWorld?.map((news: any) => ({
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
      post.estimatedReadingTime ||
      Math.max(1, Math.ceil(plainTextContent.split(" ").length / 200));
    const continent = getContinentFromLocation(post.location);

    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .url()
      : `${baseUrl}/og-image.jpg`;

    const canonicalUrl = `https://www.geokhub.com/news/world/${decodedSlug}`;

    // ========== JSON-LD ==========
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: post.title || "World News",
      description: post.excerpt || plainTextContent.substring(0, 160),
      author: {
        "@type": "Person",
        name: post.author?.name || "GeokHub World News Team",
        ...(post.author?.image && { image: urlFor(post.author.image).url() }),
      },
      datePublished: post.publishedAt || post._createdAt,
      dateModified: post._updatedAt || post.publishedAt || post._createdAt,
      image: imageUrl,
      url: canonicalUrl,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      publisher: {
        "@type": "NewsMediaOrganization",
        name: "GeokHub World News",
        url: "https://www.geokhub.com/news/world",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/icons/geokhub-world.png`,
        },
      },
      articleSection: post.categories?.[0]?.title || "World News",
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
        
        {/* Explicit robots meta tag for HTML head */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        
        {/* Canonical link tag */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Mobile Floating Action Bar */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <FloatingActionBar
            postId={post._id}
            postUrl={canonicalUrl}
            postTitle={post.title}
            postDescription={post.excerpt}
          />
        </div>

        <div className="min-h-screen bg-background dark:bg-background-dark">
          {/* Global Navigation Indicator */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    WORLD NEWS • {continent.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs opacity-80">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {formatReadableDate(post.publishedAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Desktop Tools */}
              <div className="hidden lg:block lg:w-20 flex-shrink-0">
                <div className="sticky top-32 space-y-6 z-30">
                  {/* Share Button */}
                  <div className="bg-card dark:card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <SidebarShareButton
                      postId={post._id}
                      postUrl={canonicalUrl}
                      postTitle={post.title}
                      postDescription={post.excerpt}
                    />
                  </div>

                  {/* View Counter */}
                  <div className="bg-card dark:card rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col items-center">
                      <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <View slug={decodedSlug} />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Views
                      </span>
                    </div>
                  </div>

                  {/* Continent Badge */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white text-center">
                    <Compass className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-bold">{continent}</div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 max-w-4xl mx-auto">
                {/* Breaking News Alert */}
                {post.breakingNews && (
                  <div className="mb-8 bg-gradient-to-r from-red-600 to-orange-500 text-white p-4 rounded-2xl shadow-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Globe className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold uppercase tracking-wider text-sm">
                          BREAKING WORLD NEWS
                        </div>
                        <div className="text-sm opacity-90">
                          {post.location || "Global"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Article Header */}
                <header className="mb-2 max-w-7xl mx-auto px-2 md:px-0">
                  {/* Title */}
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {post.title}
                  </h1>

                  {/* Subtitle & Location */}
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
                        <span className="font-medium">{readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Hero Image */}
                <div className="mb-4">
                  {post.galleryImages && post.galleryImages.length > 0 ? (
                    <ImageSliderWrapper
                      images={post.galleryImages}
                      className="h-64 md:h-80 lg:h-[72vh]"
                    />
                  ) : post.images && post.images.length > 0 ? (
                    <ImageSliderWrapper
                      images={post.images.map((img: any) => ({
                        asset: img.asset,
                        alt: img.alt || post.title,
                        caption: img.caption,
                      }))}
                      className="h-64 md:h-80 lg:h-96"
                    />
                  ) : (
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

                {/* Text-to-Speech Player */}
                <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                  <TextToSpeechPlayer content={plainTextContent} />
                </div>

                {/* Article Content */}
                <article className="mb-12 max-w-7xl mx-auto px-4 md:px-0">
                  <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
                    <div
                      className="
                      prose-headings:font-bold 
                      prose-headings:text-gray-900 
                      prose-headings:dark:text-white
                      prose-headings:border-l-4
                      prose-headings:border-blue-600
                      prose-headings:pl-4
                      prose-headings:mt-10
                      prose-headings:mb-6
                      prose-p:text-gray-700 
                      prose-p:dark:text-gray-300
                      prose-p:leading-relaxed
                      prose-p:text-lg
                      prose-a:text-blue-600 
                      prose-a:dark:text-blue-400
                      prose-a:font-medium
                      prose-a:underline
                      prose-strong:text-gray-900 
                      prose-strong:dark:text-white
                      prose-strong:font-bold
                      prose-blockquote:border-l-4
                      prose-blockquote:border-blue-600
                      prose-blockquote:pl-6
                      prose-blockquote:italic
                      prose-blockquote:bg-blue-50
                      prose-blockquote:dark:bg-blue-900/20
                      prose-blockquote:py-4
                      prose-blockquote:rounded-r-lg
                      first-letter:text-7xl
                      first-letter:font-bold
                      first-letter:float-left
                      first-letter:mr-4
                      first-letter:mt-2
                      first-letter:text-blue-600
                      dark:first-letter:text-blue-400
                      first-letter:leading-none
                    "
                    >
                      <BlogContentWithReadMore
                        parsedContent={parsedContent}
                        plainTextContent={plainTextContent}
                        wordLimit={200}
                      />
                    </div>
                  </div>
                </article>

                <InlineArticleAd />

                {/* Sources & Credits */}
                {post.sources && post.sources.length > 0 && (
                  <div className="mb-10 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                      <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Sources & References
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.sources.map((source: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-white dark:bg-gray-700 p-4 rounded-xl"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {source}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags & Topics */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="mb-10 px-4 lg:px-6">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Topics Covered
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {post.keywords.map((tag: string, index: number) => (
                        <Link
                          key={index}
                          href={`/?query=${encodeURIComponent(tag)}`}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50 rounded-full text-sm font-medium transition-all duration-200 border border-blue-100 dark:border-blue-800"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Share & Engagement */}
                <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Share this Global Story
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Help spread awareness about this important world event
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <SocialShare
                        url={canonicalUrl}
                        title={post.title}
                        variant="expanded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <aside className="lg:w-80">
                <div className="sticky top-32 space-y-8">
                  {/* Latest from Region */}
                  <div className="bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white p-5">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6" />
                        <h2 className="text-xl font-bold">
                          Latest from {continent}
                        </h2>
                      </div>
                    </div>
                    <div className="p-4">
                      {worldNewsWithUrls?.length > 0 ? (
                        worldNewsWithUrls.slice(1, 4).map((newsItem: any) => {
                          const slugString =
                            newsItem.slug?.current || newsItem.slug;
                          if (!slugString) return null;

                          return (
                            <Link
                              key={slugString}
                              href={newsItem.url}
                              className="group block mb-4 last:mb-0"
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 line-clamp-2 text-sm mb-1">
                                    {newsItem.title}
                                  </h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatReadableDate(newsItem.publishedAt)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 text-center py-6">
                          No regional news
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Trending Stories */}
                  {/* {trendingWorldWithUrls.length > 0 && (
                    <div className="bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-5">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-6 w-6" />
                          <h2 className="text-xl font-bold">
                            Trending Worldwide
                          </h2>
                        </div>
                      </div>
                      <div className="p-4">
                        {trendingWorldWithUrls.map((newsItem: any, idx: number) => {
                          const slugString = newsItem.slug?.current || newsItem.slug;
                          if (!slugString) return null;

                          return (
                            <Link
                              key={slugString}
                              href={newsItem.url}
                              className="group block mb-4 last:mb-0"
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2 text-sm mb-1">
                                    {newsItem.title}
                                  </h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatReadableDate(newsItem.publishedAt)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )} */}

                  {/* Global Newsletter */}
                  {/* <div className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="h-8 w-8" />
                      <div>
                        <h3 className="text-xl font-bold">Global Dispatch</h3>
                        <p className="text-blue-200 text-sm">
                          Your daily world news briefing
                        </p>
                      </div>
                    </div>
                    <NewsletterForm
                      variant="inline"
                      title=""
                      description="Get global news updates from all continents delivered to your inbox."
                      theme="dark"
                    />
                  </div> */}

                  {/* Support Global Journalism */}
                  {/* <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                    <div className="text-center">
                      <Users className="h-10 w-10 mx-auto mb-3" />
                      <h3 className="text-lg font-bold mb-2">
                        Support Global Journalism
                      </h3>
                      <p className="text-sm opacity-90 mb-4">
                        Independent journalism needs your support to continue
                        covering important global stories
                      </p>
                      <Link
                        href="/support"
                        className="inline-block bg-white text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold text-sm transition-colors"
                      >
                        Support Our Work
                      </Link>
                    </div>
                  </div> */}
                </div>
              </aside>
            </div>

            {/* Related World News Section */}
            {relatedWorldNewsWithUrls &&
              relatedWorldNewsWithUrls.length > 0 && (
                <section className="mt-20 max-w-7xl mx-auto px-4 md:px-0">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        More Global Stories
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm">
                      Discover more impactful stories from around the world
                    </p>
                  </div>
                  <MasonryGrid posts={relatedWorldNewsWithUrls.slice(4, 12)} />
                  <div className="text-center mt-12">
                    <Link
                      href="/news/world"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Explore All World News
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </section>
              )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("World news page error:", error);
    notFound();
  }
}

// STATIC PARAMS - Generate all world news slugs for static generation
export async function generateStaticParams() {
  const posts = await client.fetch(`
    *[_type == "post" && 
      defined(slug.current) && 
      publishedAt <= now() &&
      count((categories[]->slug.current)[@ in ["world"]]) > 0
    ] {
      "slug": slug.current
    }
  `);

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}