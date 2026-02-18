import SubCatSkeleton from "@/components/global/skeleton/SubCatSkeleton";
import MasonryGrid from "@/components/World";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_CATEGORY_SLUG } from "@/sanity/lib/queries";
import { Suspense } from "react";
import {
  Brain,
  Cpu,
  Sparkles,
  Binary,
  CloudCog,
  Network,
} from "lucide-react";
import { NewsletterForm } from "@/components/global/Newsletter-form";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 1 day
// // or
// export const revalidate = 1800; // 30 minutes
// // or  
// export const revalidate = 900; // 15 minutes

// Server component that fetches data
async function AIContent() {
  const mainBlogs = await client.fetch(
    BLOG_BY_CATEGORY_SLUG,
    { slug: "ai" },
    {
      cache: "no-store",
      next: {
        tags: ["technology/ai"],
        revalidate: 3600,
      },
    }
  );
  return <MasonryGrid posts={mainBlogs} />;
}

export default function AI() {
  return (
    <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white my-4">
              Artificial Intelligence
            </h1>        
        </div>

      {/* Main Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Content Grid */}
        <Suspense fallback={<SubCatSkeleton />}>
          <AIContent />
        </Suspense>

        {/* Animated CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
            </div>

            <div className="relative z-10">
              <CloudCog className="h-16 w-16 text-white mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Never Miss an AI Update
              </h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of AI enthusiasts staying informed about the
                latest breakthroughs
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <div className="bg-card rounded-2xl p-6 text-white">
                  <NewsletterForm
                    variant="inline"
                    title="Weekly Updates"
                    description="Get the latest news and insights delivered to your inbox."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Elements */}
      <div className="fixed top-20 right-10 w-8 h-8 bg-blue-400 rounded-full blur-xl opacity-40 animate-float-slow"></div>
      <div className="fixed bottom-40 left-5% w-6 h-6 bg-purple-400 rounded-full blur-xl opacity-30 animate-float-medium delay-2000"></div>
      <div className="fixed top-1/3 left-15% w-4 h-4 bg-cyan-400 rounded-full blur-xl opacity-50 animate-float-fast delay-1000"></div>
    </div>
  );
}

export const metadata = {
  title: "Artificial Intelligence - Cutting Edge AI Research & Insights",
  description:
    "Discover the latest breakthroughs in artificial intelligence, machine learning, neural networks, and AI applications. Stay ahead of the curve with cutting-edge insights.",
  keywords: [
    "artificial intelligence",
    "AI",
    "machine learning",
    "neural networks",
    "deep learning",
    "AI research",
    "computer vision",
    "NLP",
  ],
};
