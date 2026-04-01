import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  BLOG_BY_CATEGORY_SLUG,
  BLOG_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { getCanonicalPath, getSlugString } from "@/lib/seo";
import { notFound, redirect } from "next/navigation";
import markdownit from "markdown-it";
import View from "@/components/View";
import { Metadata } from "next";
import TextToSpeechPlayer from "@/components/global/TextToSpeechPlayer";
import removeMarkdown from "remove-markdown";
import SocialShare from "@/components/global/SocialShare";
import { RELATED_POSTS_QUERY } from "@/sanity/lib/queries";
import MasonryGrid from "@/components/World";
import FloatingActionBar from "@/components/global/FloatingActionBar";
import PickForYou from "@/components/PickForYou";
import markdownItLinkAttributes from "markdown-it-link-attributes";
import BlogContentWithReadMore from "@/components/global/BlogContentWithReadMore";
import SidebarShareButton from "@/components/global/SidebarShareButton";
import InlineArticleAd from "@/components/ads/InlineArticleAd";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { NewsletterForm } from "@/components/global/Newsletter-form";
import Link from "next/link";
import { CodeScript } from "@/components/CodeScript";
import ImageSliderWrapper from "@/components/ImageSliderWrapper";

// Initialize markdown parser with better configuration
const md = markdownit({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
  highlight: function (str, lang) {
    const escapedStr = md.utils.escapeHtml(str);

    if (lang && lang !== "text") {
      return `<pre class="language-${lang}"><code class="language-${lang}">${escapedStr}</code></pre>`;
    }

    return `<pre><code>${escapedStr}</code></pre>`;
  },
}).use(markdownItLinkAttributes, {
  pattern: /^https?:\/\//,
  attrs: {
    target: "_blank",
    rel: "noopener noreferrer nofollow",
  },
});

// Enhanced video embed plugin
function videoEmbedPlugin(md: markdownit.MarkdownIt) {
  const defaultRender =
    md.renderer.rules.text ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.text = function (tokens, idx, options, env, self) {
    const content = tokens[idx].content;

    // YouTube
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
    const youtubeMatch = content.match(youtubeRegex);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return `
        <div class="video-embed-container my-8 rounded-xl overflow-hidden shadow-lg bg-black">
          <div class="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/${videoId}?rel=0"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
              class="w-full h-full"
            ></iframe>
          </div>
        </div>
      `;
    }

    // Vimeo
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
    const vimeoMatch = content.match(vimeoRegex);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return `
        <div class="video-embed-container my-8 rounded-xl overflow-hidden shadow-lg bg-black">
          <div class="aspect-w-16 aspect-h-9">
            <iframe
              src="https://player.vimeo.com/video/${videoId}"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
              loading="lazy"
              class="w-full h-full"
            ></iframe>
          </div>
        </div>
      `;
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}

md.use(videoEmbedPlugin);

export const revalidate = 2592000; // 30 days
export const dynamic = 'force-static';

