"use client";
import React from "react";

const BlankCard = ({ height = 150 }: { height?: number }) => (
  <div
    className="rounded-md bg-gray-200 dark:bg-gray-800 w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px]"
    style={{ minHeight: height, maxHeight: height }}
  />
);

const BlankSection = ({
  cardHeight = 150,
  items = 4,
}: {
  cardHeight?: number;
  items?: number;
}) => (
  <div className="pb-5">
    <div className="h-8 w-40 rounded bg-gray-200 dark:bg-gray-800 mb-4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: items }).map((_, idx) => (
        <BlankCard key={idx} height={cardHeight} />
      ))}
    </div>
  </div>
);

export default function HomeSkeleton() {
  return (
    <div className="w-full min-h-screen relative overflow-hidden px-4 md:px-8 lg:px-16 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-12 gap-2 w-full">
        {/* Main Content */}
        <div className="lg:col-span-8 col-span-12 md:p-3 rounded">
          {/* SwipeBlog Blank */}
          <div className="h-64 sm:h-80 md:h-[40vh] lg:h-[50vh] rounded-xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-800 w-full" />

          {/* HomeBlog Grid Blank */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <BlankCard key={idx} height={200} />
            ))}
          </div>
        </div>

        {/* Sidebar Pick For You */}
        <div className="lg:col-span-4 col-span-12">
          <div className="md:mt-14 px-2">
            <div className="h-8 w-36 rounded bg-gray-200 dark:bg-gray-800 mb-4" />
            <ul className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-20 h-16 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Temu Swiper Blank */}
      <div className="my-5 h-36 rounded bg-gray-200 dark:bg-gray-800" />

      {/* Sections */}
      <BlankSection cardHeight={150} /> {/* Entertainment */}
      <BlankSection cardHeight={100} /> {/* Trending */}
      <BlankSection cardHeight={150} /> {/* Health */}
      <BlankSection cardHeight={150} /> {/* Sports */}
      <BlankSection cardHeight={150} /> {/* Technology */}
    </div>
  );
}
