import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geokhub.com";

const nextConfig: NextConfig = {
  turbopack: {},

  typescript: {
    ignoreBuildErrors: true,
  },

  webpack(config, options) {
    if (config.output) {
      config.output.devtoolModuleFilenameTemplate = (info: any) =>
        `webpack:///${info.resourcePath.replace(/\\/g, "/")}`;
    }
    return config;
  },

  images: {
    domains: ["cdn.sanity.io", "lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "developers.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // Permanent 301 redirects for URL structure changes
  async redirects() {
    return [
      {
        source: '/technology',
        destination: '/technology/tech-news',
        permanent: true,
      },
      // Only redirect specific category slugs, not all slugs
      {
        source: '/lifestyle/mentalhealth',
        destination: '/lifestyle/category/mentalhealth',
        permanent: true,
      },
      {
        source: '/lifestyle/wellness',
        destination: '/lifestyle/category/wellness',
        permanent: true,
      },
      {
        source: '/lifestyle/weightloss',
        destination: '/lifestyle/category/weightloss',
        permanent: true,
      },
      // Redirect the main lifestyle page
      {
        source: '/lifestyle',
        destination: '/lifestyle/category/lifestyle',
        permanent: true,
      },
      // Remove the catch-all redirect that's causing issues
      // {
      //   source: '/lifestyle/:slug',
      //   destination: '/lifestyle/post/:slug',
      //   permanent: true,
      // },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
        ],
      },
      {
        source: "/sitemap-news.xml",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
    ];
  },
};

export default nextConfig;