"use client";

import { Post } from "@/sanity/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, Clock, ChevronRight } from "lucide-react";

function formatTimeShort(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
}

export default function BreakingNewsTicker({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!posts || posts.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % posts.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [posts, isHovered]);

  if (!posts || posts.length === 0) return null;

  const post = posts[current];
  const postSlug = post?.slug?.current ? `/blogs/${post.slug?.current}` : "#";

  return (
    <div
      className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-2 relative shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Alert Icon */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <div className="relative">
          <AlertTriangle className="h-5 w-5 text-white animate-pulse" />
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>

      {/* Main Flex Row */}
      <div className="flex items-center gap-3 ml-8">
        <span className="hidden sm:inline font-bold text-xs sm:text-sm uppercase tracking-wide bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
          Breaking
        </span>

        <div className="flex-1 min-w-0">
          <Link
            href={postSlug}
            className={`flex items-center gap-2 transition-all duration-500 ${
              fade ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            } hover:underline group`}
          >
            <span className="truncate text-xs sm:text-sm font-medium">
              {post.title}
            </span>

            <div className="hidden sm:flex items-center gap-1 text-xs opacity-90">
              <Clock className="h-3 w-3" />
              <span>{formatTimeShort(post._createdAt)}</span>
            </div>

            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline" />
          </Link>
        </div>

        {/* Right Controls */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Progress */}
          <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{
                width: isHovered ? "0%" : "100%",
                transition: isHovered ? "width 0.3s ease" : "width 4s linear",
              }}
            />
          </div>

          {/* Counter */}
          <div className="text-[10px] sm:text-xs opacity-70 px-2 py-0.5 bg-white/10 rounded">
            {current + 1}/{posts.length}
          </div>
        </div>
      </div>

      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none"></div>
    </div>
  );
}
