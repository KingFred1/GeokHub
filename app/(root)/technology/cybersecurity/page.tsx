import SubCatSkeleton from "@/components/global/skeleton/SubCatSkeleton";
import MasonryGrid from "@/components/World";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_CATEGORY_SLUG } from "@/sanity/lib/queries";
import { Suspense } from "react";
import { Shield, Lock, Fingerprint, Network, Bug, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour
// // or
// export const revalidate = 1800; // 30 minutes
// // or  
// export const revalidate = 900; // 15 minutes

// Server component that fetches data
async function CybersecurityContent() {
  const mainBlogs = await client.fetch(
    BLOG_BY_CATEGORY_SLUG,
    { slug: "cybersecurity" },
    {
      cache: "no-store",
      next: {
        tags: ["technology/cybersecurity"],
        revalidate: 3600,
      },
    }
  );
  return <MasonryGrid posts={mainBlogs} />;
}

// Client component for the interactive parts
function CybersecurityClient() {
  return (
    <div className="min-h-screen bg-background">
      

      {/* Main Content Section */}
      <main className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="my-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-lg mb-6">
            <AlertTriangle className="h-5 w-5 text-yellow-500 animate-pulse" />
            <span className="text-xl font-medium text-gray-900 dark:text-white">
              Security Security
            </span>
          </div>
          
        
        </div>

        {/* Content Grid */}
        <Suspense fallback={<SubCatSkeleton />}>
          <CybersecurityContent />
        </Suspense>

       
      </main>

      {/* Floating Security Elements */}
      <div className="fixed top-20 right-10 w-8 h-8 bg-indigo-400 rounded-full blur-xl opacity-40 animate-float-slow"></div>
      <div className="fixed bottom-40 left-5% w-6 h-6 bg-blue-400 rounded-full blur-xl opacity-30 animate-float-medium delay-2000"></div>
      <div className="fixed top-1/3 left-15% w-4 h-4 bg-cyan-400 rounded-full blur-xl opacity-50 animate-float-fast delay-1000"></div>

     
    </div>
  );
}

// Main page component (server component)
export default function Cybersecurity() {
  return <CybersecurityClient />;
}

export const metadata = {
  title: "Cybersecurity - Latest Threats, Protection Strategies & Best Practices",
  description: "Stay updated on the latest cybersecurity threats, defense mechanisms, encryption technologies, and industry best practices to protect your digital assets.",
  keywords: ["cybersecurity", "network security", "encryption", "threat detection", "data protection", "cyber threats"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};