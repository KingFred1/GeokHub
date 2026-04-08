export default function CloudDevOpsPage() {
  return (
    <div className="w-full min-h-screen relative overflow-hidden md:px-4 lg:px-16 px-0 mt-4">
      <div className="max-w-7xl mx-auto py-16 text-center">
        <h1 className="text-3xl font-semibold">Cloud & DevOps</h1>
        <p className="mt-4 text-base text-muted-foreground">
          This page is temporarily unavailable while the Cloud & DevOps feed is being rebuilt.
        </p>
      </div>
    </div>
  );
}




// import MasonryGrid from "@/components/World";
// import { client } from "@/sanity/lib/client";
// import { BLOG_BY_CATEGORY_SLUG } from "@/sanity/lib/queries";
// import { Cloud, TrendingUp, Calendar } from "lucide-react";
// import Link from "next/link";
// import { urlFor } from "@/sanity/lib/image";

// export const dynamic = "force-dynamic";
// export const revalidate = 2592000;

// function formatTimeShort(dateString: string): string {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//   if (diffInSeconds < 60) return "just now";
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) return `${diffInHours}h ago`;
//   return `${Math.floor(diffInHours / 24)}d ago`;
// }

// function getPostDetailUrl(post: Post): string {
//   // Check if post has categories
//   if (!post.categories || post.categories.length === 0) {
//     return `/blogs/${post.slug?.current}`;
//   }

//   // Check each category for "news" or "world"
//   for (const category of post.categories) {
//     const categoryTitle = category.title?.toLowerCase();
//     const categorySlug = category.slug?.current?.toLowerCase();
    

//     if (categoryTitle === "cloud-devops" || categorySlug === "cloud-devops") {
//       return `/technology/cloud-devops/${post.slug?.current}`;
//     }

    
//     // Also check parent category if exists
//     if (category.parent) {
//       const parentTitle = category.parent.title?.toLowerCase();
//       const parentSlug = category.parent.slug?.current?.toLowerCase();
      
//       if (parentTitle === "cloud-devops" || parentSlug === "cloud-devops") {
//         return `/technology/cloud-devops/${post.slug?.current}`;
//       }
      
  
//     }
//   }

//   // Default to /blogs/ if no specific category matches
//   return `/blogs/${post.slug?.current}`;
// }


// // Entire page rendered on server to avoid Suspense
// export default async function CloudDevOpsPage() {
//   const mainBlogs = await client.fetch(
//     BLOG_BY_CATEGORY_SLUG,
//     { slug: "cloud-devops" },
//     {
//       cache: "no-store",
//       next: {
//         tags: ["technology/cloud-devops"],
//         revalidate: 2592000,
//       },
//     }
//   );

//   const trendingPosts = mainBlogs?.slice(0, 4) || [];

//   function formatTimeShort(dateString: string): string {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//     if (diffInSeconds < 60) return "just now";
//     const diffInMinutes = Math.floor(diffInSeconds / 60);
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours}h ago`;
//     return `${Math.floor(diffInHours / 24)}d ago`;
//   }

//   function getPostDetailUrl(post: any): string {
//     if (!post.categories || post.categories.length === 0) {
//       return `/blogs/${post.slug?.current}`;
//     }
//     for (const category of post.categories) {
//       const categoryTitle = category.title?.toLowerCase();
//       const categorySlug = category.slug?.current?.toLowerCase();
//       if (categoryTitle === "cloud-devops" || categorySlug === "cloud-devops") {
//         return `/technology/cloud-devops/${post.slug?.current}`;
//       }
//       if (category.parent) {
//         const parentTitle = category.parent.title?.toLowerCase();
//         const parentSlug = category.parent.slug?.current?.toLowerCase();
//         if (parentTitle === "cloud-devops" || parentSlug === "cloud-devops") {
//           return `/technology/cloud-devops/${post.slug?.current}`;
//         }
//       }
//     }
//     return `/blogs/${post.slug?.current}`;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Trending Section */}
//       <section className="py-4 bg-background">
//         <div className="px-0 md:px-0 lg:px-8">
//           <div className="flex items-center justify-between mb-4">
//             <Link href="/technology/cloud-devops" className="hover:underline text-xl md:text-xl font-semibold text-gray-900 dark:text-white flex items-center md:px-0 px-2">
//               <TrendingUp className="h-6 w-6 mr-2 text-purple-600" />
//               Trending Cloud & DevOps Topics
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {trendingPosts.length > 0 ? (
//               trendingPosts.map((post: any) => (
//                 <Link key={post._id} href={getPostDetailUrl(post)}>
//                   <article className="bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
//                     <div className="relative h-48 overflow-hidden">
//                       <img
//                         src={post.mainImage?.asset ? urlFor(post.mainImage).url() : "/fallback-image.jpg"}
//                         alt={post.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//                       <div className="absolute top-4 left-4">
//                         <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
//                           {post.categories?.[0]?.title || 'Cloud & DevOps'}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="py-2 md:px-2 px-4">
//                       <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-3">
//                         {post.author?.image && (
//                           <img
//                             src={urlFor(post.author.image).url()}
//                             alt={post.author.name}
//                             className="rounded-full h-6 w-6"
//                           />
//                         )}
//                         <span className="font-medium">{post.author?.name}</span>
//                         <span>•</span>
//                         <Calendar size={12} />
//                         <span>{formatTimeShort(post._createdAt)}</span>
//                       </div>
//                       <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2 line-clamp-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-3">
//                         {post.title}
//                       </h3>
//                       {post.excerpt && (
//                         <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
//                           {post.excerpt}
//                         </p>
//                       )}
//                     </div>
//                   </article>
//                 </Link>
//               ))
//             ) : (
//               [1, 2, 3].map((item) => (
//                 <div key={item} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm">
//                   <div className="animate-pulse">
//                     <div className="w-14 h-14 bg-gray-300 rounded-lg mb-4"></div>
//                     <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//                     <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
//                     <div className="h-3 bg-gray-300 rounded w-2/3"></div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Main Content Section */}
//       <section className="py-6">
//         <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-8">
//           <div className="text-center mb-6">
//             <Link href="/technology/cloud-devops" className="hover:underline text-xl md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
//               Cloud Infrastructure & DevOps Practices
//             </Link>
//           </div>
//           {mainBlogs?.length > 3 ? (
//             <MasonryGrid posts={mainBlogs.slice(4)} />
//           ) : (
//             <div className="text-center py-12">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
//                 <Cloud className="h-8 w-8 text-purple-600" />
//               </div>
//               <p className="text-gray-600 text-lg">
//                 No cloud & DevOps updates available. Check back later for the latest infrastructure insights!
//               </p>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// export const metadata = {
//   title: "Cloud & DevOps | AWS, Azure, Kubernetes, Docker & CI/CD",
//   description: "Master cloud infrastructure, DevOps practices, containerization, and CI/CD pipelines with expert guides on AWS, Azure, Kubernetes, and Docker.",
//   keywords: ["cloud computing", "devops", "aws", "azure", "kubernetes", "docker", "ci/cd", "infrastructure", "microservices"],
// };