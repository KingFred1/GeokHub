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
  Brain,
  Shield,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { NewsletterForm } from "@/components/global/Newsletter-form";
import {
  BLOG_BY_CATEGORY_SLUG,
  RELATED_POSTS_QUERY,
} from "@/sanity/lib/queries";
import ImageSliderWrapper from "@/components/ImageSliderWrapper";

// Initialize markdown parser
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


// export const revalidate = 86400;
export const revalidate = 2592000; // 30 days

// METADATA
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    // FIX: decode slug so canonical URL matches the page URL exactly
    const decodedSlug = decodeURIComponent(slug);

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
      { slug: decodedSlug },
      { next: { revalidate: 2592000 } },
    );

    if (!post) {
      return {
        title: "Mental Health Article Not Found - GeokHub",
        description: "The requested mental health article could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const canonicalUrl = `https://www.geokhub.com/mentalhealth/${decodedSlug}`;
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
        : "Mental health support, coping strategies, and emotional wellness on GeokHub");

    return {
      metadataBase: new URL("https://www.geokhub.com"),
      title: post.seoTitle || `${post.title} - GeokHub Mental Health`,
      description: post.metaDescription || description,
      alternates: { canonical: canonicalUrl },

      // FIX: explicitly allow indexing on the success path
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
        authors: [post.author?.name || "GeokHub Mental Health Team"],
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
        siteName: "GeokHub Mental Health",
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
    // On transient errors, keep pages indexable so we don't accidentally
    // de-index content due to a temporary fetch failure.
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

  for (const category of post.categories) {
    const categoryTitle = (category.title || "").toLowerCase();
    const categorySlug = (category.slug?.current || "").toLowerCase();

    const titleIsMental =
      (categoryTitle.includes("mental") && categoryTitle.includes("health")) ||
      categoryTitle.includes("mentalhealth");
    const slugIsMental =
      (categorySlug.includes("mental") && categorySlug.includes("health")) ||
      categorySlug.includes("mentalhealth");

    if (titleIsMental || slugIsMental) {
      return `/mentalhealth/${slugValue}`;
    }
  }

  return `/blogs/${slugValue}`;
}

// Function to get mental health category
function getMentalHealthCategory(mentalHealthType: string): string {
  if (!mentalHealthType) return "Mental Health";

  const mentalHealthMap: Record<string, string> = {
    anxiety: "Anxiety",
    stress: "Stress",
    depression: "Depression",
    mindfulness: "Mindfulness",
    therapy: "Therapy",
    coping: "Coping",
    selfcare: "Self-Care",
    trauma: "Trauma",
    sleep: "Sleep",
    workplace: "Workplace",
  };

  const typeLower = mentalHealthType.toLowerCase();
  for (const [key, value] of Object.entries(mentalHealthMap)) {
    if (typeLower.includes(key)) return value;
  }

  return "Mental Health";
}

// Crisis support information
const crisisSupportInfo = {
  title: "Need Immediate Help?",
  resources: [
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      description: "Free, 24/7 crisis counseling",
    },
    {
      name: "National Suicide Prevention Lifeline",
      contact: "988",
      description: "Call or text 988",
    },
    {
      name: "SAMHSA Treatment Referral",
      contact: "1-800-662-HELP (4357)",
      description: "Substance abuse & mental health",
    },
  ],
};

