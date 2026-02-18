// import { urlFor } from "@/sanity/lib/image";
// import { Post } from "@/sanity/types";
// import Link from "next/link";
// import { Trophy, Calendar, ChevronRight } from "lucide-react";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";

// function formatTimeShort(dateString: string): string {
//   if (!dateString) return "recently";

//   try {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//     if (diffInSeconds < 60) return "just now";
//     const diffInMinutes = Math.floor(diffInSeconds / 60);
//     if (diffInMinutes < 60) return `${diffInMinutes}m`;
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours}h`;
//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays < 7) return `${diffInDays}d`;
//     const diffInWeeks = Math.floor(diffInDays / 7);
//     return `${diffInWeeks}w`;
//   } catch {
//     return "recently";
//   }
// }

// // Simple static image component
// function StaticImage({
//   image,
//   alt,
//   className = "",
// }: {
//   image: any;
//   alt: string;
//   className?: string;
// }) {
//   if (!image?.asset) {
//     return (
//       <div
//         className={`bg-gray-card dark:bg-card flex items-center justify-center ${className}`}
//       >
//         <span className="text-gray-500 text-xs">No image</span>
//       </div>
//     );
//   }

//   return (
//     <img
//       src={urlFor(image)
//         .width(400)
//         .height(300)
//         .quality(80)
//         .format("webp")
//         .auto("format")
//         .url()}
//       alt={alt}
//       className={className}
//       loading="lazy"
//     />
//   );
// }

// const SportsNews = ({ posts = [] }: { posts?: Post[] }) => {
//   if (!posts || posts.length === 0) return null;

//   // Mobile-first data structure
//   const featuredPost = posts[0];
//   const secondaryPosts = posts.slice(1, 2); // 1 secondary post for mobile
//   const sidebarPosts = posts.slice(2, 5); // 3 sidebar posts for desktop

//   return (
//     <section className="w-full py-8">
//       <div className="container mx-auto">
//         {/* Section Header - Mobile Optimized */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
//           <div className="flex items-center gap-3 mb-4 sm:mb-0">
//             <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
//               <Trophy className="text-red-600 dark:text-red-400" size={20} />
//             </div>
//             <div>
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
//                 Sports News
//               </h2>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
//                 Latest updates from the world of sports
//               </p>
//             </div>
//           </div>

//           <Link
//             href="/sports"
//             className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 self-start sm:self-auto"
//           >
//             View All
//             <ChevronRight size={14} />
//           </Link>
//         </div>

//         {/* Mobile Layout - Stacked Cards */}
//         <div className="block lg:hidden space-y-6">
//           {/* Featured Post - Mobile */}
//           {featuredPost && (
//             <article className="bg-card dark:bg-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//               <Link
//                 href={`/blogs/${featuredPost.slug?.current || "#"}`}
//                 className="block"
//               >
//                 <div className="relative h-48 w-full">
//                   <StaticImage
//                     image={featuredPost.mainImage}
//                     alt={featuredPost.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//                   <div className="absolute top-3 left-3">
//                     <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
//                       Featured
//                     </span>
//                   </div>
//                 </div>
//               </Link>

//               <div className="p-4">
//                 <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
//                   <span>{featuredPost.author?.name || "Staff"}</span>
//                   <span>•</span>
//                   <time>{formatTimeShort(featuredPost._updatedAt)}</time>
//                 </div>

//                 <Link href={`/blogs/${featuredPost.slug?.current || "#"}`}>
//                   <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
//                     {featuredPost.title}
//                   </h3>
//                 </Link>

//                 <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
//                   {featuredPost.excerpt ||
//                     "Read the latest sports news and updates."}
//                 </p>

//                 <Link
//                   href={`/blogs/${featuredPost.slug?.current || "#"}`}
//                   className="text-red-600 dark:text-red-400 text-sm font-medium hover:underline"
//                 >
//                   Read full story
//                 </Link>
//               </div>
//             </article>
//           )}

//           {/* Secondary Posts - Mobile */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {secondaryPosts.map((post) => (
//               <article
//                 key={post._id}
//                 className="bg-card dark:bg-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
//               >
//                 <Link
//                   href={`/blogs/${post.slug?.current || "#"}`}
//                   className="block"
//                 >
//                   <div className="relative h-32 w-full">
//                     <StaticImage
//                       image={post.mainImage}
//                       alt={post.title}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </Link>

//                 <div className="p-3">
//                   <Link href={`/blogs/${post.slug?.current || "#"}`}>
//                     <h4 className="font-semibold text-xl text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
//                       {post.title}
//                     </h4>
//                   </Link>

//                   <div className="flex items-center gap-2 text-xs py-4 text-gray-500 dark:text-gray-400">
//                     <div className="flex items-center gap-1">
//                       {post.author?.image && (
//                         <img
//                           src={urlFor(post.author.image).url()}
//                           alt={post.author?.name || "Author"}
//                           className="w-6 h-6 rounded-full"
//                           loading="eager"
//                         />
//                       )}
//                       <span>{post.author?.name}</span>
//                     </div>
//                     <time>{formatTimeShort(post._updatedAt)}</time>
//                   </div>

//                   <div className="flex items-center gap-4">
//                   <LikeButton postId={post._id} />
//                   <Link href={`/blogs/${post.slug?.current}/#comments`}>
//                     <CommentCount postId={post._id} />
//                   </Link>
//                 </div>
//                 </div>
//               </article>
//             ))}
//           </div>

