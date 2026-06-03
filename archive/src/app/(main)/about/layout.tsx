import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bekurtechnologies.com";

export const metadata: Metadata = {
  title: "About Us - Bekur Technologies | More About Us",
  description:
    "Learn more about Bekur Technologies. We navigate the intersection of tradition and innovation, offering tailored technology solutions to seamlessly maintain existing systems while strategically modernizing them. Discover our team, values, and commitment to helping businesses thrive in the contemporary digital landscape.",
  keywords: [
    "about Bekur Technologies",
    "about Bekur Tech",
    "more about us",
    "technology company Ethiopia",
    "digital solutions company",
    "IT services company",
    "software development team",
    "expert developers",
    "certified developers",
    "technology expertise",
    "innovation and tradition",
    "business modernization",
    "digital transformation",
    "technology consulting",
    "IT consulting",
    "our team",
    "our values",
    "company values",
    "business solutions",
    "technology solutions",
  ],
  openGraph: {
    title: "About Us - Bekur Technologies | More About Us",
    description:
      "Learn more about Bekur Technologies. We navigate the intersection of tradition and innovation, offering tailored technology solutions to seamlessly maintain existing systems while strategically modernizing them.",
    url: `${siteUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Bekur Technologies | More About Us",
    description:
      "Learn more about Bekur Technologies. We navigate the intersection of tradition and innovation, offering tailored technology solutions.",
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

