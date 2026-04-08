export default function NewsPage() {
  return (
    <div className="w-full min-h-screen relative overflow-hidden md:px-4 lg:px-16 px-0 mt-4">
      <div className="max-w-7xl mx-auto py-16 text-center">
        <h1 className="text-3xl font-semibold">News</h1>
        <p className="mt-4 text-base text-muted-foreground">
          This page is temporarily unavailable while the news feed is being rebuilt.
        </p>
      </div>
    </div>
  );
}







// import NewsClient from "@/components/category/NewsClient";
// import { client } from "@/sanity/lib/client";
// import { BLOGS_BY_NEWS_SLUGS, NEWS_CATEGORIES } from "@/sanity/lib/queries";
// import { Category, Post } from "@/type";

// export const dynamic = "force-dynamic";
// export const revalidate = 2592000;

// export async function generateMetadata() {
//   return {
//     title: "Latest News - Breaking News, World & Business",
//     description:
//       "Stay updated with the latest breaking news, world events, and business reports. Trusted news coverage 24/7 across categories.",
//     keywords: ["news", "breaking news", "world news", "business news"],
//   };
// }

// async function NewsContent() {
//   const newsSlugs = ["news", "latest", "world", "business"];

//   const [posts, newsCategories] = await Promise.all([
//     client.fetch<Post[]>(BLOGS_BY_NEWS_SLUGS, { slugs: newsSlugs }),
//     client.fetch<Category[]>(NEWS_CATEGORIES),
//   ]);

//   const allCategories: Category[] = [
//     { _id: "news-main", title: "News", slug: "news", parent: undefined },
//     ...(newsCategories || []),
//   ].filter((cat, index, self) => index === self.findIndex((c) => c.slug === cat.slug));

//   return <NewsClient initialPosts={posts || []} newsCategories={allCategories || []} />;
// }

// export default function NewsPage() {
//   return (
//     <div className="w-full min-h-screen relative overflow-hidden md:px-4 lg:px-16 px-0 mt-4">
//       <div className="max-w-7xl mx-auto">
//         <NewsContent />
//       </div>
//     </div>
//   );
// }
