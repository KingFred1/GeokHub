// import NewsSwiper from "@/components/NewsSwiper";
// import MasonryGrid from "@/components/World";
// import SideBlog from "@/components/SideBlog";
// import { Trophy, Activity, TrendingUp, X } from "lucide-react";
// import { Category, Post } from "@/type";
// import Link from "next/link";
// import { FaBasketball, FaFootball } from "react-icons/fa6";

// interface SportServerProps {
//   categorySlug?: string;
//   initialPosts: Post[];
//   sportsCategories: Category[];
// }

// // Define sports category config
// const categoryConfig = [
//   {
//     slug: "sports",
//     icon: Trophy,
//     color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//     name: "All Sports",
//   },
//   {
//     slug: "football",
//     icon: FaFootball,
//     color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//     name: "Football",
//   },
//   {
//     slug: "basketball",
//     icon: FaBasketball,
//     color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
//     name: "Basketball",
//   },
//   // {
//   //   slug: "tennis",
//   //   icon: Trophy, // You can add a tennis icon later
//   //   color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
//   //   name: "Tennis",
//   // },
//   // {
//   //   slug: "athletics",
//   //   icon: Activity,
//   //   color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//   //   name: "Athletics",
//   // },
// ];

// export default async function SportServer({
//   categorySlug = "sports",
//   initialPosts,
//   sportsCategories,
// }: SportServerProps) {
//   // Filter posts based on category
//   const filteredPosts = categorySlug === "sports" 
//     ? initialPosts 
//     : initialPosts.filter((post) =>
//         post.categories?.some((cat) => cat.slug === categorySlug)
//       );

//   const activeCategory = categorySlug;

//   return (
//     <>
//       {/* Hero Section - Sports Theme */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 mb-8">
//         {/* Background elements */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-10 left-10% w-20 h-20 bg-blue-300 rounded-full blur-xl"></div>
//           <div className="absolute top-20 right-15% w-16 h-16 bg-blue-400 rounded-full blur-xl"></div>
//           <div className="absolute bottom-10 left-20% w-12 h-12 bg-blue-500 rounded-full blur-xl"></div>
//         </div>

//         {/* Sports icons */}
//         <div className="absolute top-5 left-5% text-blue-400/30">
//           <Trophy className="h-8 w-8" />
//         </div>
//         <div className="absolute top-10 right-10% text-blue-500/30">
//           <Activity className="h-6 w-6" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto text-center">
//           {/* Icon */}
//           <div className="relative inline-block mb-4">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
//               <Trophy className="h-10 w-10 text-blue-600 dark:text-blue-400" />
//             </div>
//           </div>

//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative">
//             Sports & Athletics
//             <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></span>
//           </h1>

//           <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto relative">
//             Stay updated with the latest sports news, match analysis, athlete profiles, and championship coverage
//           </p>

//           {/* Sports stats */}
//           <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
//               <span>{initialPosts.length}+ Articles</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
//               <span>{categoryConfig.length} Sports</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
//               <span>Live Coverage</span>
//             </div>
//           </div>
//         </div>

//         {/* Bottom decoration */}
//         <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400/20 via-blue-500/20 to-blue-600/20"></div>
//       </div>

//       {/* Category Filters */}
//       <div className="flex flex-col items-center mb-8">
//         <div className="flex flex-wrap gap-3 mb-4 justify-center">
//           {categoryConfig.map((category) => {
//             const IconComponent = category.icon;
//             const categoryData = sportsCategories.find(
//               (c) => c.slug === category.slug
//             );
//             const displayName = categoryData?.title || category.name;

//             return (
//               <Link
//                 key={category.slug}
//                 href={`/sports/${category.slug === "sports" ? "" : category.slug}`}
//                 className={`${category.color} px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all ${
//                   activeCategory === category.slug
//                     ? "ring-2 ring-offset-2 ring-current scale-105"
//                     : "opacity-90 hover:opacity-100 hover:scale-105"
//                 }`}
//               >
//                 <IconComponent className="h-4 w-4" />
//                 <span className="ml-2">{displayName}</span>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Active Filter Indicator */}
//         {activeCategory !== "sports" && (
//           <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
//             <span className="text-sm text-blue-700 dark:text-blue-300">
//               Showing:{" "}
//               {sportsCategories.find((c) => c.slug === activeCategory)
//                 ?.title || activeCategory}
//               {` (${filteredPosts.length} articles)`}
//             </span>
//             <Link
//               href="/sports"
//               className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
//             >
//               <X className="h-4 w-4" />
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-12 md:gap-6 mb-8 gap-4 lg:mb-10">
//         {/* Featured Sports Swiper */}
//         <div className="lg:col-span-8 md:col-span-12 col-span-12 order-1 lg:pr-7">
//           <div className="md:bg-white md:dark:bg-gray-800 rounded-2xl md:p-4 shadow-sm">
//             <div className="flex items-center mb-4">
//               <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                 {activeCategory === "sports"
//                   ? "Sports Headlines"
//                   : `${sportsCategories.find((c) => c.slug === activeCategory)?.title || activeCategory} News`}
//               </h2>
//             </div>
//             <NewsSwiper post={filteredPosts.slice(0, 4)} />
//           </div>
//         </div>

//         {/* Featured Stories */}
//         <div className="lg:col-span-4 md:col-span-12 col-span-12 order-2 hidden lg:block">
//           <div className="md:bg-white md:dark:bg-gray-800 rounded-2xl md:p-4 shadow-sm">
//             <div className="flex items-center mb-4">
//               <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Stories</h2>
//             </div>
//             <div className="flex flex-col gap-4">
//               {filteredPosts.slice(4, 5).map((post) => (
//                 <div key={post._id}>
//                   <SideBlog post={post} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* More Stories */}
//       <div className="mb-8">
//         <div className="flex items-center mb-6">
//           <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             {activeCategory === "sports"
//               ? "More Sports News"
//               : `More ${sportsCategories.find((c) => c.slug === activeCategory)?.title || activeCategory}`}
//           </h2>
//           <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
//             {filteredPosts.length} articles
//           </span>
//         </div>
//         {filteredPosts.length > 0 ? (
//           <MasonryGrid posts={filteredPosts.slice(5)} />
//         ) : (
//           <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
//             <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
//               No articles found
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-6">
//               {activeCategory === "sports"
//                 ? "No sports articles available yet."
//                 : `No articles available in ${sportsCategories.find((c) => c.slug === activeCategory)?.title || activeCategory} yet.`}
//             </p>
//             <Link
//               href="/sports"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               View All Sports
//             </Link>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }