import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geokhub.com";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // dev webpack tweaks --------------------------------------------------
  webpack(config, options) {
    // Avoid embedding full absolute paths in source maps; this sidesteps
    // parentheses problems entirely by using resourcePath only.
    if (config.output) {
      config.output.devtoolModuleFilenameTemplate = (info: any) =>
        // normalize windows backslashes and drop leading drive letters
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

  // async rewrites() {
  //   return [
  //     {
  //       source: '/ads.txt',
  //       destination: 'https://srv.adstxtmanager.com/19390/geokhub.com',
  //     },
  //   ];
  // },

  // compress: true,
  // poweredByHeader: false,
  // trailingSlash: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // {
          //   key: "Cache-Control",
          //   value: "public, max-age=3600, stale-while-revalidate=60",
          // },
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
