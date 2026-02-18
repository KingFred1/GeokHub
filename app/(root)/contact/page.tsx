import { db } from "@/database/drizzle";
import { contactPageContent, socialLinks } from "@/database/schema";
import { asc } from "drizzle-orm";
import ContactClientPage from "./ContactClientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact Us - GeoKhub | Get in Touch',
  description: 'Reach out to GeoKhub for collaborations, guest posts, or inquiries. We respond within 24 hours.',
  keywords: 'contact geokhub, collaboration, guest post, inquiry, support',
  openGraph: {
    title: 'Contact GeoKhub - Get in Touch',
    description: 'Reach out to GeoKhub for collaborations and inquiries',
    type: 'website',
  },
};

// Fallback data (same as in your client component)
const fallbackContactData = {
  introText: "Have a question or want to work together? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  email: "contact@geokhub.com",
  phone: "+234 802 114 9420",
  address: "Lagos, Nigeria",
  mapEmbedUrl: "",
  metaDescription: "Contact GeoKhub for inquiries, collaborations, and support"
};

const fallbackSocialLinks = [
  { platform: "Twitter", url: "https://x.com/geokhub" },
  { platform: "LinkedIn", url: "https://linkedin.com/company/geokhub" },
  { platform: "GitHub", url: "https://github.com/kingFred1" },
  { platform: "Facebook", url: "https://facebook.com/geokhub" },
];

export default async function ContactPage() {
  const [content] = await db.select().from(contactPageContent).limit(1);
  const socials = await db.select().from(socialLinks).orderBy(asc(socialLinks.order));

  // Use fallback data when database fields are empty or null
  const contactData = {
    introText: content?.introText || fallbackContactData.introText,
    email: content?.email || fallbackContactData.email,
    phone: content?.phone || fallbackContactData.phone,
    address: content?.address || fallbackContactData.address,
    mapEmbedUrl: content?.mapEmbedUrl || fallbackContactData.mapEmbedUrl,
    metaDescription: content?.metaDescription || fallbackContactData.metaDescription,
  };

  const serverData = {
    contactData: contactData,
    socialLinks: socials.length > 0 ? socials : fallbackSocialLinks,
  };

  return <ContactClientPage serverData={serverData} />;
}