//           {/* Quick Links - Mobile */}
//           <div className="flex flex-wrap gap-2 justify-center">
//             <Link
//               href="/sports/football"
//               className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//             >
//               Football
//             </Link>
//             <Link
//               href="/sports/basketball"
//               className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//             >
//               Basketball
//             </Link>
//             <Link
//               href="/sports/tennis"
//               className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//             >
//               Tennis
//             </Link>
//           </div>
//         </div>

//         {/* Desktop Layout - Grid */}
//         <div className="hidden lg:block">
//           <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
//             {/* Featured Post - Desktop */}
//             {featuredPost && (
//               <div className="xl:col-span-2">
//                 <article className="bg-card dark:bg-gray-card rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
//                   <Link
//                     href={`/blogs/${featuredPost.slug?.current || "#"}`}
//                     className="block"
//                   >
//                     <div className="relative h-64">
//                       <StaticImage
//                         image={featuredPost.mainImage}
//                         alt={featuredPost.title}
//                         className="w-full h-full object-cover"
//                         loading="eager"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
//                       <div className="absolute top-4 left-4">
//                         <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
//                           Featured
//                         </span>
//                       </div>
//                     </div>
//                   </Link>

//                   <div className="p-6">
//                     <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
//                       <div className="flex items-center gap-2">
//                         {featuredPost.author?.image && (
//                           <StaticImage
//                             image={featuredPost.author.image}
//                             alt={featuredPost.author?.name || "Author"}
//                             className="rounded-full h-6 w-6"
//                           />
//                         )}
//                         <span>
//                           {featuredPost.author?.name || "Staff Writer"}
//                         </span>
//                       </div>
//                       <span>•</span>
//                       <div className="flex items-center gap-1">
//                         <Calendar size={14} />
//                         <time>{formatTimeShort(featuredPost._updatedAt)}</time>
//                       </div>
//                     </div>

//                     <Link href={`/blogs/${featuredPost.slug?.current || "#"}`}>
//                       <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-red-600 dark:hover:text-red-400 transition-colors">
//                         {featuredPost.title}
//                       </h3>
//                     </Link>

//                     <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
//                       {featuredPost.excerpt ||
//                         "Get the latest updates and analysis from the world of sports."}
//                     </p>

//                     <Link
//                       href={`/blogs/${featuredPost.slug?.current || "#"}`}
//                       className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium hover:underline"
//                     >
//                       Read full story
//                       <ChevronRight size={16} />
//                     </Link>
//                   </div>
//                 </article>
//               </div>
//             )}

//             {/* Sidebar Posts - Desktop */}
//             <div className="xl:col-span-2 space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-700 dark:border-gray-700 pb-2">
//                 Latest Updates
//               </h3>

//               {sidebarPosts.map((post) => (
//                 <article
//                   key={post._id}
//                   className="flex gap-4 p-3 bg-card dark:bg-card rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
//                 >
//                   <Link
//                     href={`/blogs/${post.slug?.current || "#"}`}
//                     className="flex-shrink-0"
//                   >
//                     <StaticImage
//                       image={post.mainImage}
//                       alt={post.title}
//                       className="w-20 h-16 rounded object-cover"
//                     />
//                   </Link>

//                   <div className="flex-1 min-w-0">
//                     <Link href={`/blogs/${post.slug?.current || "#"}`}>
//                       <h4 className="font-semibold text-md  text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
//                         {post.title}
//                       </h4>
//                     </Link>

//                     <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//                       <span>{post.author?.name || "Staff"}</span>
//                       <span>•</span>
//                       <time>{formatTimeShort(post._updatedAt)}</time>
//                     </div>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* CTA Button - Both Mobile & Desktop */}
//         <div className="text-center mt-8">
//           <Link
//             href="/sports"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
//           >
//             <Trophy size={18} />
//             View All Sports News
//             <ChevronRight size={18} />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SportsNews;
