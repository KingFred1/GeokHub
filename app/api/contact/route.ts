import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { Resend } from 'resend';
import { db } from '@/database/drizzle';
import { contactSubmissions } from '@/database/schema';

// validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = contactFormSchema.parse(body);
    const { name, email, subject, message } = validatedData;

    // Save to database
    const [submission] = await db.insert(contactSubmissions)
      .values({
        name,
        email,
        subject,
        message,
      })
      .returning();

     // 1. Send email to admin (you)
     const adminEmail = await resend.emails.send({
      from: 'Your Site <onboarding@resend.dev>',
      to: ['fredsazy01@gmail.com'], // Your admin email
      subject: `New Contact Form: ${body.subject}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>From:</strong> ${body.name} (${body.email})</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
        <p><strong>IP Address:</strong> ${request.headers.get('x-forwarded-for') || 'unknown'}</p>
        <p><strong>User Agent:</strong> ${request.headers.get('user-agent') || 'unknown'}</p>
      `,
    });

    if (adminEmail.error) {
      throw adminEmail.error;
    }

    return NextResponse.json({ 
      success: true,
      message: 'Message sent successfully',
      data: submission 
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(e => ({
            field: e.path[0],
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Error saving contact submission:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}