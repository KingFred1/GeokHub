const SwipeBlogSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 px-5 pb-5 h-80 md:h-[50vh]">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="relative w-full h-full rounded-lg bg-muted animate-pulse shadow-md overflow-hidden flex flex-col justify-end"
        >
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700" />

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-purple-950 to-transparent">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600" />
              <div className="h-3 w-24 bg-gray-400 dark:bg-gray-600 rounded" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-400 dark:bg-gray-600 rounded" />
              <div className="h-4 w-5/6 bg-gray-400 dark:bg-gray-600 rounded" />
              <div className="h-4 w-2/3 bg-gray-400 dark:bg-gray-600 rounded" />
            </div>

            <div className="flex space-x-4 mt-4">
              <div className="w-8 h-8 rounded-full bg-gray-500 dark:bg-gray-700" />
              <div className="w-8 h-8 rounded-full bg-gray-500 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SwipeBlogSkeleton;
