// scripts/seed.ts
import 'dotenv/config'; // Load environment variables first
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { contactPageContent, socialLinks } from "@/database/schema";
import { url } from 'inspector';

// Create a direct database connection for seeding
const connectionString = url(process.env.DATABASE_URL!);
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const sql = neon(connectionString);
const db = drizzle(sql);

async function seed() {
  console.log("Seeding database...");

  try {
    // Clear existing data (optional)
    await Promise.all([
      db.delete(contactPageContent),
      db.delete(socialLinks),
    ]);

    // Insert contact page content
    const [contact] = await db.insert(contactPageContent)
      .values({
        introText: "Have questions or want to work together? Reach out!",
        email: "your.email@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, City, Country",
        mapEmbedUrl: "https://maps.google.com/embed?pb=...",
        metaDescription: "Get in touch with us for collaborations and inquiries",
      })
      .returning();

    console.log("Inserted contact page content:", contact);

    // Insert social links
    const socials = await db.insert(socialLinks)
      .values([
        {
          platform: "Twitter",
          url: "https://twitter.com/yourhandle",
          icon: "twitter",
          order: 1,
        },
        {
          platform: "GitHub",
          url: "https://github.com/yourusername",
          icon: "github",
          order: 2,
        },
        {
          platform: "LinkedIn",
          url: "https://linkedin.com/in/yourprofile",
          icon: "linkedin",
          order: 3,
        },
      ])
      .returning();

    console.log("Inserted social links:", socials);

    console.log("Seeding completed!");
    process.exit(0);
  } catch (e) {
    console.error("Seeding failed:", e);
    process.exit(1);
  }
}

seed();