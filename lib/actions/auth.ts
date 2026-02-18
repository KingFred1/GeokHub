"use server";

import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AuthCredentials } from "@/type";
import { signIn } from "@/auth";
import { resend } from "../resend";
import { WelcomeEmail } from "@/emails/welcome-email";

export const signInWithCredentials = async (
  credentials: { email: string; password: string },
  callbackUrl?: string
) => {
  try {
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, credentials.email))
      .limit(1);

    if (existingUser.length === 0) {
      return {
        success: false,
        error: "Account not found. Please create an account.",
      };
    }

    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password." };
    }

    redirect(callbackUrl || "/profile");
    return { success: true };
  } catch (error) {
    console.error("Sign-in error:", error);
    return { success: false, error: "This account was created with Google. Please sign in with Google bellow." };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { name, email, password } = params;

  try {
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(user).values({
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
    });

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: true,
        requiresSignIn: true,
        message: "Account created! Please sign in.",
      };
    }

    // Send Welcome Email
    await resend.emails.send({
      from: "GeokHub <no-reply@geokhub.com>",
      to: email,
      subject: "Welcome to GeokHub!",
      react: WelcomeEmail({ name }),
    });

    // ✅ Instead of redirect, return success and redirect on frontend
    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: "Something went wrong during signup.",
    };
  }
};
