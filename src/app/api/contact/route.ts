import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Contact } from "@/lib/entities/Contact";
import { z } from "zod";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  company: z.string().max(100, "Company name is too long").optional(),
  phone: z.string().optional(),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

export async function GET() {
  try {
    const dataSource = await getDataSource();

    if (!dataSource || !dataSource.isInitialized) {
      console.error("DataSource is not available or initialized");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const contactRepository = dataSource.getRepository(Contact);

    const contacts = await contactRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the form data
    const validatedData = contactFormSchema.parse(body);

    // SMTP Configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFromName = process.env.SMTP_FROM_NAME || "Bekur Technologies";
    const smtpFromEmail = process.env.SMTP_FROM_EMAIL || "noreply@bekurtechnologies.com";
    const adminEmail = process.env.CONTACT_EMAIL || "info@bekurtechnologies.com";

    // Check if SMTP is configured
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error("❌ SMTP configuration is missing. Please check your .env.local file");
      console.error("Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
    } else {
      try {
        // Create SMTP transporter
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        // Email content
        const mailOptions = {
          from: `"${smtpFromName}" <${smtpFromEmail}>`,
          to: adminEmail,
          replyTo: validatedData.email, // Replies will go to the user's email
          subject: validatedData.subject,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${validatedData.name} (${validatedData.email})</p>
            ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ""}
            ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${validatedData.message.replace(/\n/g, "<br>")}</p>
          `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
      } catch (emailError: unknown) {
        // Log detailed error information
        console.error("❌ Error sending email:", emailError);
        if (emailError && typeof emailError === 'object') {
          if ('message' in emailError) {
            console.error("Email error message:", emailError.message);
          }
          if ('code' in emailError) {
            console.error("Email error code:", emailError.code);
          }
          if ('command' in emailError) {
            console.error("Email error command:", emailError.command);
          }
          console.error("Full error object:", JSON.stringify(emailError, null, 2));
        }
        // Continue even if email fails - don't block the form submission
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
