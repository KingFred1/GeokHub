import { db } from "@/database/drizzle";
import { newsletterSubscribers } from "@/database/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'fredsazy01@gmail.com'; // Your email address

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));

    if (existingSubscriber.length > 0) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    // Insert new subscriber
    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values({
        id: crypto.randomUUID(),
        email,
      })
      .returning();

    // Send confirmation email to subscriber
    await resend.emails.send({
      from: "Newsletter <no-reply@geokhub.com>",
      to: email,
      subject: "Newsletter Subscription Confirmation",
      html: `
        <h2>Thank you for subscribing to our newsletter!</h2>
        <p>We're excited to have you on board.</p>
      `,
    });

    // Send notification email to admin
    await resend.emails.send({
      from: 'Newsletter <no-reply@geokhub.com>',
      to: [ADMIN_EMAIL],
      subject: 'New Newsletter Subscriber',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}