// Helper function to get the correct URL path for a post (shared across all pages)
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

    if (
      categoryTitle === "tech-news" ||
      categorySlug === "tech-news" ||
      categoryTitle === "technology" ||
      categorySlug === "technology"
    ) {
      return `/technology/tech-news/${slug}`;
    }

    if (
      categoryTitle === "ai" ||
      categorySlug === "ai" ||
      categoryTitle === "artificial intelligence" ||
      categorySlug === "artificial-intelligence"
    ) {
      return `/technology/ai/${slug}`;
    }

    if (
      categoryTitle === "cybersecurity" ||
      categorySlug === "cybersecurity" ||
      categoryTitle === "security" ||
      categorySlug === "security"
    ) {
      return `/technology/cybersecurity/${slug}`;
    }

    if (categoryTitle === "gadgets" || categorySlug === "gadgets") {
      return `/technology/gadgets/${slug}`;
    }

    if (
      categoryTitle === "lifestyle" ||
      categorySlug === "lifestyle" ||
      categoryTitle === "living" ||
      categorySlug === "living"
    ) {
      return `/lifestyle/${slug}`;
    }

    const titleIsMental =
      (categoryTitle?.includes("mental") && categoryTitle?.includes("health")) ||
      categoryTitle?.includes("mentalhealth");
    const slugIsMental =
      (categorySlug?.includes("mental") && categorySlug?.includes("health")) ||
      categorySlug?.includes("mentalhealth");

    if (titleIsMental || slugIsMental) {
      return `/mentalhealth/${slug}`;
    }

    if (
      categoryTitle === "wellness" ||
      categorySlug === "wellness" ||
      categoryTitle === "health" ||
      categorySlug === "health"
    ) {
      return `/wellness/${slug}`;
    }

    if (
      categoryTitle === "weightloss" ||
      categorySlug === "weightloss" ||
      categoryTitle === "weight-loss" ||
      categorySlug === "weight-loss" ||
      categoryTitle === "diet" ||
      categorySlug === "diet"
    ) {
      return `/weightloss/${slug}`;
    }

    if (
      categoryTitle === "cloud-devops" ||
      categorySlug === "cloud-devops" ||
      categoryTitle === "cloud" ||
      categorySlug === "cloud" ||
      categoryTitle === "devops" ||
      categorySlug === "devops" ||
      categoryTitle === "infrastructure" ||
      categorySlug === "infrastructure"
    ) {
      return `/technology/cloud-devops/${slug}`;
    }

    if (
      categoryTitle === "programming" ||
      categorySlug === "programming" ||
      categoryTitle === "coding" ||
      categorySlug === "coding"
    ) {
      return `/technology/programming/${slug}`;
    }

    if (
      categoryTitle === "emerging-tech" ||
      categorySlug === "emerging-tech" ||
      categoryTitle === "emerging technologies" ||
      categorySlug === "emerging-technologies" ||
      categoryTitle === "future tech" ||
      categorySlug === "future-tech"
    ) {
      return `/technology/emerging-tech/${slug}`;
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

      if (
        parentTitle === "tech-news" ||
        parentSlug === "tech-news" ||
        parentTitle === "technology" ||
        parentSlug === "technology"
      ) {
        return `/technology/tech-news/${slug}`;
      }

      if (
        parentTitle === "ai" ||
        parentSlug === "ai" ||
        parentTitle === "artificial intelligence" ||
        parentSlug === "artificial-intelligence"
      ) {
        return `/technology/ai/${slug}`;
      }

      if (
        parentTitle === "cybersecurity" ||
        parentSlug === "cybersecurity" ||
        parentTitle === "security" ||
        parentSlug === "security"
      ) {
        return `/technology/cybersecurity/${slug}`;
      }

      if (parentTitle === "gadgets" || parentSlug === "gadgets") {
        return `/technology/gadgets/${slug}`;
      }

      if (
        parentTitle === "lifestyle" ||
        parentSlug === "lifestyle" ||
        parentTitle === "living" ||
        parentSlug === "living"
      ) {
        return `/lifestyle/${slug}`;
      }

      const parentTitleIsMental =
        (parentTitle?.includes("mental") && parentTitle?.includes("health")) ||
        parentTitle?.includes("mentalhealth");
      const parentSlugIsMental =
        (parentSlug?.includes("mental") && parentSlug?.includes("health")) ||
        parentSlug?.includes("mentalhealth");

      if (parentTitleIsMental || parentSlugIsMental) {
        return `/mentalhealth/${slug}`;
      }

      if (
        parentTitle === "wellness" ||
        parentSlug === "wellness" ||
        parentTitle === "health" ||
        parentSlug === "health"
      ) {
        return `/wellness/${slug}`;
      }

      if (
        parentTitle === "weightloss" ||
        parentSlug === "weightloss" ||
        parentTitle === "weight-loss" ||
        parentSlug === "weight-loss" ||
        parentTitle === "diet" ||
        parentSlug === "diet"
      ) {
        return `/weightloss/${slug}`;
      }

      if (
        parentTitle === "cloud-devops" ||
        parentSlug === "cloud-devops" ||
        parentTitle === "cloud" ||
        parentSlug === "cloud" ||
        parentTitle === "devops" ||
        parentSlug === "devops" ||
        parentTitle === "infrastructure" ||
        parentSlug === "infrastructure"
      ) {
        return `/technology/cloud-devops/${slug}`;
      }

      if (
        parentTitle === "programming" ||
        parentSlug === "programming" ||
        parentTitle === "coding" ||
        parentSlug === "coding"
      ) {
        return `/technology/programming/${slug}`;
      }

      if (
        parentTitle === "emerging-tech" ||
        parentSlug === "emerging-tech" ||
        parentTitle === "emerging technologies" ||
        parentSlug === "emerging-technologies" ||
        parentTitle === "future tech" ||
        parentSlug === "future-tech"
      ) {
        return `/technology/emerging-tech/${slug}`;
      }
    }
  }

  return `/blogs/${slug}`;
}

