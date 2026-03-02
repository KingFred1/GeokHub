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
  Heart,
  Eye,
  Share2,
  TrendingUp,
  Scale,
  Apple,
  Dumbbell,
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
// Allow static generation for SEO (Google crawling)
// export const revalidate = 86400; // 24 hours
export const revalidate = 2592000; // 30 days

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
        galleryImages[] {
      asset->
    },
        seoTitle,
        metaDescription,
        excerpt,
        body,
        publishedAt
      }`,
      { slug },
      { next: { revalidate: 2592000 } },
    );

    if (!post) {
      return {
        title: "Weight Loss Article Not Found - GeokHub",
        description: "The requested weight loss article could not be found.",
        robots: "noindex, nofollow",
      };
    }

    const canonicalUrl = `https://www.geokhub.com/weightloss/${slug}`;
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
        : "Weight loss tips, nutrition plans, and fitness guidance on GeokHub");

    return {
      metadataBase: new URL("https://www.geokhub.com"),
      title: post.seoTitle || `${post.title} - GeokHub Weight Loss`,
      description: post.metaDescription || description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: post.title,
        description,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author?.name || "GeokHub Weight Loss Team"],
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
        siteName: "GeokHub Weight Loss",
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

  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${slugValue}`;
  }

  // Check each category for "weightloss"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();

    if (
      categoryTitle === "weightloss" ||
      categorySlug === "weightloss" ||
      categoryTitle === "weight-loss" ||
      categorySlug === "weight-loss" ||
      categoryTitle === "diet" ||
      categorySlug === "diet"
    ) {
      return `/weightloss/${slugValue}`;
    }

    // Also check parent category if exists
    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();

      if (
        parentTitle === "weightloss" ||
        parentSlug === "weightloss" ||
        parentTitle === "weight-loss" ||
        parentSlug === "weight-loss" ||
        parentTitle === "diet" ||
        parentSlug === "diet"
      ) {
        return `/weightloss/${slugValue}`;
      }
    }
  }

  return `/blogs/${slugValue}`;
}

// Function to get weight loss category
function getWeightLossCategory(weightLossType: string): string {
  if (!weightLossType) return "Weight Loss";

  const weightLossMap: Record<string, string> = {
    nutrition: "Nutrition",
    diet: "Diet",
    fitness: "Fitness",
    exercise: "Exercise",
    meal: "Meal Planning",
    calorie: "Calories",
    keto: "Keto",
    intermittent: "Fasting",
    cardio: "Cardio",
    strength: "Strength Training",
  };

  const weightLossLower = weightLossType.toLowerCase();
  for (const [key, value] of Object.entries(weightLossMap)) {
    if (weightLossLower.includes(key)) return value;
  }

  return "Weight Loss";
}

// MAIN COMPONENT
export default async function WeightLossDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const baseUrl = "https://www.geokhub.com";

    // Fetch the weight loss post
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
          role,
          expertise
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
      asset->{
        ...,
        metadata
      },
      alt,
      caption
    },
    images[]{
      asset->{
        ...,
        metadata
      },
      alt,
      caption
    },
        body,
        seoTitle,
        metaDescription,
        keywords,
        excerpt,
        weightLossType,
        difficulty,
        timeRequired,
        sources,
        featured,
        readTime,
        estimatedReadingTime,
        mood
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

    // ========== WEIGHT LOSS CATEGORY CHECK ==========
    const isWeightLossPost = post.categories?.some((cat) => {
      const catTitle = cat.title?.toLowerCase();
      const catSlug = cat.slug?.current?.toLowerCase();
      const parentSlug = cat.parent?.slug?.current?.toLowerCase();
      return (
        catTitle === "weightloss" ||
        catSlug === "weightloss" ||
        catTitle === "weight-loss" ||
        catSlug === "weight-loss" ||
        catTitle === "diet" ||
        catSlug === "diet" ||
        parentSlug === "weightloss" ||
        parentSlug === "weight-loss" ||
        parentSlug === "diet"
      );
    });

    // ========== REJECT NON-WEIGHT LOSS POSTS WITH 404 ==========
    // Don't redirect - this creates "Page with redirect" issues in Search Console
    // Instead, return 404 for posts not in the Weight Loss category
    if (!isWeightLossPost) {
      notFound();
    }

    // ========== CHECK PUBLICATION DATE ==========
    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      notFound();
    }

    // ========== FETCH RELATED DATA ==========
    const [weightLossPosts, relatedWeightLossPosts, trendingWeightLoss] =
      await Promise.all([
        client.fetch(
          BLOG_BY_CATEGORY_SLUG,
          { slug: "weightloss" },
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
        client.fetch(
          `*[_type == "post" && count((categories[]->slug.current)[@ in ["weightloss", "weight-loss", "diet"]]) > 0] | order(views desc)[0...5] {
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          mainImage,
          excerpt,
          views,
          categories[]->{title, slug},
          weightLossType,
          mood
        }`,
        ),
      ]);

    // Add URLs to related posts
    const weightLossPostsWithUrls =
      weightLossPosts?.map((post: any) => ({
        ...post,
        url: getPostUrl(post),
      })) || [];

    const relatedWeightLossPostsWithUrls =
      relatedWeightLossPosts?.map((post: any) => ({
        ...post,
        url: getPostUrl(post),
      })) || [];

    const trendingWeightLossWithUrls =
      trendingWeightLoss?.map((post: any) => ({
        ...post,
        url: getPostUrl(post),
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
    const weightLossCategory = getWeightLossCategory(post.weightLossType);

    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .url()
      : `${baseUrl}/og-image.jpg`;

    const canonicalUrl = `https://www.geokhub.com/weightloss/${decodedSlug}`;

    // ========== JSON-LD ==========
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title || "Weight Loss",
      description: post.excerpt || plainTextContent.substring(0, 160),
      author: {
        "@type": "Person",
        name: post.author?.name || "GeokHub Weight Loss Team",
        ...(post.author?.image && { image: urlFor(post.author.image).url() }),
        ...(post.author?.expertise && { jobTitle: post.author.expertise }),
      },
      datePublished: post.publishedAt || post._createdAt,
      dateModified: post._updatedAt || post.publishedAt || post._createdAt,
      image: imageUrl,
      url: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "GeokHub Weight Loss",
        url: "https://www.geokhub.com/weightloss",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/icons/geokhub-weightloss.png`,
        },
      },
      articleSection: post.categories?.[0]?.title || "Weight Loss",
      ...(post.weightLossType && { articleSection: post.weightLossType }),
      ...(post.mood && { keywords: post.mood }),
      ...(post.timeRequired && { timeRequired: post.timeRequired }),
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

        <div className="min-h-screen bg-background dark:bg-background-dark">
          {/* Weight Loss Navigation Indicator - CHANGED COLOR */}
          <div className="bg-gradient-to-r from-orange-600 via-red-500 to-amber-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    WEIGHT LOSS • {weightLossCategory.toUpperCase()}
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
                      <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-2" />
                      <View slug={decodedSlug} />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Views
                      </span>
                    </div>
                  </div>

                  {/* Weight Loss Category Badge - CHANGED ICONS */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 text-white text-center">
                    {weightLossCategory.includes("Nutrition") ||
                    weightLossCategory.includes("Diet") ? (
                      <Apple className="h-6 w-6 mx-auto mb-2" />
                    ) : weightLossCategory.includes("Fitness") ||
                      weightLossCategory.includes("Exercise") ? (
                      <Dumbbell className="h-6 w-6 mx-auto mb-2" />
                    ) : (
                      <Scale className="h-6 w-6 mx-auto mb-2" />
                    )}
                    <div className="text-sm font-bold">
                      {weightLossCategory.split(" ")[0]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 max-w-4xl mx-auto">
                {/* Motivation Highlight - CHANGED COLOR */}
                {post.mood && (
                  <div className="mb-8 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-800 dark:text-orange-300 p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/50 dark:bg-orange-900/50 p-2 rounded-lg">
                        <Heart className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold uppercase tracking-wider text-sm">
                          MOTIVATION
                        </div>
                        <div className="text-sm opacity-90">{post.mood}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weight Loss Info - CHANGED COLOR */}
                {(post.weightLossType || post.timeRequired) && (
                  <div className="mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      {post.weightLossType && (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-xl">
                          {post.weightLossType.toLowerCase().includes("diet") ||
                          post.weightLossType
                            .toLowerCase()
                            .includes("nutrition") ? (
                            <Apple className="h-4 w-4" />
                          ) : post.weightLossType
                              .toLowerCase()
                              .includes("fitness") ||
                            post.weightLossType
                              .toLowerCase()
                              .includes("exercise") ? (
                            <Dumbbell className="h-4 w-4" />
                          ) : (
                            <Scale className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {weightLossCategory}
                          </span>
                        </div>
                      )}
                      {post.difficulty && (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-xl">
                          <Heart className="h-4 w-4" />
                          <span className="font-medium">
                            Difficulty: {post.difficulty}
                          </span>
                        </div>
                      )}
                      {post.timeRequired && (
                        <div className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Time: {post.timeRequired}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Article Header */}
                <header className="mb-2 max-w-7xl mx-auto px-4 md:px-0">
                  {/* Title */}
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {post.title}
                  </h1>

                  {/* Subtitle & Metadata */}
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

                {/* Hero Image Slider */}
                <div className="mb-5">
                  {/* Check if we have gallery images */}
                  {post.galleryImages &&
                  Array.isArray(post.galleryImages) &&
                  post.galleryImages.length > 0 ? (
                    <>
                      <ImageSliderWrapper
                        images={post.galleryImages}
                        className="md:rounded-xl shadow-2xl"
                      />
                      {/* Business News Badge */}
                      <div className="absolute top-6 left-6 z-20">
                        <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                          WEIGHTLOSS
                        </span>
                      </div>
                    </>
                  ) : post.images &&
                    Array.isArray(post.images) &&
                    post.images.length > 0 ? (
                    // Fallback to images[] array if galleryImages doesn't exist but images[] does
                    <>
                      <ImageSliderWrapper
                        images={post.images.map((img: any) => ({
                          asset: img.asset,
                          alt: img.alt || post.title,
                          caption: img.caption,
                        }))}
                        className="md:rounded-xl shadow-2xl"
                      />
                      <div className="absolute top-6 left-6 z-20">
                        <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                          WEIGHTLOSS
                        </span>
                      </div>
                    </>
                  ) : (
                    // Fallback to single main image
                    <div className="md:rounded-xl overflow-hidden shadow-2xl">
                      <div className="relative h-[300px] md:h-[300px] lg:h-[400px]">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-6 left-6">
                          <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                            WEIGHTLOSS
                          </span>
                        </div>
                      </div>
                      {post.mainImage?.caption && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 text-sm text-gray-600 dark:text-gray-400 italic border-t">
                          {post.mainImage.caption}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Text-to-Speech Player - CHANGED COLOR */}
                <div className="mb-10 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800">
                  <TextToSpeechPlayer content={plainTextContent} />
                </div>

                {/* Weight Loss Insight - CHANGED COLOR */}
                {post.excerpt && (
                  <div className="mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Scale className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Key Insight
                      </h3>
                    </div>
                    <div className="prose prose-amber dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                )}

                {/* Article Content - CHANGED COLOR */}
                <article className="mb-12 max-w-7xl mx-auto px-4 lg:px-0">
                  <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
                    <div
                      className="
                      prose-headings:font-bold 
                      prose-headings:text-gray-900 
                      prose-headings:dark:text-white
                      prose-headings:border-l-4
                      prose-headings:border-orange-500
                      prose-headings:pl-4
                      prose-headings:mt-10
                      prose-headings:mb-6
                      prose-p:text-gray-700 
                      prose-p:dark:text-gray-300
                      prose-p:leading-relaxed
                      prose-p:text-lg
                      prose-a:text-orange-600 
                      prose-a:dark:text-orange-400
                      prose-a:font-medium
                      prose-a:underline
                      prose-a:decoration-orange-300
                      prose-a:hover:text-orange-700
                      prose-a:dark:hover:text-orange-300
                      prose-strong:text-gray-900 
                      prose-strong:dark:text-white
                      prose-strong:font-bold
                      prose-blockquote:border-l-4
                      prose-blockquote:border-orange-400
                      prose-blockquote:pl-6
                      prose-blockquote:italic
                      prose-blockquote:bg-orange-50
                      prose-blockquote:dark:bg-orange-900/20
                      prose-blockquote:py-4
                      prose-blockquote:rounded-r-lg
                      prose-blockquote:text-gray-700
                      prose-blockquote:dark:text-gray-300
                      first-letter:text-7xl
                      first-letter:font-bold
                      first-letter:float-left
                      first-letter:mr-4
                      first-letter:mt-2
                      first-letter:text-orange-600
                      dark:first-letter:text-orange-400
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

                {/* Tips & Resources - CHANGED COLOR */}
                {post.sources && post.sources.length > 0 && (
                  <div className="mb-10 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                      <Dumbbell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Tips & Resources
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.sources.map((source: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-white dark:bg-gray-700 p-4 rounded-xl"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {source}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weight Loss Tags - CHANGED COLOR */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="mb-10 px-4 lg:px-6">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Topics & Ideas
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {post.keywords.map((tag: string, index: number) => (
                        <Link
                          key={index}
                          href={`/?query=${encodeURIComponent(tag)}`}
                          className="px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-300 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-800/50 dark:hover:to-amber-800/50 rounded-full text-sm font-medium transition-all duration-200 border border-orange-100 dark:border-orange-800"
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
                        Share this Weight Loss Guide
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Help others achieve their weight loss goals
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
                  {/* Trending Weight Loss - CHANGED COLOR */}
                  <div className="bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-5">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6" />
                        <h2 className="text-xl font-bold">
                          Popular Weight Loss
                        </h2>
                      </div>
                    </div>
                    <div className="p-2">
                      {trendingWeightLossWithUrls?.length > 0 ? (
                        trendingWeightLossWithUrls
                          .slice(1, 4)
                          .map((postItem: any, index: number) => {
                            const slugString =
                              postItem.slug?.current || postItem.slug;
                            if (!slugString) return null;

                            return (
                              <Link
                                key={slugString}
                                href={postItem.url}
                                className="group block mb-2 last:mb-0"
                              >
                                <div className="flex gap-3 p-2 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg font-bold text-sm">
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2 text-sm">
                                      {postItem.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-1">
                                      <div className="flex items-center gap-2">
                                        <Eye className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {postItem.views?.toLocaleString() ||
                                            0}{" "}
                                          views
                                        </span>
                                      </div>
                                      {postItem.mood && (
                                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                          {postItem.mood}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })
                      ) : (
                        <p className="text-gray-500 text-center py-6">
                          No trending weight loss posts
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Weight Loss Newsletter - CHANGED COLOR */}
                  <div className="bg-gradient-to-br from-orange-800 via-red-700 to-amber-700 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Scale className="h-8 w-8" />
                      <div>
                        <h3 className="text-xl font-bold">
                          Weight Loss Journey
                        </h3>
                        <p className="text-orange-200 text-sm">
                          Weekly weight loss tips
                        </p>
                      </div>
                    </div>
                    <NewsletterForm
                      variant="inline"
                      title=""
                      description="Get weight loss tips, nutrition plans, workout guides, and motivation delivered weekly."
                      theme="dark"
                    />
                  </div>
                </div>
              </aside>
            </div>

            {/* Related Weight Loss Section - CHANGED COLOR */}
            {relatedWeightLossPostsWithUrls &&
              relatedWeightLossPostsWithUrls.length > 0 && (
                <section className="mt-20 max-w-7xl mx-auto px-4 md:px-0">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                        <Scale className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        More Weight Loss Guides
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm">
                      Discover more ways to achieve your weight loss goals
                    </p>
                  </div>
                  <MasonryGrid
                    posts={relatedWeightLossPostsWithUrls.slice(4, 12)}
                  />
                  <div className="text-center mt-12">
                    <Link
                      href="/lifestyles/weightloss"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Explore All Weight Loss
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
    console.error("Weight Loss page error:", error);
    notFound();
  }
}

// STATIC PARAMS
export async function generateStaticParams() {
  const posts = await client.fetch(`
    *[_type == "post" && 
      defined(categories) && 
      count((categories[]->slug.current)[@ in ["weightloss", "weight-loss", "diet"]]) > 0
    ] {
      "slug": slug.current
    }
  `);

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}
