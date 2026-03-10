import { client } from "@/sanity/lib/client";
import { BLOGS_BY_CATEGORY_SLUGS, LIFESTYLE_CATEGORIES } from "@/sanity/lib/queries";
import LifestyleServer from "@/components/category/LifestyleServer";
import { Category, Post } from "@/type";
import { Metadata } from "next";

interface LifestylePageProps {
  params: Promise<{ category?: string[] }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 2592000; // 1 hour
// // or
// export const revalidate = 1800; // 30 minutes
// // or  
// export const revalidate = 900; // 15 minutes

export async function generateMetadata({ params }: LifestylePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  // Join all category segments for nested categories, e.g. ["mentalhealth"] or ["wellness", "subcat"]
  const categorySegments = resolvedParams.category || ["lifestyle"];
  const categorySlug = categorySegments.join("/");

  // Map for top-level categories only
  const categoryTitles: Record<string, string> = {
    lifestyle: "Lifestyle & Wellness",
    mentalhealth: "Mental Health",
    wellness: "Wellness",
    weightloss: "Weight Loss",
  };

  // Use the first segment for title/description
  const topCategory = categorySegments[0] || "lifestyle";
  const title = categoryTitles[topCategory] || "Lifestyle";
  const descriptionMap: Record<string, string> = {
    lifestyle: "Discover inspiration for living well - from mental health and wellness to weight loss, and personal growth",
    mentalhealth: "Explore mental health tips, strategies for wellbeing, and resources for mental wellness",
    wellness: "Discover wellness practices, self-care routines, and holistic health approaches",
    weightloss: "Find effective weight loss strategies, fitness tips, and healthy lifestyle changes",
  };

  return {
    title: `${title} - Health & Wellness Articles`,
    description: descriptionMap[topCategory] || "Discover inspiration for living well",
    keywords: [categorySlug, 'lifestyle', 'health', 'wellness', 'mental health', 'weight loss'],
    openGraph: {
      title: `${title} - Health & Wellness Articles`,
      description: descriptionMap[topCategory] || "Discover inspiration for living well",
      type: 'website',
      url: `https://geokhub.com/lifestyles/${categorySlug}`,
    },
    alternates: {
      canonical: `https://geokhub.com/lifestyles/${categorySlug}`
    }
  };
}

async function LifestyleContent({ params }: LifestylePageProps) {
  const resolvedParams = await params;
  // Join all category segments for nested categories
  const categorySegments = resolvedParams.category || ["lifestyle"];
  const categorySlug = categorySegments.join("/");

  // Fetch posts for the full slug (e.g. "mentalhealth" or "wellness/subcat")
  const [posts, lifestyleCategories] = await Promise.all([
    client.fetch<Post[]>(BLOGS_BY_CATEGORY_SLUGS, { slugs: [categorySlug] }),
    client.fetch<Category[]>(LIFESTYLE_CATEGORIES)
  ]);

  // Manually add the main lifestyle category if not included
  const allCategories: Category[] = [
    {
      _id: "lifestyle-main",
      title: "Lifestyle",
      slug: "lifestyle",
      parent: undefined
    },
    ...(lifestyleCategories || [])
  ].filter((cat, index, self) => 
    index === self.findIndex(c => c.slug === cat.slug)
  );

  return (
    <LifestyleServer 
      categorySlug={categorySlug}
      initialPosts={posts || []} 
      lifestyleCategories={allCategories || []} 
    />
  );
}

export default async function LifestylePage(props: LifestylePageProps) {
  return (
    <div className="w-full min-h-screen relative overflow-hidden px-4 md:px-4 lg:px-20 mt-4">
      <div className="max-w-7xl mx-auto">
        <LifestyleContent {...props} />
      </div>
    </div>
  );
}
