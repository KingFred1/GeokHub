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
  Rocket,
  Zap,
  Sparkles,
  Atom,
  Cpu,
  Eye,
  Share2,
  TrendingUp,
  Globe,
  Target,
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

export const revalidate = 2592000; // 30 days
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
        title: "Emerging Tech Article Not Found - GeokHub",
        description: "The requested emerging technology article could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Verify this is an emerging tech post
    const isEmergingTechPost = post.categories?.some((cat: any) => {
      const catTitle = cat.title?.toLowerCase();
      const catSlug = cat.slug?.current?.toLowerCase();
      const parentSlug = cat.parent?.slug?.current?.toLowerCase();
      return (
        catTitle === "emerging-tech" ||
        catSlug === "emerging-tech" ||
        catTitle === "emerging technologies" ||
        catSlug === "emerging-technologies" ||
        catTitle === "future tech" ||
        catSlug === "future-tech" ||
        parentSlug === "emerging-tech" ||
        parentSlug === "emerging-technologies" ||
        parentSlug === "future-tech"
      );
    });

    // If not an emerging tech post, redirect to the correct URL
    if (!isEmergingTechPost) {
      const correctUrl = getPostUrlPath(post, decodedSlug);
      if (correctUrl !== `/technology/emerging-tech/${decodedSlug}`) {
        redirect(correctUrl);
      }
    }

    const canonicalUrl = `https://www.geokhub.com/technology/emerging-tech/${decodedSlug}`;
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
        : "Cutting-edge emerging technologies and innovations on GeokHub");

    return {
      metadataBase: new URL("https://www.geokhub.com"),
      title: post.seoTitle || `${post.title} - GeokHub Emerging Tech`,
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
        authors: [post.author?.name || "GeokHub Emerging Tech Team"],
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
        siteName: "GeokHub Emerging Tech",
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
    console.error("Error generating emerging tech metadata:", error);
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

// Function to get emerging tech category
function getEmergingTechCategory(techType: string): string {
  if (!techType) return "Future Technologies";

  const techMap: Record<string, string> = {
    quantum: "Quantum Computing",
    "quantum computing": "Quantum Computing",
    blockchain: "Blockchain & Web3",
    web3: "Web3 & Blockchain",
    crypto: "Cryptocurrency",
    metaverse: "Metaverse",
    vr: "Virtual Reality",
    ar: "Augmented Reality",
    xr: "Extended Reality",
    space: "Space Tech",
    spacex: "Space Tech",
    biotech: "Biotechnology",
    bio: "Biotechnology",
    robotics: "Advanced Robotics",
    drones: "Drone Technology",
    autonomous: "Autonomous Systems",
    "self-driving": "Autonomous Vehicles",
    neural: "Neural Interfaces",
    brain: "Brain-Computer Interface",
    fusion: "Nuclear Fusion",
    hydrogen: "Hydrogen Tech",
    sustainable: "Sustainable Tech",
    greentech: "Green Technology",
    nanotech: "Nanotechnology",
    iot: "Internet of Things",
  };

  const techLower = techType.toLowerCase();
  for (const [key, value] of Object.entries(techMap)) {
    if (techLower.includes(key)) return value;
  }

  return "Future Technologies";
}

// MAIN COMPONENT
export default async function EmergingTechDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const baseUrl = "https://www.geokhub.com";

    // Fetch the emerging tech post
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
        technologyType,
        company,
        researchUrl,
        demoUrl,
        sources,
        breakthrough,
        featured,
        readTime,
        estimatedReadingTime,
        timeline,
        impact
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

    // ========== EMERGING TECH CATEGORY CHECK ==========
    const isEmergingTechPost = post.categories?.some((cat: any) => {
      const catTitle = cat.title?.toLowerCase();
      const catSlug = cat.slug?.current?.toLowerCase();
      const parentSlug = cat.parent?.slug?.current?.toLowerCase();
      return (
        catTitle === "emerging-tech" ||
        catSlug === "emerging-tech" ||
        catTitle === "emerging technologies" ||
        catSlug === "emerging-technologies" ||
        catTitle === "future tech" ||
        catSlug === "future-tech" ||
        parentSlug === "emerging-tech" ||
        parentSlug === "emerging-technologies" ||
        parentSlug === "future-tech"
      );
    });

    // ========== REJECT NON-EMERGING TECH POSTS WITH 404 ==========
    if (!isEmergingTechPost) {
      notFound();
    }

    // ========== CHECK PUBLICATION DATE ==========
    if (post.publishedAt && new Date(post.publishedAt) > new Date()) {
      notFound();
    }

    // ========== FETCH RELATED DATA ==========
    const [emergingTechPosts, relatedEmergingTechPosts, trendingEmergingTech] =
      await Promise.all([
        client.fetch(
          BLOG_BY_CATEGORY_SLUG,
          { slug: "emerging-tech" },
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
          `*[_type == "post" && count((categories[]->slug.current)[@ in ["emerging-tech", "emerging-technologies", "future-tech"]]) > 0] | order(views desc)[0...5] {
            _id,
            title,
            "slug": slug.current,
            publishedAt,
            mainImage,
            excerpt,
            views,
            categories[]->{title, slug},
            technologyType,
            company,
            breakthrough
          }`,
          { next: { revalidate: 2592000 } },
        ),
      ]);

    // Add URLs to related posts
    const emergingTechPostsWithUrls =
      emergingTechPosts?.map((post: any) => ({
        ...post,
        url: getPostUrl(post),
      })) || [];

    const relatedEmergingTechPostsWithUrls =
      relatedEmergingTechPosts?.map((post: any) => ({
        ...post,
        url: getPostUrl(post),
      })) || [];

    const trendingEmergingTechWithUrls =
      trendingEmergingTech?.map((post: any) => ({
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
    const emergingCategory = getEmergingTechCategory(post.technologyType);

    const imageUrl = post.mainImage?.asset
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .quality(80)
          .format("webp")
          .url()
      : `${baseUrl}/og-image.jpg`;

    const canonicalUrl = `https://www.geokhub.com/technology/emerging-tech/${decodedSlug}`;

    // ========== JSON-LD ==========
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: post.title || "Emerging Tech",
      description: post.excerpt || plainTextContent.substring(0, 160),
      author: {
        "@type": "Person",
        name: post.author?.name || "GeokHub Emerging Tech Team",
        ...(post.author?.image && { image: urlFor(post.author.image).url() }),
        ...(post.author?.expertise && { jobTitle: post.author.expertise }),
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
        name: "GeokHub Emerging Tech",
        url: "https://www.geokhub.com/technology/emerging-tech",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/icons/geokhub-emerging.png`,
        },
      },
      articleSection: post.categories?.[0]?.title || "Emerging Tech",
      ...(post.technologyType && { articleSection: post.technologyType }),
      ...(post.company && { provider: post.company }),
      ...(post.breakthrough && { keywords: ["Breakthrough"] }),
      ...(post.timeline && { dateCreated: post.timeline }),
      ...(post.impact && { educationalAlignment: post.impact }),
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
          {/* Emerging Tech Navigation Indicator */}
          <div className="bg-gradient-to-r from-purple-900 via-violet-800 to-fuchsia-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    EMERGING TECH • {emergingCategory.toUpperCase()}
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
                      <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                      <View slug={decodedSlug} />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Views
                      </span>
                    </div>
                  </div>

                  {/* Emerging Tech Badge */}
                  <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-4 text-white text-center">
                    <Sparkles className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-bold">FUTURE</div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 max-w-4xl mx-auto">
                {/* Breakthrough Alert */}
                {post.breakthrough && (
                  <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-2xl shadow-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Zap className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold uppercase tracking-wider text-sm">
                          TECH BREAKTHROUGH
                        </div>
                        <div className="text-sm opacity-90">
                          Major Innovation in {emergingCategory}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technology Info */}
                {(post.company || post.technologyType || post.timeline) && (
                  <div className="mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      {post.company && (
                        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Rocket className="h-4 w-4" />
                            <span className="font-bold">{post.company}</span>
                          </div>
                        </div>
                      )}
                      {post.technologyType && (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-xl">
                          {post.technologyType
                            .toLowerCase()
                            .includes("quantum") ? (
                            <Atom className="h-4 w-4" />
                          ) : post.technologyType
                              .toLowerCase()
                              .includes("blockchain") ||
                            post.technologyType
                              .toLowerCase()
                              .includes("web3") ? (
                            <Globe className="h-4 w-4" />
                          ) : post.technologyType
                              .toLowerCase()
                              .includes("vr") ||
                            post.technologyType.toLowerCase().includes("ar") ||
                            post.technologyType
                              .toLowerCase()
                              .includes("metaverse") ? (
                            <Target className="h-4 w-4" />
                          ) : post.technologyType
                              .toLowerCase()
                              .includes("space") ? (
                            <Rocket className="h-4 w-4" />
                          ) : post.technologyType
                              .toLowerCase()
                              .includes("bio") ? (
                            <Cpu className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {emergingCategory}
                          </span>
                        </div>
                      )}
                      {post.timeline && (
                        <div className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>Expected: {post.timeline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Article Header */}
                <header className="mb-2 max-w-7xl mx-auto px-3 md:px-0">
                  {/* Title */}
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {post.title}
                  </h1>

                  {/* Subtitle & Metadata */}
                  <div className="flex sm:flex-row sm:items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2 flex-wrap">
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
                <div className="mb-5 relative">
                  {post.galleryImages &&
                  Array.isArray(post.galleryImages) &&
                  post.galleryImages.length > 0 ? (
                    <>
                      <ImageSliderWrapper
                        images={post.galleryImages}
                        className="md:rounded-xl shadow-2xl"
                      />
                      <div className="absolute top-6 left-6 z-20">
                        <span className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                          EMERGING TECH
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
                        <span className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                          EMERGING TECH
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
                          <span className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                            EMERGING TECH
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
                <div className="mb-10 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-violet-100 dark:border-violet-800">
                  <TextToSpeechPlayer content={plainTextContent} />
                </div>

                {/* Innovation Overview */}
                {post.excerpt && (
                  <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Innovation Overview
                      </h3>
                    </div>
                    <div className="prose prose-blue dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                    {post.impact && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Potential Impact:
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {post.impact}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Article Content */}
                <article className="mb-12 max-w-7xl mx-auto px-4 lg:px-0">
                  <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
                    <div
                      className="
                      prose-headings:font-bold 
                      prose-headings:text-gray-900 
                      prose-headings:dark:text-white
                      prose-headings:border-l-4
                      prose-headings:border-violet-600
                      prose-headings:pl-4
                      prose-headings:mt-10
                      prose-headings:mb-6
                      prose-p:text-gray-700 
                      prose-p:dark:text-gray-300
                      prose-p:leading-relaxed
                      prose-p:text-lg
                      prose-a:text-violet-600 
                      prose-a:dark:text-violet-400
                      prose-a:font-medium
                      prose-a:underline
                      prose-code:bg-gray-100
                      prose-code:dark:bg-gray-800
                      prose-code:text-violet-600
                      prose-code:dark:text-violet-400
                      prose-code:p-1
                      prose-code:rounded
                      prose-code:text-sm
                      prose-pre:bg-gray-900
                      prose-pre:dark:bg-gray-800
                      prose-pre:text-gray-100
                      prose-pre:dark:text-gray-200
                      prose-pre:p-4
                      prose-pre:rounded-lg
                      prose-pre:overflow-x-auto
                      prose-strong:text-gray-900 
                      prose-strong:dark:text-white
                      prose-strong:font-bold
                      prose-blockquote:border-l-4
                      prose-blockquote:border-violet-600
                      prose-blockquote:pl-6
                      prose-blockquote:italic
                      prose-blockquote:bg-violet-50
                      prose-blockquote:dark:bg-violet-900/20
                      prose-blockquote:py-4
                      prose-blockquote:rounded-r-lg
                      first-letter:text-7xl
                      first-letter:font-bold
                      first-letter:float-left
                      first-letter:mr-4
                      first-letter:mt-2
                      first-letter:text-violet-600
                      dark:first-letter:text-violet-400
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

                {/* Research & Sources */}
                {post.sources && post.sources.length > 0 && (
                  <div className="mb-10 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Research & Sources
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.sources.map((source: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-white dark:bg-gray-700 p-4 rounded-xl"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {source}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emerging Tech Tags */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="mb-10 px-4 lg:px-6">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Future Tech Topics
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {post.keywords.map((tag: string, index: number) => (
                        <Link
                          key={index}
                          href={`/?query=${encodeURIComponent(tag)}`}
                          className="px-4 py-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-300 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-800/50 dark:hover:to-purple-800/50 rounded-full text-sm font-medium transition-all duration-200 border border-violet-100 dark:border-violet-800"
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
                        Share this Innovation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Spread awareness about this cutting-edge technology
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
                  {/* Trending Emerging Tech */}
                  <div className="bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-5">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6" />
                        <h2 className="text-xl font-bold">
                          Future Tech Trends
                        </h2>
                      </div>
                    </div>
                    <div className="p-2">
                      {trendingEmergingTechWithUrls?.length > 0 ? (
                        trendingEmergingTechWithUrls
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
                                <div className="flex gap-3 p-2 hover:bg-violet-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-lg font-bold text-sm">
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 line-clamp-2 text-sm">
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
                                      {postItem.breakthrough && (
                                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                                          BREAKTHROUGH
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
                          No trending future tech
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Emerging Tech Newsletter */}
                  {/* <div className="bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Rocket className="h-8 w-8" />
                      <div>
                        <h3 className="text-xl font-bold">Future Forward</h3>
                        <p className="text-violet-200 text-sm">
                          Weekly emerging tech updates
                        </p>
                      </div>
                    </div>
                    <NewsletterForm
                      variant="inline"
                      title=""
                      description="Get quantum computing, blockchain, space tech, and more delivered to your inbox."
                      theme="dark"
                    />
                  </div> */}
                </div>
              </aside>
            </div>

            {/* Related Emerging Tech Section */}
            {relatedEmergingTechPostsWithUrls &&
              relatedEmergingTechPostsWithUrls.length > 0 && (
                <section className="mt-20 max-w-7xl mx-auto px-4 md:px-0">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Rocket className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        More Future Innovations
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm">
                      Discover more groundbreaking emerging technologies
                    </p>
                  </div>
                  <MasonryGrid
                    posts={relatedEmergingTechPostsWithUrls.slice(4, 12)}
                  />
                  <div className="text-center mt-12">
                    <Link
                      href="/technology/emerging-tech"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Explore All Emerging Tech
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
    console.error("Emerging Tech page error:", error);
    notFound();
  }
}

// STATIC PARAMS - Generate all emerging tech slugs for static generation
export async function generateStaticParams() {
  const posts = await client.fetch(`
    *[_type == "post" && 
      defined(slug.current) && 
      publishedAt <= now() &&
      count((categories[]->slug.current)[@ in ["emerging-tech", "emerging-technologies", "future-tech"]]) > 0
    ] {
      "slug": slug.current
    }
  `);

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}