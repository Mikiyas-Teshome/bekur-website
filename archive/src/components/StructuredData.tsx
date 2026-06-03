"use client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bekurtechnologies.com";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bekur Technologies",
    alternateName: ["Bekur Tech Solution", "Bekur Tech"],
    url: siteUrl,
    logo: `${siteUrl}/assets/logo/logo-light.svg`,
    description:
      "Bekur Technologies empowers your digital presence with cutting-edge technology solutions. We specialize in web app development, website development, mobile app development, digital marketing, SEO, PPC advertising, social media management, UI/UX design, graphics design, logo and branding, Office ERP systems, and IT outsourcing.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ET",
      addressLocality: "Addis Ababa",
      addressRegion: "Addis Ababa",
    },
    sameAs: [
      "https://www.facebook.com/bekurtechnologies",
      "https://www.twitter.com/bekurtech",
      "https://www.linkedin.com/company/bekur-technologies",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        telephone: "+251-912345678",
        availableLanguage: ["English", "Amharic"],
        areaServed: "Worldwide",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "18:00",
        },
      },
    ],
    foundingDate: "2020",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "10-50",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bekur Technologies",
    alternateName: "Bekur Tech Solution",
    url: siteUrl,
    description:
      "Bekur Technologies empowers your digital presence with cutting-edge technology solutions. Perfect tech solutions to boost your business.",
    publisher: {
      "@type": "Organization",
      name: "Bekur Technologies",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#localbusiness`,
    name: "Bekur Technologies",
    image: `${siteUrl}/assets/logo/logo-light.svg`,
    description:
      "Bekur Technologies - Empowering your digital presence with technology solutions including web development, mobile app development, digital marketing, UI/UX design, and more.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Addis Ababa",
      addressLocality: "Addis Ababa",
      addressRegion: "Addis Ababa",
      addressCountry: "ET",
    },
    telephone: "+1-699-294-5247",
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Technology Solutions",
    provider: {
      "@type": "Organization",
      name: "Bekur Technologies",
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bekur Technologies Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Development",
            description: "Website development and web app development services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile App Development",
            description: "iOS and Android mobile app development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Digital Marketing",
            description: "SEO, PPC advertising, content marketing, and social media marketing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Social Media Management",
            description: "Social media management and social media page boosting services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "UI/UX Design",
            description: "User interface and user experience design services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Graphics Design",
            description: "Graphics design, logo design, and branding services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Office ERP",
            description: "Office ERP systems and enterprise resource planning solutions",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "IT Outsourcing",
            description: "IT outsourcing and software outsourcing services",
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}

