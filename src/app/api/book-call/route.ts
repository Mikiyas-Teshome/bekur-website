import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { format, isSunday, startOfDay, isBefore } from "date-fns";

// Generate iCalendar (.ics) content
function generateICS(
  fullName: string,
  email: string,
  company: string,
  date: string,
  time: string,
  timezone: string
) {
  const dateTime = `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
  const endTime = `${date.replace(/-/g, "")}T${(parseInt(time.split(":")[0]) + 1).toString().padStart(2, "0")}${time.split(":")[1]}00`;

  const uid = `booking-${Date.now()}@bekurtechnologies.com`;
  const dtstamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'").replace(/\//g, "");

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bekur Technologies//Automation Sprint Call//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;TZID=${timezone}:${dateTime}
DTEND;TZID=${timezone}:${endTime}
SUMMARY:Automation Sprint Call - ${company}
DESCRIPTION:Discussion about automating workflows for ${company}\n\nClient: ${fullName}\nEmail: ${email}\nCompany: ${company}
LOCATION:Virtual - Zoom/Teams Link TBD
ORGANIZER;CN=Bekur Technologies:mailto:admin@bekurtechnologies.com
ATTENDEE;CN=${fullName}:mailto:${email}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
}

// Generate calendar URLs
function generateCalendarUrls(
  fullName: string,
  email: string,
  company: string,
  date: string,
  time: string,
  timezone: string
) {
  const dateTime = new Date(`${date}T${time}:00`);
  const endTime = new Date(dateTime.getTime() + 30 * 60000);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Automation Sprint Call - ${company}`
  )}&dates=${dateTime.toISOString().replace(/[:-]/g, "").split(".")[0]}Z/${endTime
    .toISOString()
    .replace(/[:-]/g, "")
    .split(".")[0]}Z&details=${encodeURIComponent(
    `Discussion with ${fullName} from ${company}\n\nEmail: ${email}`
  )}&location=Virtual`;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    `Automation Sprint Call - ${company}`
  )}&startdt=${dateTime.toISOString()}&enddt=${endTime.toISOString()}&body=${encodeURIComponent(
    `Discussion with ${fullName} from ${company}`
  )}`;

  return { googleCalendarUrl, outlookUrl };
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { fullName, email, phone, company, message, timezone, preferredDate, preferredTime } =
      body;
    const companyLabel = typeof company === "string" && company.trim() ? company.trim() : fullName;

    // Validate required fields
    if (!fullName || !email || !phone || !preferredDate || !preferredTime || !timezone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format date and time
    const bookingDate = startOfDay(new Date(preferredDate));
    const today = startOfDay(new Date());

    if (isBefore(bookingDate, today) || isSunday(bookingDate)) {
      return NextResponse.json(
        { error: "Selected date is not available" },
        { status: 400 }
      );
    }

    const dateStr = format(bookingDate, "yyyy-MM-dd");
    const timeStr = preferredTime;

    // Generate calendar URLs and ICS
    const { googleCalendarUrl, outlookUrl } = generateCalendarUrls(
      fullName,
      email,
      companyLabel,
      dateStr,
      timeStr,
      timezone
    );
    const icsContent = generateICS(fullName, email, companyLabel, dateStr, timeStr, timezone);

    // Get timezone label
    const timezoneLabels: Record<string, string> = {
      "America/New_York": "Eastern Time (ET)",
      "America/Chicago": "Central Time (CT)",
      "America/Denver": "Mountain Time (MT)",
      "America/Los_Angeles": "Pacific Time (PT)",
    };
    const timezoneLabel = timezoneLabels[timezone] || timezone;

    // Format date for display
    const dateFormatted = new Date(preferredDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send email to client with Resend
    await resend.emails.send({
      from: "Bekur Technologies <bookings@bekurtechnologies.com>",
      to: email,
      subject: `Your Automation Sprint Call is Scheduled - ${dateFormatted}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #214a9c; margin-top: 0;">Your Automation Sprint Call is Scheduled! 🎉</h2>

          <p>Hi <strong>${fullName}</strong>,</p>
          <p>Thank you for booking your consultation with Bekur Technologies. Here are your meeting details:</p>

          <div style="background-color: #f5f5f5; padding: 24px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0 0 12px 0;"><strong>📅 Date:</strong> ${dateFormatted}</p>
            <p style="margin: 0 0 12px 0;"><strong>🕐 Time:</strong> ${timeStr} (30 minutes)</p>
            <p style="margin: 0 0 12px 0;"><strong>🌍 Timezone:</strong> ${timezoneLabel}</p>
            ${company ? `<p style="margin: 0;"><strong>🏢 Company:</strong> ${company}</p>` : ""}
          </div>

          <h3 style="color: #333; margin-top: 24px;">Add to Your Calendar:</h3>
          <p style="margin-bottom: 16px;">Choose your preferred calendar service:</p>

          <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
            <a href="${googleCalendarUrl}" style="display: inline-block; background-color: #4285f4; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">Google Calendar</a>
            <a href="${outlookUrl}" style="display: inline-block; background-color: #0078d4; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">Outlook Calendar</a>
            <a href="data:text/calendar;base64,${Buffer.from(icsContent).toString("base64")}" download="automation-sprint-call.ics" style="display: inline-block; background-color: #ff6b6b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">Download ICS</a>
          </div>

          <p>We'll send you a Zoom/Teams link 24 hours before the call. If you need to reschedule, simply reply to this email.</p>

          ${message ? `<p><strong>Your Project Details:</strong><br>${message}</p>` : ""}

          <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Bekur Technologies<br/>
            📧 admin@bekurtechnologies.com<br/>
            📞 +1 (202) 992-2179<br/>
            🌐 bekurtechnologies.com
          </p>
        </div>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: "Bekur Technologies <bookings@bekurtechnologies.com>",
      to: "admin@bekurtechnologies.com",
      subject: `New Booking: ${fullName}${company ? ` - ${company}` : ""}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
          <h3>New Automation Sprint Booking</h3>
          <p><strong>Client:</strong> ${fullName}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Scheduled:</strong> ${dateFormatted} at ${timeStr} (${timezoneLabel})</p>
          ${message ? `<p><strong>Project Details:</strong><br>${message}</p>` : ""}
        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Call scheduled successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