// Function to get post detail URL based on category
function getPostUrl(post: any): string {
  const slugValue = getSlugString(post?.slug) ?? "";
  if (!slugValue) return "#";
  return getPostUrlPath(post, slugValue);
}

// RESTORED FULL SEO METADATA GENERATION
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const post = await client.fetch(
      BLOG_BY_SLUG_QUERY,
      { slug: decodedSlug },
      {
        next: { revalidate: 2592000 },
        timeout: 15000,
      },
    );

    if (!post) {
      return {
        title: "Post Not Found - GeokHub",
        description: "The requested blog post could not be found on GeokHub.",
        robots: {
          index: false,
          follow: false,
        },
        alternates: {
          canonical: `https://www.geokhub.com/blogs/${decodedSlug}`,
        },
      };
    }

    // Compute canonical using shared logic
    const baseUrl = "https://www.geokhub.com";
    const canonicalUrl = `${baseUrl}${getPostUrlPath(post, decodedSlug)}`;
    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .auto("format")
          .url()
      : `${baseUrl}/og-image.jpg`;

    const description =
      post.excerpt ||
      (post.body
        ? removeMarkdown(post.body).substring(0, 160)
        : "Read this blog post on GeokHub");

    return {
      metadataBase: new URL("https://www.geokhub.com"),
      title: post.seoTitle || `${post.title} - GeokHub`,
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
      keywords: post.keywords?.join(", ") || "blog, article, news",
      authors: [{ name: post.author?.name || "GeokHub Team" }],
      openGraph: {
        title: post.title,
        description,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author?.name || "GeokHub Team"],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        siteName: "GeokHub",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [imageUrl],
        creator: "@geokhub",
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
    };
  } catch (error) {
    console.error("Error generating blog metadata:", error);
    return {
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

// Improved time formatting function
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
  });
}

