// "use client";

// import { Newspaper, Clock, TrendingUp, Calendar, Eye, Share2, RefreshCw } from "lucide-react";
// import { useState } from "react";

// interface NewsPageLayoutProps {
//   children: React.ReactNode;
//   postsCount: number;
//   hasBreakingNews?: boolean;
//   breakingNewsTitle?: string;
// }

// export default function NewsPageLayout({ 
//   children, 
//   postsCount, 
//   hasBreakingNews = false, 
//   breakingNewsTitle = "" 
// }: NewsPageLayoutProps) {
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     setTimeout(() => {
//       window.location.reload();
//     }, 1000);
//   };

//   return (
//     <>
//       {/* Hero Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 mb-8 rounded-2xl">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <div className="flex items-center justify-center mb-4">
//             <Newspaper className="h-10 w-10 mr-3" />
//             <h1 className="text-4xl md:text-5xl font-bold">Latest News</h1>
//           </div>
//           <p className="text-lg text-blue-100 max-w-2xl mx-auto">
//             Stay informed with breaking news, current events, and in-depth reporting from around the world
//           </p>
//           <div className="flex items-center justify-center mt-4 text-blue-200 text-sm">
//             <Clock className="h-4 w-4 mr-1" />
//             <span>Updated every minute</span>
//           </div>
//         </div>
//       </div>

//       {/* Breaking News Banner */}
//       {hasBreakingNews && breakingNewsTitle && (
//         <div className="bg-red-600 text-white py-3 px-4 mb-8 rounded-lg flex items-center">
//           <TrendingUp className="h-5 w-5 mr-2 animate-pulse" />
//           <span className="font-semibold">BREAKING:</span>
//           <span className="ml-2 truncate">{breakingNewsTitle}</span>
//         </div>
//       )}

//       {/* Refresh Button for empty state */}
//       {postsCount === 0 && (
//         <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl mb-8">
//           <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
//             No news available at the moment
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 mb-4">
//             Our team is working on bringing you the latest updates.
//           </p>
//           <button
//             onClick={handleRefresh}
//             disabled={isRefreshing}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//           >
//             <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//             {isRefreshing ? 'Refreshing...' : 'Refresh Page'}
//           </button>
//         </div>
//       )}

//       {/* Main Content */}
//       {children}


//       {/* News Stats */}
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//           <div>
//             <div className="text-2xl font-bold text-blue-600">24/7</div>
//             <div className="text-sm text-gray-600 dark:text-gray-400">News Coverage</div>
//           </div>
//           <div>
//             <div className="text-2xl font-bold text-green-600">100+</div>
//             <div className="text-sm text-gray-600 dark:text-gray-400">Sources</div>
//           </div>
//           <div>
//             <div className="text-2xl font-bold text-purple-600">50k+</div>
//             <div className="text-sm text-gray-600 dark:text-gray-400">Readers</div>
//           </div>
//           <div>
//             <div className="text-2xl font-bold text-orange-600">Instant</div>
//             <div className="text-sm text-gray-600 dark:text-gray-400">Updates</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }