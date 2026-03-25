import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { SanityLive } from "@/sanity/lib/live";
import ClientProviders from "@/components/ClientProviders";
import { ThemeProvider } from "@/provider/theme-provider";
import FloatingKofi from "@/components/FloatingKofi";
import AdSenseProvider from '@/components/adsense/AdSenseProvider';
import CookieConsent from '@/components/adsense/CookieConsent';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const SITE_URL = "https://www.geokhub.com";

// Social Media Profiles
const SOCIAL_PROFILES = {
  twitter: "https://x.com/geokhub",
  linkedin: "https://linkedin.com/company/geokhub",
  facebook: "https://facebook.com/geokhub",
};

// Structured Data Component
function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GeokHub",
    url: SITE_URL,
    description:
      "Your trusted source for AI updates, software guides, tech news, and digital wellness tips for balanced modern living.",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icons/geokhub.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      SOCIAL_PROFILES.twitter,
      SOCIAL_PROFILES.linkedin,
      SOCIAL_PROFILES.facebook,
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export const metadata: Metadata = {
  title: {
    default: "GeokHub - Tech Insights & Digital Lifestyle",
    template: "%s | GeokHub",
  },
  description:
    "Your trusted source for AI updates, software guides, tech news, and digital wellness tips for balanced modern living.",
  keywords: [
    "tech news",
    "AI",
    "gadgets",
    "digital lifestyle",
    "software",
    "reviews",
    "apps",
    "tutorials",
    "how-to guides",
    "technology trends",
    "productivity",
    "cybersecurity",
    "programming",
    "coding",
    "web development",
    "mobile apps",
    "tech tips",
    "digital wellness",
    "internet culture",
    "emerging tech",
    "tech events",
    "innovation",
  ],
  authors: [{ name: "GeokHub", url: SITE_URL }],
  creator: "GeokHub",
  publisher: "GeokHub",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  icons: {
    icon: "/icons/geokhub.png",
    shortcut: "/icons/geokhub.png",
    apple: "/icons/geokhub.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GeokHub",
    title: "GeokHub - Tech Insights & Digital Lifestyle",
    description:
      "Your trusted source for AI updates, software guides, tech news, and digital wellness tips.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/icons/geokhub.png`,
        width: 1200,
        height: 630,
        alt: "GeokHub - Tech Insights & Digital Lifestyle",
      },
    ],
    ...(SOCIAL_PROFILES.facebook && {
      seeAlso: [
        SOCIAL_PROFILES.twitter,
        SOCIAL_PROFILES.linkedin,
        SOCIAL_PROFILES.facebook,
      ],
    }),
  },
  twitter: {
    card: "summary_large_image",
    site: "@geokhub",
    creator: "@geokhub",
    title: "GeokHub - Tech Insights & Digital Lifestyle",
    description:
      "Your trusted source for AI updates, software guides, tech news, and digital wellness tips.",
    images: [`${SITE_URL}/icons/geokhub.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    other: {
      "p:domain_verify": ["c0dbe776d33d4616c0e462e8807ee92e"],
      "msvalidate.01": ["6AA911CBE65DEE60C4281E5345D3BA39"],
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Domain Verification */}
        <meta
          name="p:domain_verify"
          content="c0dbe776d33d4616c0e462e8807ee92e"
        />
        <meta name="msvalidate.01" content="6AA911CBE65DEE60C4281E5345D3BA39" />

        {/* Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/geokhub.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="512x512"
          href="/icons/geokhub.png"
        />
        <link rel="icon" type="image/x-icon" href="/icons/geokhub.ico" />

        {/* RSS */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="GeokHub RSS Feed"
          href="/rss.xml"
        />

        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  try {
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}');
                  } catch (e) {
                    console.warn('gtag init failed', e);
                  }
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Structured Data */}
        <StructuredData />

        {/* <FloatingKofi /> */}

        <ThemeProvider
          attribute={"class"}
          defaultTheme="white"
          storageKey="theme"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>
            {/* <AdSenseProvider /> */}
            {children}
                    {/* <CookieConsent /> */}

            <SanityLive />
            <Toaster />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