// SIMPLIFIED VERSION WITH PROPER 404 HANDLING + FULL SEO RESTORED
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const baseUrl = "https://www.geokhub.com";

    // SINGLE QUERY: Check if post exists AND get its data
    const post = await client.fetch(
      BLOG_BY_SLUG_QUERY,
      { slug: decodedSlug },
      {
        next: { revalidate: 2592000 },
        timeout: 15000,
      },
    );

    // ========== 404 HANDLING ==========
    // When a post cannot be found we should return a 404 instead of redirecting.
    // Redirects for missing pages create "Page with redirect" issues in Search Console
    // and can confuse crawlers. Returning a 404 is the correct behavior.
    if (!post || !post.slug?.current) {
      notFound();
    }

    // Check if post is published
    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      notFound();
    }

    // Fetch related data (only if post exists)
    const [trending, relatedPosts] = await Promise.all([
      client.fetch(
        BLOG_BY_CATEGORY_SLUG,
        { slug: "gadgets" },
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

    const parsedContent = post.body
      ? md.render(post.body)
      : "<p>No content available</p>";
    const plainTextContent = post.body
      ? removeMarkdown(post.body)
      : "No content available";
    const readTime = Math.max(
      1,
      Math.ceil(plainTextContent.split(" ").length / 200),
    );

    // Proper image URL for SEO and display
    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .auto("format")
          .url()
      : `${baseUrl}/og-image.jpg`;

    const canonicalUrl = `${baseUrl}${getPostUrlPath(post, decodedSlug)}`;

    // Enhanced JSON-LD with validation
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title || "Untitled Article",
      description: post.excerpt || plainTextContent.substring(0, 160),
      author: {
        "@type": "Person",
        name: post.author?.name || "GeokHub Team",
        ...(post.author?.image && {
          image: urlFor(post.author.image).url(),
        }),
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
        name: "GeokHub",
        url: "https://www.geokhub.com",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/icons/geokhub.png`,
        },
      },
      ...(post.keywords &&
        post.keywords.length > 0 && {
          keywords: post.keywords.slice(0, 10).join(", "),
        }),
      articleSection: post.categories?.[0]?.title || "General",
      wordCount: plainTextContent.split(/\s+/).filter(Boolean).length,
      inLanguage: "en-US",
      isAccessibleForFree: true,
    };

    return (
      <>
        {/* JSON-LD structured data */}
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

        <div className="min-h-screen bg-gray-50 dark:bg-background">
          <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-5 py-4">
            <div className="flex flex-col lg:flex-row gap-5 min-h-0">
              {/* Left Sidebar - Desktop Engagement Tools */}
              <div className="hidden lg:block lg:w-20 flex-shrink-0">
                <div className="sticky top-24 h-fit z-30">
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
                {/* Article Container */}
                <article className="bg-white dark:bg-card rounded shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {/* Article Header */}
                  <div className="p-2 md:p-3 lg:p-2">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                      {post.title}
                    </h1>

                    {/* Author and Metadata */}
                    <div className="flex sm:flex-row sm:items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2 flex-wrap">
                      <div className="flex items-center gap-3">
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

                  {/* Hero Image with Gradient Overlay */}
                  <div className="relative">
                    {post.galleryImages && post.galleryImages.length > 0 ? (
                      <ImageSliderWrapper
                        images={post.galleryImages}
                        className="h-64 md:h-80 lg:h-96"
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

                  {/* Article Content */}
                  <div className="p-2 md:p-3 lg:p-2">
                    {/* Text-to-Speech Player */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 mb-6">
                      <TextToSpeechPlayer content={plainTextContent} />
                    </div>

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
                          first-letter:text-blue-600 
                          dark:first-letter:text-blue-400
                        "
                      >
                        <BlogContentWithReadMore
                          parsedContent={parsedContent}
                          plainTextContent={plainTextContent}
                          wordLimit={150}
                        />
                      </div>
                    </div>

                    <InlineArticleAd />

                    {/* Article Footer */}
                    <footer className="border-t border-gray-200 dark:border-gray-700 pt-8">
                      {/* Social Sharing */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Share this article
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Help others discover this content
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
                            {post.keywords.slice(0, 8).map((tag: string, index: number) => (
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
                  {/* Recommended Articles */}
                  <div className="bg-white dark:bg-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 hidden lg:block">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <ArrowRight size={20} className="text-blue-600" />
                      Recommended for You
                    </h2>
                    <div className="space-y-4">
                      {trending?.length > 0 ? (
                        trending
                          .slice(0, 1)
                          .map((trendingPost: any) => (
                            <PickForYou
                              key={trendingPost.slug.current}
                              post={trendingPost}
                            />
                          ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No recommendations available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <NewsletterForm
                      variant="inline"
                      title="Weekly Updates"
                      description="Get the latest news and insights delivered to your inbox."
                      theme="dark"
                    />
                  </div>
                </div>
              </aside>
            </div>

            {/* Related Posts Section */}
            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Related Articles
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Discover more articles on similar topics that you might find
                    interesting
                  </p>
                </div>
                <MasonryGrid posts={relatedPosts.slice(0, 9)} />
                <div className="text-center mt-8">
                  <Link
                    href="/"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                  >
                    View all articles
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
    console.error("Blog page error:", error);
    // If there's an error, return 404 instead of redirect
    // Redirects create "Page with redirect" issues in Search Console
    notFound();
  }
}

// Generate static params for all published blog posts
export async function generateStaticParams() {
  try {
    const posts = await client.fetch(
      `*[_type == "post" && defined(slug.current) && publishedAt <= now()] {
        "slug": slug.current
      }`,
      {},
      { next: { revalidate: 86400 } }
    );

    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for blogs:", error);
    return [];
  }
}