import SubCatSkeleton from '@/components/global/skeleton/SubCatSkeleton';
import MasonryGrid from '@/components/World';
import { client } from '@/sanity/lib/client';
import { BLOG_BY_CATEGORY_SLUG } from '@/sanity/lib/queries';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function WorldContent() {
  const posts = await client.fetch(
    BLOG_BY_CATEGORY_SLUG, 
    { slug: "world" },
    { cache: 'no-store' }
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <header className="text-center py-12 border-b">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          World News
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Breaking news, features, and analysis from around the world
        </p>
        
        {/* Live Badge */}
        <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full mt-6">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
          LIVE UPDATES
        </div>
      </header>

      {/* Trending Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
          <span className="text-sm text-gray-500">Updated 5m ago</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { number: "127+", label: "Countries", color: "bg-blue-50 text-blue-800" },
            { number: "24/7", label: "Coverage", color: "bg-green-50 text-green-800" },
            { number: "50K+", label: "Sources", color: "bg-purple-50 text-purple-800" },
            { number: "Live", label: "Reports", color: "bg-red-50 text-red-800" },
          ].map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg text-center ${stat.color}`}>
              <div className="text-lg font-bold">{stat.number}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Unit - Leaderboard */}
      <div className="bg-gray-100 rounded-lg p-8 text-center mb-8">
        <p className="text-sm text-gray-500 mb-2">Advertisement</p>
        <div className="h-20 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500">Leaderboard Ad (728×90)</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest World News</h2>
          <span className="text-sm text-gray-500">{posts.length} articles</span>
        </div>

        <MasonryGrid posts={posts} />
      </section>

      {/* Ad Unit - Rectangle */}
      <div className="bg-gray-100 rounded-lg p-8 text-center my-8">
        <p className="text-sm text-gray-500 mb-2">Advertisement</p>
        <div className="h-250 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500">Rectangle Ad (300×250)</span>
        </div>
      </div>

      {/* Newsletter */}
      <section className="bg-blue-50 rounded-xl p-8 my-12">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Informed</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get the latest world news delivered to your inbox daily
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function World() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SubCatSkeleton />}>
          <WorldContent />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'World News | Breaking International News & Updates',
  description: 'Latest world news, breaking stories, and in-depth analysis from across the globe. Stay informed with comprehensive international coverage.',
  keywords: 'world news, international news, breaking news, global affairs, current events',
};