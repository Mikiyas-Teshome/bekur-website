import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";
import { loadPageContent } from "@/lib/content/load-page";

export function generateMetadata(): Metadata {
  const content = loadPageContent("about");

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      canonical: content.seo.canonicalPath,
    },
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      url: content.seo.canonicalPath,
    },
  };
}

export default function AboutRoute() {
  const about = loadPageContent("about");
  const whyBekur = loadPageContent("why-bekur");
  const faq = loadPageContent("faq");

  if (about.pageId !== "about" || whyBekur.pageId !== "why-bekur" || faq.pageId !== "faq") {
    throw new Error("Invalid about page content");
  }

  const faqItems = faq.items.slice(0, 5).map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  return (
    <AboutPage
      content={{
        hero: about.hero,
        whoWeAre: about.whoWeAre,
        stats: about.stats,
        mission: about.mission,
        vision: about.vision,
        delivery: about.delivery,
        teamPrinciple: about.teamPrinciple,
      }}
      brandValues={whyBekur.brandValues}
      comparisonRows={whyBekur.comparisonTable}
      faqItems={faqItems}
    />
  );
}
