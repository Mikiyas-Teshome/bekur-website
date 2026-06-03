import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bekurtechnologies.com";

export const metadata: Metadata = {
  title: "Our Services - Perfect Tech Solutions For Your Business | Bekur Technologies",
  description:
    "Discover our perfect tech solutions for your business. Bekur Technologies offers comprehensive services including Social Media Management, Digital Marketing, Website Development, UI/UX Design, App Development, Office ERP, Graphics Design, and Logo and Branding. Boost your business with our expert technology solutions.",
  keywords: [
    "our services",
    "services",
    "perfect tech solutions",
    "tech solutions for business",
    "business technology solutions",
    "social media management",
    "digital marketing services",
    "website development services",
    "UI/UX design services",
    "app development services",
    "Office ERP services",
    "graphics design services",
    "logo and branding services",
    "technology services",
    "IT services",
    "software services",
    "digital solutions",
    "business solutions",
    "boost your business",
    "technology consulting",
  ],
  openGraph: {
    title: "Our Services - Perfect Tech Solutions For Your Business | Bekur Technologies",
    description:
      "Discover our perfect tech solutions for your business. Bekur Technologies offers comprehensive services including Social Media Management, Digital Marketing, Website Development, UI/UX Design, App Development, Office ERP, Graphics Design, and Logo and Branding.",
    url: `${siteUrl}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services - Perfect Tech Solutions For Your Business | Bekur Technologies",
    description:
      "Discover our perfect tech solutions for your business. Comprehensive technology services to boost your business.",
  },
  alternates: {
    canonical: `${siteUrl}/services`,
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

