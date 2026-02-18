import { sql } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/gel-core";
import { bigint, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"), 
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: bigint("expires_at", { mode: "number" }),   tokenType: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  idToken: text("id_token"), 
  sessionState: varchar("session_state", { length: 255 }),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationTokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const likes = pgTable("likes", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  userId: text("user_id").notNull(), // Authenticated user's ID from NextAuth
  postId: text("post_id"), // Nullable: If liking a post
  commentId: uuid("comment_id").references(() => comments.id, { onDelete: "cascade" }), // Nullable: If liking a comment
  reaction: text("reaction").notNull().default("like"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const comments = pgTable("comments", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id").notNull(), // Sanity post ID
  parentId: uuid("parent_id").references(() => comments.id, { onDelete: "cascade" }), // Tracks replies
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'responded', 'spam'
});

export const contactPageContent = pgTable("contact_page_content", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  introText: text("intro_text").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  mapEmbedUrl: text("map_embed_url"),
  metaDescription: text("meta_description").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  platform: text("platform").notNull(), // 'Twitter', 'GitHub', 'LinkedIn', etc.
  url: text("url").notNull(),
  icon: text("icon"), // Optional: SVG path or icon name
  order: integer("order").default(0).notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
