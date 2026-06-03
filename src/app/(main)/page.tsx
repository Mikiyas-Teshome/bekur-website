import Hero from "@/components/mvp-clone/Hero";
import IsThisYou from "@/components/mvp-clone/IsThisYou";
import SolutionBridge from "@/components/mvp-clone/SolutionBridge";
import Services from "@/components/mvp-clone/Services";
import Benefits from "@/components/mvp-clone/Benefits";
import CaseStudies from "@/components/mvp-clone/CaseStudies";
import Stats from "@/components/mvp-clone/Stats";
import Process from "@/components/mvp-clone/Process";
import Accountability from "@/components/mvp-clone/Accountability";
import Pricing from "@/components/mvp-clone/Pricing";
import BlogSection from "@/components/homePage/BlogSection";
import MarketingFaq from "@/components/mvp-clone/MarketingFaq";
import MarketingCta from "@/components/mvp-clone/MarketingCta";
import MarketingContact from "@/components/mvp-clone/MarketingContact";
import { loadPageContent } from "@/lib/content/load-page";

export default function HomePage() {
  const faq = loadPageContent("faq");
  if (faq.pageId !== "faq") {
    throw new Error("Expected FAQ page content");
  }

  const faqItems = faq.items.slice(0, 6).map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  return (
    <main className="min-h-screen bg-muted/30 dark:bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Hero />
      <IsThisYou />
      <SolutionBridge />
      <Services />
      <Process />
      <Accountability />
      <CaseStudies />
      <Stats />
      <Benefits />
      <Pricing />
      <div id="insights" className="scroll-mt-28">
        <BlogSection />
      </div>
      <MarketingFaq items={faqItems} />
      <MarketingCta ctaLabel="Book a call" ctaHref="/blueprint#book" />
      <MarketingContact />
    </main>
  );
}
