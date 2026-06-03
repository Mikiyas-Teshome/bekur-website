import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bekurtechnologies.com";

export const metadata: Metadata = {
  title: "Contact Us - Get Free Quote | Bekur Technologies",
  description:
    "Contact Bekur Technologies for a free quote. We're here to help with any questions or ideas. Hotline 24/7: +1(699) 294-5247. Located in Addis Ababa, Ethiopia. Get in touch for web development, mobile app development, digital marketing, UI/UX design, and more technology solutions. We'll contact you back in 24 hours.",
  keywords: [
    "contact Bekur Technologies",
    "contact us",
    "get free quote",
    "free quote",
    "contact Bekur Tech",
    "hotline 24/7",
    "24/7 support",
    "customer support",
    "get in touch",
    "reach out",
    "Addis Ababa Ethiopia",
    "technology consultation",
    "free consultation",
    "project inquiry",
    "business inquiry",
    "service inquiry",
    "quote request",
    "contact form",
    "customer service",
    "support team",
  ],
  openGraph: {
    title: "Contact Us - Get Free Quote | Bekur Technologies",
    description:
      "Contact Bekur Technologies for a free quote. We're here to help with any questions or ideas. Hotline 24/7. Located in Addis Ababa, Ethiopia. We'll contact you back in 24 hours.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Get Free Quote | Bekur Technologies",
    description:
      "Contact Bekur Technologies for a free quote. We're here to help with any questions or ideas. Hotline 24/7. We'll contact you back in 24 hours.",
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

