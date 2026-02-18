// import { urlFor } from "@/sanity/lib/image";
// import { Post } from "@/sanity/types";
// import { ChevronRight } from "lucide-react";
// import Link from "next/link";
// import HomeBlog from "./HomeBlog";
// import CardOptions from "./global/CardOptions";
// import LikeButton from "./global/LikeButton";
// import CommentCount from "./global/CommentCount";

// function formatTimeShort(dateString: string): string {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//   if (diffInSeconds < 60) return "just now";
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) return `${diffInMinutes}m`;
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) return `${diffInHours}h`;
//   const diffInDays = Math.floor(diffInHours / 24);
//   return `${diffInDays}d`;
// }

// interface EntertainmentSectionProps {
//   post: Post[];
// }

// const EntertainmentSection = ({ post }: EntertainmentSectionProps) => {
//   if (!post || post.length === 0) return null;

//   return (
//     <div className="pb-5 mt-5 lg:border-t-2 md:border-t-2 border-gray-500 md:rounded-lg overflow-hidden">
//       <div className="flex md:gap-5 gap-1.5">
//         <Link 
//           href="/entertainment" 
//           className="font-bold md:text-2xl text-xl pl-2 text-dark dark:text-gray-200 flex"
//         >
//           Entertainment
//           <ChevronRight size={35} />
//         </Link>
//         <div className="scroll-hidden max-w-full flex flex-row overflow-x-auto gap-2">
//           {/* Optional: Add category links if needed */}
//         </div>
//       </div>

//       {/* Mobile view: show 7 posts using HomeBlog */}
//       <div className="block md:hidden grid grid-cols-1 gap-3 mt-3">
//         {post.slice(0, 7).map((p) => (
//           <HomeBlog key={p._id} post={p} />
//         ))}
//       </div>

//       {/* Desktop layout */}
//       <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 md:gap-4 gap-1.5 md:mt-0 mt-1.5">
//         {post[0] && (
//           <div className="group bg-card shadow border-card md:rounded-lg relative lg:block">
//             <div className="relative h-52">
//               <CardOptions post={post[0]} />
//               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
//               <Link href={`/blog/${post[0].slug?.current}`} className="block h-full">
//                 <img
//                   src={post[0].mainImage?.asset ? urlFor(post[0].mainImage).url() : "/fallback.jpg"}
//                   alt={post[0].title}
//                   className="object-cover md:rounded-t-md"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 />
//               </Link>
//             </div>
//             <div className="flex items-center gap-2 p-2 text-sm text-gray-600 dark:text-gray-400">
//               {post[0].author?.image && (
//                 <img
//                   src={urlFor(post[0].author.image).url()}
//                   alt={post[0].author.name}
//                   className="rounded-full h-6 w-6"
//                   loading="lazy"
//                 />
//               )}
//               <span>
//                 {post[0].author?.name} · <time dateTime={post[0]._createdAt}>{formatTimeShort(post[0]._createdAt)}</time>
//               </span>
//             </div>
//             <div className="px-3 w-full">
//               <Link href={`/blog/${post[0].slug?.current}`}>
//                 <h2 className="md:text-md text-md font-semibold line-clamp-3">{post[0].title}</h2>
//               </Link>
//             </div>
//             <div className="p-3 flex items-center gap-2 mt-1">
//               <LikeButton postId={post[0]._id} />
//               <Link href={`/blog/${post[0].slug?.current}/#comments`}>
//                 <CommentCount postId={post[0]._id} />
//               </Link>
//             </div>
//           </div>
//         )}

//         {[post.slice(1, 4), post.slice(4, 7)].map((group, i) => (
//           <div key={i} className="md:space-y-0 space-y-3 relative bg-card md:rounded-md shadow border-card">
//             {group.map((item) => (
//               <div key={item._id} className="bg-card md:p-3 border-b md:rounded-md">
//                 <div className="grid group grid-cols-12 gap-3 items-center py-0.5">
//                   <div className="relative md:col-span-4 col-span-12 md:h-full h-52 md:order-2">
//                     <CardOptions post={item} />
//                     <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
//                     <Link href={`/blog/${item.slug?.current}`} className="block w-full h-full">
//                       <img
//                         src={item.mainImage?.asset ? urlFor(item.mainImage).url() : "/fallback.jpg"}
//                         alt={item.title}
//                         className="aspect-[4/3] w-full md:h-[15vh] h-full object-cover md:rounded-md"
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//                       />
//                     </Link>
//                   </div>
//                   <div className="md:col-span-8 col-span-12 md:px-0 px-2 relative">
//                     <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
//                       {item.author?.image && (
//                         <img
//                           src={urlFor(item.author.image).url()}
//                           alt={item.author.name}
//                           className="rounded-full h-6 w-6"
//                           loading="lazy"
//                         />
//                       )}
//                       <span>
//                         {item.author?.name} · <time dateTime={item._createdAt}>{formatTimeShort(item._createdAt)}</time>
//                       </span>
//                     </div>
//                     <Link href={`/blog/${item.slug?.current}`}>
//                       <h3 className="font-semibold md:text-sm text-lg line-clamp-2 md:p-0 p-2 md:mt-1">{item.title}</h3>
//                     </Link>
//                     <div className="md:p-0 p-3 flex items-center gap-2 md:mt-2">
//                       <LikeButton postId={item._id} />
//                       <Link href={`/blog/${item.slug?.current}/#comments`}>
//                         <CommentCount postId={item._id} />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EntertainmentSection;