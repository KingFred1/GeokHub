// auth.ts - STANDARD VERSION
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/database/drizzle";
import { and, eq } from "drizzle-orm";
import { user } from "@/database/schema";
import { compare } from "bcryptjs";
import { account as accountTable, user as userTable } from "@/database/schema";
import { resend } from "./lib/resend";
import { WelcomeEmail } from "./emails/welcome-email";

// Use the standard NextAuth initialization
const nextAuth = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const [existingUser] = await db
            .select()
            .from(user)
            .where(eq(user.email, credentials.email.toString()))
            .limit(1);

          if (!existingUser?.password) {
            throw new Error("Invalid credentials");
          }

          const isValid = await compare(
            credentials.password.toString(),
            existingUser.password
          );

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            image: existingUser.image
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingAccount = await db
          .select()
          .from(accountTable)
          .where(
            and(
              eq(accountTable.provider, account.provider),
              eq(accountTable.providerAccountId, account.providerAccountId)
            )
          );

        if (existingAccount.length === 0) {
          const existingUser = await db
            .select()
            .from(userTable)
            .where(eq(userTable.email, user.email!))
            .limit(1);

          if (existingUser.length > 0) {
            const existing = existingUser[0];

            await db.insert(accountTable).values({
              userId: existing.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              accessToken: account.access_token,
              tokenType: account.token_type,
              idToken: account.id_token,
              scope: account.scope,
              expiresAt: account.expires_at,
              refreshToken: account.refresh_token,
            });

            user.id = existing.id;
          }
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      if (token?.name) session.user.name = token.name as string;
      return session;
    }
  },
  events: {
    async createUser({ user }) {
      try {
        await resend.emails.send({
          from: "GeokHub <no-reply@geokhub.com>",
          to: user.email!,
          subject: "Welcome to GeokHub!",
          react: WelcomeEmail({ name: user.name || "there" }),
        });
        console.log("Welcome email sent to:", user.email);
      } catch (error) {
        console.error("Failed sending welcome email:", error);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

// Standard exports that work reliably
export const { handlers, auth, signIn, signOut } = nextAuth;