// import { client } from "@/sanity/lib/client";
// import { BLOGS_BY_CATEGORY_SLUGS, LIFESTYLE_CATEGORIES } from "@/sanity/lib/queries";
// import LifestyleServer from "@/components/category/LifestyleServer";
// import { Category, Post } from "@/type";
// import { Metadata } from "next";
// import { notFound } from "next/navigation";

// interface LifestylePageProps {
//   params: Promise<{ slug?: string[] }>;
// }

// export const dynamic = 'force-dynamic';
// export const revalidate = 2592000; // 30 days

// export async function generateMetadata({ params }: LifestylePageProps): Promise<Metadata> {
//   const resolvedParams = await params;
//   const slugSegments = resolvedParams.slug || ["lifestyle"];
//   const categorySlug = slugSegments.join("/");

//   const validCategories = ['lifestyle', 'mentalhealth', 'wellness', 'weightloss'];
//   const topCategory = slugSegments[0];
  
//   if (topCategory && !validCategories.includes(topCategory) && topCategory !== 'lifestyle') {
//     return {
//       title: "Page Not Found",
//       robots: { index: false, follow: false }
//     };
//   }

//   const categoryTitles: Record<string, string> = {
//     lifestyle: "Lifestyle & Wellness",
//     mentalhealth: "Mental Health",
//     wellness: "Wellness",
//     weightloss: "Weight Loss",
//   };

//   const title = categoryTitles[topCategory] || "Lifestyle";
//   const descriptionMap: Record<string, string> = {
//     lifestyle: "Discover inspiration for living well - from mental health and wellness to weight loss, and personal growth",
//     mentalhealth: "Explore mental health tips, strategies for wellbeing, and resources for mental wellness",
//     wellness: "Discover wellness practices, self-care routines, and holistic health approaches",
//     weightloss: "Find effective weight loss strategies, fitness tips, and healthy lifestyle changes",
//   };

//   return {
//     title: `${title} - Health & Wellness Articles`,
//     description: descriptionMap[topCategory] || "Discover inspiration for living well",
//     keywords: [categorySlug, 'lifestyle', 'health', 'wellness', 'mental health', 'weight loss'],
//     openGraph: {
//       title: `${title} - Health & Wellness Articles`,
//       description: descriptionMap[topCategory] || "Discover inspiration for living well",
//       type: 'website',
//       url: `https://geokhub.com/lifestyle/category/${categorySlug}`,
//     },
//     alternates: {
//       canonical: `https://geokhub.com/lifestyle/category/${categorySlug}`
//     }
//   };
// }

// async function LifestyleContent({ params }: LifestylePageProps) {
//   const resolvedParams = await params;
//   const slugSegments = resolvedParams.slug || ["lifestyle"];
//   const categorySlug = slugSegments.join("/");

//   const validCategories = ['lifestyle', 'mentalhealth', 'wellness', 'weightloss'];
//   const topCategory = slugSegments[0];
  
//   if (topCategory && !validCategories.includes(topCategory) && categorySlug !== 'lifestyle') {
//     notFound();
//   }

//   const [posts, lifestyleCategories] = await Promise.all([
//     client.fetch<Post[]>(BLOGS_BY_CATEGORY_SLUGS, { slugs: [categorySlug] }),
//     client.fetch<Category[]>(LIFESTYLE_CATEGORIES)
//   ]);

//   const allCategories: Category[] = [
//     {
//       _id: "lifestyle-main",
//       title: "Lifestyle",
//       slug: "lifestyle",
//       parent: undefined
//     },
//     ...(lifestyleCategories || [])
//   ].filter((cat, index, self) => 
//     index === self.findIndex(c => c.slug === cat.slug)
//   );

//   return (
//     <LifestyleServer 
//       categorySlug={categorySlug}
//       initialPosts={posts || []} 
//       lifestyleCategories={allCategories || []} 
//     />
//   );
// }

// export default async function LifestylePage(props: LifestylePageProps) {
//   return (
//     <div className="w-full min-h-screen relative overflow-hidden px-4 md:px-4 lg:px-20 mt-4">
//       <div className="max-w-7xl mx-auto">
//         <LifestyleContent {...props} />
//       </div>
//     </div>
//   );
// }


