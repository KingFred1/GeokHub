import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { resend } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/welcome-email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(user).values({
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
    });

    // Send welcome email (best-effort)
    try {
      await resend.emails.send({
        from: "GeokHub <no-reply@geokhub.com>",
        to: email,
        subject: "Welcome to GeokHub!",
        react: WelcomeEmail({ name }),
      });
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/auth/signup error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
