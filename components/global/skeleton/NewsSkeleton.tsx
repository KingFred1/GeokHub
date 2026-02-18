"use client";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NewsSkeleton() {
  return (
    <div className="w-full min-h-screen relative overflow-hidden px-4 md:px-10 lg:px-20 mt-4 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-12 gap-2 md:gap-4">
        {/* Left TemuMainSwiper */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12 order-2">
          <Skeleton height={250} borderRadius={12} className="mb-4" />
        </div>

        {/* Center NewsSwiper */}
        <div className="lg:col-span-6 md:col-span-12 col-span-12 px-0 md:px-2 order-1">
          <div className="mb-4">
            <Skeleton height={300} borderRadius={12} />
          </div>
        </div>

        {/* Right TemuMainSwiper (hidden on small screens) */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12 order-3 hidden md:block">
          <Skeleton height={250} borderRadius={12} className="mb-4" />
        </div>
      </div>

      {/* MasonryGrid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton height={200} borderRadius={8} />
            <Skeleton height={20} width={`80%`} />
            <Skeleton height={15} width={`60%`} />
          </div>
        ))}
      </div>
    </div>
  );
}
