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
        source: '/sitemap-new.xml',
        destination: '/sitemap-index.xml',
        permanent: true,
      },
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
        source: "/robots.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
    ];
  },
};

export default nextConfig;