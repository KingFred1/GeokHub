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
  TrendingUp,
  Activity,
  Brain,
  Leaf,
  Shield,
  Moon,
  Droplets,
  Wind,
  Stethoscope,
  Apple,
  Dumbbell,
  BrainCircuit,
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

// Allow static generation for SEO (Google crawling)
export const revalidate = 86400; // 24 hours

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
      { next: { revalidate: 86400 } },
    );

    if (!post) {
      return {
        title: "Wellness Article Not Found - GeokHub",
        description: "The requested wellness article could not be found.",
        robots: "noindex, nofollow",
      };
    }

    const canonicalUrl = `https://www.geokhub.com/wellness/${slug}`;
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
        : "Wellness tips, health advice, and holistic living on GeokHub");

    return {
      metadataBase: new URL("https://www.geokhub.com"),
      title: post.seoTitle || `${post.title} - GeokHub Wellness`,
      description: post.metaDescription || description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: post.title,
        description,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author?.name || "GeokHub Wellness Team"],
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
        siteName: "GeokHub Wellness",
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

  // Check each category for "wellness"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();

    if (
      categoryTitle === "wellness" ||
      categorySlug === "wellness" ||
      categoryTitle === "health" ||
      categorySlug === "health"
    ) {
      return `/wellness/${slugValue}`;
    }

    // Also check parent category if exists
    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();

      if (
        parentTitle === "wellness" ||
        parentSlug === "wellness" ||
        parentTitle === "health" ||
        parentSlug === "health"
      ) {
        return `/wellness/${slugValue}`;
      }
    }
  }

  return `/blogs/${slugValue}`;
}

// Function to get wellness category
function getWellnessCategory(wellnessType: string): string {
  if (!wellnessType) return "Holistic Wellness";

  const wellnessMap: Record<string, string> = {
    mental: "Mental Health",
    mind: "Mind & Brain",
    brain: "Brain Health",
    meditation: "Meditation",
    mindfulness: "Mindfulness",
    sleep: "Sleep & Rest",
    nutrition: "Nutrition",
    diet: "Healthy Eating",
    food: "Nutrition",
    fitness: "Fitness",
    exercise: "Exercise",
    yoga: "Yoga",
    workout: "Workout",
    holistic: "Holistic Health",
    preventive: "Preventive Care",
    alternative: "Alternative Medicine",
    herbal: "Herbal Remedies",
    supplements: "Supplements",
    stress: "Stress Management",
    anxiety: "Anxiety Relief",
    selfcare: "Self-Care",
    skincare: "Skincare",
    beauty: "Wellness Beauty",
    detox: "Detox & Cleanse",
    immune: "Immune Health",
    gut: "Gut Health",
    digestive: "Digestive Health",
    hormonal: "Hormonal Balance",
    women: "Women's Health",
    men: "Men's Health",
    aging: "Healthy Aging",
  };

  const wellnessLower = wellnessType.toLowerCase();
  for (const [key, value] of Object.entries(wellnessMap)) {
    if (wellnessLower.includes(key)) return value;
  }

  return "Holistic Wellness";
}

// Function to get wellness icon based on category
function getWellnessIcon(category: string) {
  const catLower = category.toLowerCase();

  if (
    catLower.includes("mental") ||
    catLower.includes("mind") ||
    catLower.includes("brain")
  ) {
    return <Brain className="h-6 w-6" />;
  } else if (
    catLower.includes("nutrition") ||
    catLower.includes("diet") ||
    catLower.includes("food")
  ) {
    return <Apple className="h-6 w-6" />;
  } else if (
    catLower.includes("fitness") ||
    catLower.includes("exercise") ||
    catLower.includes("workout")
  ) {
    return <Dumbbell className="h-6 w-6" />;
  } else if (catLower.includes("yoga") || catLower.includes("meditation")) {
    return <Leaf className="h-6 w-6" />;
  } else if (catLower.includes("sleep")) {
    return <Moon className="h-6 w-6" />;
  } else if (catLower.includes("immune") || catLower.includes("health")) {
    return <Shield className="h-6 w-6" />;
  } else if (catLower.includes("stress")) {
    return <Wind className="h-6 w-6" />;
  } else if (catLower.includes("selfcare") || catLower.includes("beauty")) {
    return <Heart className="h-6 w-6" />;
  } else if (catLower.includes("holistic")) {
    return <Leaf className="h-6 w-6" />;
  } else if (catLower.includes("detox")) {
    return <Droplets className="h-6 w-6" />;
  }

  return <Activity className="h-6 w-6" />;
}