// MAIN COMPONENT
export default async function MentalHealthDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const baseUrl = "https://www.geokhub.com";

    // Fetch the mental health post
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
          slug
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
        mentalHealthType,
        difficulty,
        timeRequired,
        readTime,
        estimatedReadingTime,
        mood,
        copingStrategies,
        selfCareTips
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

    // ========== MENTAL HEALTH CATEGORY CHECK ==========
    // FIX: removed duplicate conditions and typo ("mentalheath")
    const isMentalHealthPost = post.categories?.some((cat: any) => {
      const catTitle = (cat.title || "").toLowerCase();
      const catSlug = (cat.slug?.current || "").toLowerCase();
      return (
        catTitle.includes("mentalhealth") ||
        catSlug.includes("mentalhealth") ||
        (catTitle.includes("mental") && catTitle.includes("health")) ||
        (catSlug.includes("mental") && catSlug.includes("health"))
      );
    });

    // ========== REJECT NON-MENTAL HEALTH POSTS WITH 404 ==========
    if (!isMentalHealthPost) {
      notFound();
    }

    // ========== CHECK PUBLICATION DATE ==========
    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      notFound();
    }

    // ========== FETCH RELATED DATA ==========
    const [mentalHealthPosts, relatedMentalHealthPosts, trendingMentalHealth] =
      await Promise.all([
        client.fetch(
          BLOG_BY_CATEGORY_SLUG,
          { slug: "mentalhealth" },
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
          `*[_type == "post" && categories[]->slug.current == "mentalhealth"] | order(views desc)[0...5] {
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          mainImage,
          excerpt,
          views,
          categories[]->{title, slug},
          mood
        }`,
        ),
      ]);

    // Add URLs to related posts
    const mentalHealthPostsWithUrls =
      mentalHealthPosts?.map((p: any) => ({
        ...p,
        url: getPostUrl(p),
      })) || [];

    const relatedMentalHealthPostsWithUrls =
      relatedMentalHealthPosts?.map((p: any) => ({
        ...p,
        url: getPostUrl(p),
      })) || [];

    const trendingMentalHealthWithUrls =
      trendingMentalHealth?.map((p: any) => ({
        ...p,
        url: getPostUrl(p),
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
    const mentalHealthCategory = getMentalHealthCategory(post.mentalHealthType);

    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .url()
      : `${baseUrl}/og-image.jpg`;

    const canonicalUrl = `https://www.geokhub.com/mentalhealth/${decodedSlug}`;

    // ========== JSON-LD ==========
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title || "Mental Health",
      description: post.excerpt || plainTextContent.substring(0, 160),
      author: {
        "@type": "Person",
        name: post.author?.name || "GeokHub Mental Health Team",
        ...(post.author?.image && { image: urlFor(post.author.image).url() }),
        ...(post.author?.expertise && { jobTitle: post.author.expertise }),
      },
      datePublished: post.publishedAt || post._createdAt,
      dateModified: post._updatedAt || post.publishedAt || post._createdAt,
      image: imageUrl,
      url: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "GeokHub Mental Health",
        url: "https://www.geokhub.com/mentalhealth",
      },
      articleSection: "Mental Health",
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

        <div className="min-h-screen bg-background">
          {/* Mental Health Navigation Indicator */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    MENTAL HEALTH • {mentalHealthCategory.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs opacity-80">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {formatReadableDate(post.publishedAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-6 py-2">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Desktop Tools */}
              <div className="hidden lg:block lg:w-20 flex-shrink-0">
                <div className="sticky top-32 space-y-6 z-30">
                  {/* Share Button */}
                  <div className="bg-card rounded-2xl p-6 shadow-lg border">
                    <SidebarShareButton
                      postId={post._id}
                      postUrl={canonicalUrl}
                      postTitle={post.title}
                      postDescription={post.excerpt}
                    />
                  </div>

                  {/* View Counter */}
                  <div className="bg-card rounded-2xl p-4 shadow-lg border">
                    <div className="flex flex-col items-center">
                      <Eye className="h-6 w-6 text-blue-600 mb-2" />
                      <View slug={decodedSlug} />
                      <span className="text-xs text-gray-500 mt-1">Views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 max-w-4xl mx-auto">
                {/* Emotional State */}
                {post.mood && (
                  <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/50 p-2 rounded-lg">
                        <Brain className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold uppercase tracking-wider text-sm">
                          EMOTIONAL STATE
                        </div>
                        <div className="text-sm opacity-90">{post.mood}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mental Health Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    {post.mentalHealthType && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 px-4 py-2 rounded-xl">
                        <Brain className="h-4 w-4" />
                        <span className="font-medium">
                          {mentalHealthCategory}
                        </span>
                      </div>
                    )}
                    {post.difficulty && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 px-4 py-2 rounded-xl">
                        <Brain className="h-4 w-4" />
                        <span className="font-medium">
                          Level: {post.difficulty}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Article Header */}
                <header className="mb-2 max-w-7xl mx-auto px-3 md:px-0">
                  {/* Title */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
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
                  {post.galleryImages &&
                  Array.isArray(post.galleryImages) &&
                  post.galleryImages.length > 0 ? (
                    <>
                      <ImageSliderWrapper
                        images={post.galleryImages}
                        className="md:rounded-xl shadow-2xl"
                      />
                      {/* FIX: was incorrectly using bg-green-600 (business color) */}
                      <div className="absolute top-6 left-6 z-20">
                        <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                          MENTAL HEALTH
                        </span>
                      </div>
                    </>
                  ) : post.images &&
                    Array.isArray(post.images) &&
                    post.images.length > 0 ? (
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
                        <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                          MENTAL HEALTH
                        </span>
                      </div>
                    </>
                  ) : (
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
                          <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                            MENTAL HEALTH
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
                <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <TextToSpeechPlayer content={plainTextContent} />
                </div>

                {/* Key Insights */}
                {post.excerpt && (
                  <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Key Insights
                      </h3>
                    </div>
                    <p className="text-gray-700 text-lg">{post.excerpt}</p>
                  </div>
                )}

                {/* Coping Strategies */}
                {post.copingStrategies && post.copingStrategies.length > 0 && (
                  <div className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-6 w-6 text-teal-600" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Coping Strategies
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.copingStrategies.map(
                        (strategy: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 bg-white/50 p-4 rounded-xl"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            </div>
                            <p className="text-gray-700 text-sm">{strategy}</p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Article Content */}
                <article className="mb-12 max-w-7xl mx-auto px-4 lg:px-0">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div
                      className="
                      prose-headings:font-bold 
                      prose-headings:text-gray-900
                      prose-headings:border-l-4
                      prose-headings:border-blue-500
                      prose-headings:pl-4
                      prose-headings:mt-10
                      prose-headings:mb-6
                      prose-p:text-gray-700 
                      prose-p:leading-relaxed
                      prose-p:text-lg
                      prose-a:text-blue-600
                      prose-a:font-medium
                      prose-a:underline
                      prose-a:hover:text-blue-700
                      prose-strong:text-gray-900 
                      prose-strong:font-bold
                      prose-blockquote:border-l-4
                      prose-blockquote:border-blue-400
                      prose-blockquote:pl-6
                      prose-blockquote:italic
                      prose-blockquote:bg-blue-50
                      prose-blockquote:py-4
                      prose-blockquote:rounded-r-lg
                      first-letter:text-7xl
                      first-letter:font-bold
                      first-letter:float-left
                      first-letter:mr-4
                      first-letter:mt-2
                      first-letter:text-blue-600
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

                {/* Self-Care Tips */}
                {post.selfCareTips && post.selfCareTips.length > 0 && (
                  <div className="mb-10 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="h-6 w-6 text-pink-600" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Self-Care Tips
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {post.selfCareTips.map((tip: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          </div>
                          <p className="text-gray-700 text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mental Health Tags */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="mb-10 px-4 lg:px-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Brain className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-bold dark:text-gray-100 text-gray-900">
                        Related Topics
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {post.keywords.map((tag: string, index: number) => (
                        <Link
                          key={index}
                          href={`/?query=${encodeURIComponent(tag)}`}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 rounded-full text-sm font-medium transition-all duration-200 border border-blue-100"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Share */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Share this Mental Health Resource
                      </h3>
                      <p className="text-gray-600">
                        Help others find support and understanding
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
                  {/* Trending Mental Health */}
                  <div className="bg-card rounded-2xl shadow-xl border overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6" />
                        <h2 className="text-xl font-bold">
                          Popular Mental Health
                        </h2>
                      </div>
                    </div>
                    <div className="p-2">
                      {(trendingMentalHealthWithUrls?.length || 0) > 0 ||
                      (mentalHealthPostsWithUrls?.length || 0) > 0 ? (
                        (trendingMentalHealthWithUrls &&
                        trendingMentalHealthWithUrls.length > 0
                          ? trendingMentalHealthWithUrls
                          : mentalHealthPostsWithUrls
                        )
                          .slice(0, 3)
                          .map((postItem: any, index: number) => {
                            const slugString =
                              postItem.slug?.current || postItem.slug;
                            if (!slugString) return null;

                            return (
                              <Link
                                key={slugString}
                                href={postItem.url}
                                aria-label={`Read ${postItem.title}`}
                                className="group block mb-2 last:mb-0 rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                              >
                                <div className="flex gap-3 p-2 sm:p-3 items-center hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-lg transform transition-all duration-300 group-hover:translate-x-1 rounded-xl">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-sm sm:text-base transition-transform duration-300 group-hover:scale-105">
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-300 line-clamp-2 text-sm md:text-base">
                                      {postItem.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-xs md:text-sm">
                                      <Eye className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-500">
                                        {postItem.views?.toLocaleString() || 0}{" "}
                                        views
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })
                      ) : (
                        <p className="text-gray-500 text-center py-6">
                          No popular mental health posts
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Crisis Support Card */}
                  <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="h-8 w-8" />
                      <div>
                        <h3 className="text-xl font-bold">Crisis Support</h3>
                        <p className="text-amber-200 text-sm">
                          Immediate help available
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {crisisSupportInfo.resources.map((resource, index) => (
                        <div key={index} className="bg-white/10 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageCircle className="h-4 w-4" />
                            <div className="font-semibold text-sm">
                              {resource.name}
                            </div>
                          </div>
                          <div className="text-lg font-bold mb-1">
                            {resource.contact}
                          </div>
                          <div className="text-xs text-amber-100">
                            {resource.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mental Health Newsletter */}
                  <div className="bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="h-8 w-8" />
                      <div>
                        <h3 className="text-xl font-bold">Mental Wellness</h3>
                        <p className="text-blue-200 text-sm">
                          Weekly mental health support
                        </p>
                      </div>
                    </div>
                    <NewsletterForm
                      variant="inline"
                      title=""
                      description="Get mental health tips, coping strategies, and emotional wellness guides delivered weekly."
                      theme="dark"
                    />
                  </div>
                </div>
              </aside>
            </div>

            {/* Related Mental Health Section */}
            {relatedMentalHealthPostsWithUrls &&
              relatedMentalHealthPostsWithUrls.length > 0 && (
                <section className="mt-20 max-w-7xl mx-auto px-4 md:px-0">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold dark:text-gray-100 text-gray-900">
                        More Mental Health Resources
                      </h2>
                    </div>
                    <p className="text-gray-800 max-w-2xl mx-auto text-sm dark:text-gray-300">
                      Discover more ways to support your mental wellbeing
                    </p>
                  </div>
                  <MasonryGrid
                    posts={relatedMentalHealthPostsWithUrls.slice(0, 8)}
                  />
                  <div className="text-center mt-12">
                    <Link
                      href="/mentalhealth"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Explore All Mental Health Resources
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
    console.error("Mental Health page error:", error);
    notFound();
  }
}

// STATIC PARAMS
export async function generateStaticParams() {
  const posts = await client.fetch(`
    *[_type == "post" && 
      categories[]->slug.current == "mentalhealth"
    ] {
      "slug": slug.current
    }
  `);

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}