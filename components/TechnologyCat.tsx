import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/types";
import {
  ChevronRight,
  Cpu,
  Laptop,
  Brain,
  Zap,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { FaInternetExplorer } from "react-icons/fa6";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";

import { formatTimeShort } from "@/lib/formatTime";

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

function getPostDetailUrl(post: Post): string {
  // Check if post has categories
  if (!post.categories || post.categories.length === 0) {
    return `/blogs/${post.slug?.current}`;
  }

  // Check each category for "news" or "world"
  for (const category of post.categories) {
    const categoryTitle = category.title?.toLowerCase();
    const categorySlug = category.slug?.current?.toLowerCase();

    if (categoryTitle === "ai" || categorySlug === "ai") {
      return `/technology/ai/${post.slug?.current}`;
    }

    if (categoryTitle === "programming" || categorySlug === "programming") {
      return `/technology/programming/${post.slug?.current}`;
    }

    if (categoryTitle === "cloud-devops" || categorySlug === "cloud-devops") {
      return `/technology/cloud-devops/${post.slug?.current}`;
    }

    if (categoryTitle === "emerging-tech" || categorySlug === "emerging-tech") {
      return `/technology/emerging-tech/${post.slug?.current}`;
    }

    if (categoryTitle === "gadgets" || categorySlug === "gadgets") {
      return `/technology/gadgets/${post.slug?.current}`;
    }

    if (categoryTitle === "cybersecurity" || categorySlug === "cybersecurity") {
      return `/technology/cybersecurity/${post.slug?.current}`;
    }

    if (categoryTitle === "tech-news" || categorySlug === "tech-news") {
      return `/technology/tech-news/${post.slug?.current}`;
    }



    if (categoryTitle === "news" || categorySlug === "news") {
      return `/news/${post.slug?.current}`;
    }
    
    if (categoryTitle === "world" || categorySlug === "world") {
      return `/news/world/${post.slug?.current}`;
    }
    
    // Also check parent category if exists
    if (category.parent) {
      const parentTitle = category.parent.title?.toLowerCase();
      const parentSlug = category.parent.slug?.current?.toLowerCase();

      if (parentTitle === "ai" || parentSlug === "ai") {
        return `/technology/ai/${post.slug?.current}`;
      }

      if (parentTitle === "programming" || parentSlug === "programming") {
        return `/technology/programming/${post.slug?.current}`;
      }

      if (parentTitle === "cloud-devops" || parentSlug === "cloud-devops") {
        return `/technology/cloud-devops/${post.slug?.current}`;
      }

      if (parentTitle === "emerging-tech" || parentSlug === "emerging-tech") {
        return `/technology/emerging-tech/${post.slug?.current}`;
      }

      if (parentTitle === "gadgets" || parentSlug === "gadgets") {
        return `/technology/gadgets/${post.slug?.current}`;
      }

      if (parentTitle === "cybersecurity" || parentSlug === "cybersecurity") {
        return `/technology/cybersecurity/${post.slug?.current}`;
      }

      if (parentTitle === "tech-news" || parentSlug === "tech-news") {
        return `/technology/tech-news/${post.slug?.current}`;
      }

      if (parentTitle === "news" || parentSlug === "news") {
        return `/news/${post.slug?.current}`;
      }
      
      if (parentTitle === "world" || parentSlug === "world") {
        return `/news/world/${post.slug?.current}`;
      }
    }
  }

  // Default to /blogs/ if no specific category matches
  return `/blogs/${post.slug?.current}`;
}

// Simple static image component
function StaticImage({ image, alt, className = "" }: { image: any; alt: string; className?: string }) {
  if (!image?.asset) {
    return (
      <div className={`bg-card dark:bg-card flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-xs">No image</span>
      </div>
    );
  }

  return (
    <img
      src={urlFor(image)
        .width(600)
        .height(400)
        .quality(80)
        .format('webp')
        .auto('format')
        .url()}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}

const TechnologyCat = ({ posts }: { posts: Post[] }) => {

  if (!posts || posts.length === 0) return null;

  // for debugging: ensure we know how many items arrived
  // console.log("TechnologyCat received", posts.length, "posts");

  // Exclude posts where category or parent category is 'tech-news' from this component
  let displayedPosts = posts
    .filter((post) => {
      return !post.categories?.some((c) => {
        const slug = c.slug?.current?.toLowerCase?.();
        const parentSlug = c.parent?.slug?.current?.toLowerCase?.();
        return slug === 'tech-news' || parentSlug === 'tech-news';
      });
    });

  // if filtering removed everything, fall back to raw list so we show something
  if (displayedPosts.length === 0 && posts.length > 0) {
    console.warn("TechnologyCat filter removed all posts; falling back to unfiltered list");
    displayedPosts = posts.slice();
  }

  displayedPosts = displayedPosts.slice(0, 8);

  return (
    <section className="w-full max-w-7xl mx-auto py-5 border-y">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div className="mb-3 md:mb-0">
          <div className="flex items-center gap-3 mb-3">
            {/* <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Cpu className="text-blue-600 dark:text-blue-400" size={24} />
            </div> */}
            <Link href="/technology/tech-news" className="px-4 md:px-0 hover:underline flex text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              Technology
              <ArrowRightIcon />
            </Link>
          </div>
        </div>

        {/* Category Links */}
        <div className="flex flex-wrap ">
          <Link
            href="/technology/ai"
            className="flex items-center px-4 py-2 hover:underline"
          >
            {/* <Brain size={16} className="text-blue-600" /> */}
            <span className="text-lg font-semibold">AI</span>
            <ArrowRightIcon />
          </Link>
          <Link
            href="/technology/cybersecurity"
            className="flex items-center px-4 py-2 hover:underline"
          >
              {/* <FaInternetExplorer size={16} className="text-blue-600" /> */}
            <span className="text-lg font-semibold">CyberSecurity</span>
            <ArrowRightIcon />
          </Link>
          <Link
            href="/technology/gadgets"
            className="flex items-center px-4 py-2 hover:underline"
          >
            {/* <Laptop size={16} className="text-blue-600" /> */}
            <span className="text-lg font-semibold">Gadgets</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

    
      {/* Featured Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
        {displayedPosts.map((post) => {
          // Format time for each post individually 
          const formattedTime = formatTimeShort(post?._updatedAt || post?.publishedAt);
          
          return (
            <article
              key={post._id}
              className="group bg-card dark:bg-card  overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                {/* Removed CardOptions temporarily */}
                <Link
                  href={getPostDetailUrl(post)}
                  className="block h-full"
                >
                  <StaticImage
                    image={post.mainImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </Link>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium ">
                    Tech
                  </span>
                </div>
              </div>

              <div className="p-4">
                <Link href={getPostDetailUrl(post)}>
                  <h3 className="font-semibold text-xl mb-2 line-clamp-3 text-gray-900 dark:text-white hover:underline transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {/* <div className="flex items-center gap-1 ">
                    {post.author?.image && (
                      <StaticImage
                        image={post.author.image}
                        alt={post.author?.name || "Author"}
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <span>{post.author?.name || "Unknown"}</span>
                  </div> */}
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <time dateTime={post.publishedAt || post._updatedAt}>
                      {formattedTime}
                    </time>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 bg-black dark:bg-white mt-4">
                  <div className="flex items-center gap-4">

                    <div className="flex items-center gap-4">
                    {/* <LikeButton postId={post._id} /> */}
                    {/* <Link href={`/blogs/${post.slug?.current}/#comments`}>
                      <CommentCount postId={post._id} />
                    </Link> */}
                  </div>
                  </div>

                  {/* <Link
                    href={getPostDetailUrl(post)}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Read more
                    <ChevronRight size={16} />
                  </Link> */}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* CTA Section */}
      {/* <div className="text-center mt-12">
        <div className="inline-flex flex-col items-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Stay updated with the latest technology trends
          </p>
          <Link
            href="/technology/tech-news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <Zap size={18} />
            Explore All Tech Articles
            <ChevronRight size={18} />
          </Link>
        </div>
      </div> */}
    </section>
  );
};

export default TechnologyCat;