import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Contact } from "@/lib/entities/Contact";
import { z } from "zod";
import { Resend } from "resend";

export const runtime = "nodejs";

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

const contactFrom =
  process.env.RESEND_FROM_EMAIL || "Bekur Technologies <bookings@bekurtechnologies.com>";
const contactTo = process.env.CONTACT_EMAIL || "ewenetmikiyas@gmail.com";

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
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: contactFrom,
      to: contactTo,
      replyTo: validatedData.email,
      subject: `Contact form: ${validatedData.subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #214a9c; margin-top: 0;">New contact form submission</h2>
          <p><strong>From:</strong> ${validatedData.name} (${validatedData.email})</p>
          ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ""}
          ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ""}
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${validatedData.message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

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
      { error: "Failed to send your message. Please try again." },
      { status: 500 }
    );
  }
}