// Wellness color palette
const wellnessColors = {
  primary: "emerald",
  secondary: "teal",
  accent: "green",
  light: "emerald",
  dark: "green",
  gradient: "from-emerald-600 to-teal-600",
  gradientLight: "from-emerald-50 to-teal-50",
  gradientDark: "from-emerald-800/50 to-teal-800/50",
  border: "emerald-100",
  borderDark: "emerald-800",
  text: "emerald-600",
  textDark: "emerald-400",
};

// MAIN COMPONENT
export default async function WellnessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const baseUrl = "https://www.geokhub.com";

    // Fetch the wellness post
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
        wellnessType,
        difficulty,
        timeRequired,
        sources,
        featured,
        readTime,
        estimatedReadingTime,
        mood,
        benefits,
        contraindications,
        equipment
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

    // ========== WELLNESS CATEGORY CHECK ==========
    const isWellnessPost = post.categories?.some((cat) => {
      const catTitle = cat.title?.toLowerCase();
      const catSlug = cat.slug?.current?.toLowerCase();
      const parentSlug = cat.parent?.slug?.current?.toLowerCase();
      return (
        catTitle === "wellness" ||
        catSlug === "wellness" ||
        catTitle === "health" ||
        catSlug === "health" ||
        parentSlug === "wellness" ||
        parentSlug === "health"
      );
    });

    // ========== REJECT NON-WELLNESS POSTS WITH 404 ==========
    // Don't redirect - this creates "Page with redirect" issues in Search Console
    // Instead, return 404 for posts not in the Wellness category
    if (!isWellnessPost) {
      notFound();
    }

    // ========== CHECK PUBLICATION DATE ==========
    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      notFound();
    }

    // ========== FETCH RELATED DATA ==========
    const [wellnessPosts, relatedWellnessPosts, trendingWellness] =
      await Promise.all([
        client.fetch(
          BLOG_BY_CATEGORY_SLUG,
          { slug: "wellness" },
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
          `*[_type == "post" && count((categories[]->slug.current)[@ in ["wellness", "health"]]) > 0] | order(views desc)[0...5] {
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          mainImage,
          excerpt,
          views,
          categories[]->{title, slug},
          wellnessType,
          mood
        }`,
        ),
      ]);

    // Add URLs to related posts
    const wellnessPostsWithUrls =
      wellnessPosts?.map((post: any) => ({
        ...post,
        url: getPostUrl(post),
      })) || [];

    const relatedWellnessPostsWithUrls =
      relatedWellnessPosts?.map((post: any) => ({
        ...post,
        url: getPostUrl(post),
      })) || [];

    const trendingWellnessWithUrls =
      trendingWellness?.map((post: any) => ({
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
    const wellnessCategory = getWellnessCategory(post.wellnessType);

    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .url()
      : `${baseUrl}/og-image.jpg`;

    const canonicalUrl = `https://www.geokhub.com/wellness/${decodedSlug}`;

    // ========== JSON-LD ==========
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title || "Wellness",
      description: post.excerpt || plainTextContent.substring(0, 160),
      author: {
        "@type": "Person",
        name: post.author?.name || "GeokHub Wellness Team",
        ...(post.author?.image && { image: urlFor(post.author.image).url() }),
        ...(post.author?.expertise && { jobTitle: post.author.expertise }),
      },
      datePublished: post.publishedAt || post._createdAt,
      dateModified: post._updatedAt || post.publishedAt || post._createdAt,
      image: imageUrl,
      url: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "GeokHub Wellness",
        url: "https://www.geokhub.com/wellness",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/icons/geokhub-wellness.png`,
        },
      },
      articleSection: post.categories?.[0]?.title || "Wellness",
      ...(post.wellnessType && { articleSection: post.wellnessType }),
      ...(post.mood && { keywords: post.mood }),
      ...(post.timeRequired && { timeRequired: post.timeRequired }),
      ...(post.benefits && { about: post.benefits }),
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
          {/* Wellness Navigation Indicator */}
          <div
            className={`bg-gradient-to-r ${wellnessColors.gradient} text-white`}
          >
            <div className="max-w-7xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    WELLNESS • {wellnessCategory.toUpperCase()}
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
                      <Eye
                        className={`h-6 w-6 text-${wellnessColors.text} dark:text-${wellnessColors.textDark} mb-2`}
                      />
                      <View slug={decodedSlug} />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Views
                      </span>
                    </div>
                  </div>

                  {/* Wellness Category Badge */}
                  <div
                    className={`bg-gradient-to-br ${wellnessColors.gradient} rounded-2xl p-4 text-white text-center`}
                  >
                    {getWellnessIcon(wellnessCategory)}
                    <div className="text-sm font-bold mt-2">
                      {wellnessCategory.split(" ")[0]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 max-w-4xl mx-auto">
                {/* Wellness Highlight */}
                {post.mood && (
                  <div
                    className={`mb-8 bg-gradient-to-r ${wellnessColors.gradientLight} dark:${wellnessColors.gradientDark} text-${wellnessColors.text} dark:text-${wellnessColors.textDark} p-4 rounded-2xl shadow-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/50 dark:bg-emerald-900/50 p-2 rounded-lg">
                        <Brain className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold uppercase tracking-wider text-sm">
                          MINDSET
                        </div>
                        <div className="text-sm opacity-90">{post.mood}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wellness Info */}
                {(post.wellnessType ||
                  post.timeRequired ||
                  post.difficulty) && (
                  <div className="mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      {post.wellnessType && (
                        <div
                          className={`flex items-center gap-2 bg-gradient-to-r ${wellnessColors.gradientLight} dark:${wellnessColors.gradientDark} text-${wellnessColors.text} dark:text-${wellnessColors.textDark} px-4 py-2 rounded-xl`}
                        >
                          {getWellnessIcon(post.wellnessType)}
                          <span className="font-medium">
                            {wellnessCategory}
                          </span>
                        </div>
                      )}
                      {post.difficulty && (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-xl">
                          <Activity className="h-4 w-4" />
                          <span className="font-medium">
                            Level: {post.difficulty}
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
                          WELLNESS
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
                          WELLNESS
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
                            WELLNESS
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

                {/* Text-to-Speech Player */}
                <div
                  className={`mb-10 bg-gradient-to-r ${wellnessColors.gradientLight} dark:${wellnessColors.gradientDark} rounded-2xl p-6 border border-${wellnessColors.border} dark:border-${wellnessColors.borderDark}`}
                >
                  <TextToSpeechPlayer content={plainTextContent} />
                </div>

                {/* Wellness Benefits */}
                {post.excerpt && (
                  <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Key Benefits
                      </h3>
                    </div>
                    <div className="prose prose-emerald dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Benefits */}
                {post.benefits && post.benefits.length > 0 && (
                  <div className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-teal-100 dark:border-teal-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Health Benefits
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {post.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {benefit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Article Content */}
                <article className="mb-12 max-w-7xl mx-auto px-4 lg:px-0">
                  <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
                    <div
                      className={`
                      prose-headings:font-bold 
                      prose-headings:text-gray-900 
                      prose-headings:dark:text-white
                      prose-headings:border-l-4
                      prose-headings:border-${wellnessColors.primary}-500
                      prose-headings:pl-4
                      prose-headings:mt-10
                      prose-headings:mb-6
                      prose-p:text-gray-700 
                      prose-p:dark:text-gray-300
                      prose-p:leading-relaxed
                      prose-p:text-lg
                      prose-a:text-${wellnessColors.text} 
                      prose-a:dark:text-${wellnessColors.textDark}
                      prose-a:font-medium
                      prose-a:underline
                      prose-a:decoration-${wellnessColors.primary}-300
                      prose-a:hover:text-${wellnessColors.primary}-700
                      prose-a:dark:hover:text-${wellnessColors.textDark}
                      prose-strong:text-gray-900 
                      prose-strong:dark:text-white
                      prose-strong:font-bold
                      prose-blockquote:border-l-4
                      prose-blockquote:border-${wellnessColors.primary}-400
                      prose-blockquote:pl-6
                      prose-blockquote:italic
                      prose-blockquote:bg-${wellnessColors.primary}-50
                      prose-blockquote:dark:bg-${wellnessColors.primary}-900/20
                      prose-blockquote:py-4
                      prose-blockquote:rounded-r-lg
                      prose-blockquote:text-gray-700
                      prose-blockquote:dark:text-gray-300
                      first-letter:text-7xl
                      first-letter:font-bold
                      first-letter:float-left
                      first-letter:mr-4
                      first-letter:mt-2
                      first-letter:text-${wellnessColors.text}
                      dark:first-letter:text-${wellnessColors.textDark}
                      first-letter:leading-none
                    `}
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

                {/* Safety & Equipment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {post.contraindications &&
                    post.contraindications.length > 0 && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800">
                        <div className="flex items-center gap-3 mb-4">
                          <Stethoscope className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Safety Notes
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {post.contraindications.map(
                            (note: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  {note}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {post.equipment && post.equipment.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center gap-3 mb-4">
                        <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          What You'll Need
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {post.equipment.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Resources */}
                {post.sources && post.sources.length > 0 && (
                  <div className="mb-10 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                      <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        References & Resources
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.sources.map((source: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-white dark:bg-gray-700 p-4 rounded-xl"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {source}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wellness Tags */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="mb-10 px-4 lg:px-6">
                    <div className="flex items-center gap-3 mb-6">
                      <BrainCircuit className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Related Topics
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {post.keywords.map((tag: string, index: number) => (
                        <Link
                          key={index}
                          href={`/?query=${encodeURIComponent(tag)}`}
                          className={`px-4 py-2 bg-gradient-to-r ${wellnessColors.gradientLight} dark:${wellnessColors.gradientDark} text-${wellnessColors.text} dark:text-${wellnessColors.textDark} hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/50 dark:hover:to-teal-800/50 rounded-full text-sm font-medium transition-all duration-200 border border-${wellnessColors.border} dark:border-${wellnessColors.borderDark}`}
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
                        Share this Wellness Guide
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Help others on their wellness journey
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
                  {/* Trending Wellness */}
                  <div className="bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${wellnessColors.gradient} text-white p-5`}
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6" />
                        <h2 className="text-xl font-bold">Popular Wellness</h2>
                      </div>
                    </div>
                    <div className="p-2">
                      {trendingWellnessWithUrls?.length > 0 ? (
                        trendingWellnessWithUrls
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
                                <div className="flex gap-3 p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200">
                                  <div className="flex-shrink-0">
                                    <div
                                      className={`w-8 h-8 flex items-center justify-center bg-gradient-to-br ${wellnessColors.gradient} text-white rounded-lg font-bold text-sm`}
                                    >
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 text-sm">
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
                                        <span
                                          className={`text-xs text-${wellnessColors.text} dark:text-${wellnessColors.textDark} font-medium`}
                                        >
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
                          No trending wellness posts
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Wellness Newsletter */}
                  <div
                    className={`bg-gradient-to-br from-emerald-800 via-teal-700 to-green-700 rounded-2xl p-6 text-white`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Activity className="h-8 w-8" />
                      <div>
                        <h3 className="text-xl font-bold">Wellness Journey</h3>
                        <p className="text-emerald-200 text-sm">
                          Weekly health inspiration
                        </p>
                      </div>
                    </div>
                    <NewsletterForm
                      variant="inline"
                      title=""
                      description="Get wellness tips, health advice, mindfulness practices, and holistic living guides delivered weekly."
                      theme="dark"
                    />
                  </div>

                  {/* Wellness Quick Tips */}
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-6 text-white">
                    <div className="text-center">
                      <Brain className="h-10 w-10 mx-auto mb-3" />
                      <h3 className="text-lg font-bold mb-2">
                        Daily Wellness Tip
                      </h3>
                      <p className="text-sm opacity-90 mb-4">
                        Take 5 deep breaths when feeling stressed. It activates
                        your parasympathetic nervous system.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {/* Related Wellness Section */}
            {relatedWellnessPostsWithUrls &&
              relatedWellnessPostsWithUrls.length > 0 && (
                <section className="mt-20 20 max-w-7xl mx-auto px-4 md:px-0">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${wellnessColors.gradient} rounded-full flex items-center justify-center`}
                      >
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        More Wellness Practices
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm">
                      Discover more ways to enhance your health and wellbeing
                    </p>
                  </div>
                  <MasonryGrid
                    posts={relatedWellnessPostsWithUrls.slice(4, 12)}
                  />
                  <div className="text-center mt-12">
                    <Link
                      href="/lifestyles/wellness"
                      className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${wellnessColors.gradient} hover:from-emerald-700 hover:to-teal-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl`}
                    >
                      Explore All Wellness
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
    console.error("Wellness page error:", error);
    notFound();
  }
}

// STATIC PARAMS
export async function generateStaticParams() {
  const posts = await client.fetch(`
    *[_type == "post" &&  
      defined(categories) && 
      count((categories[]->slug.current)[@ in ["wellness", "health"]]) > 0
    ] {
      "slug": slug.current
    }
  `);

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}
