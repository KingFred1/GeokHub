"use client";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SubCatSkeleton() {
  return (
    <div className="w-full min-h-screen relative overflow-hidden px-4 md:px-10 lg:px-20 mt-4 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-3">
            <Skeleton height={200} borderRadius={8} />
            <Skeleton height={24} width="80%" />
            <Skeleton height={18} width="60%" />
          </div>
        ))}
      </div>
    </div>
  );
}
