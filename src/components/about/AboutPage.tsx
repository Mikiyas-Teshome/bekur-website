import AboutHero from "./AboutHero";
import AboutWhoWeAre from "./AboutWhoWeAre";
import AboutValues from "./AboutValues";
import AboutComparison from "./AboutComparison";
import Team from "@/components/mvp-clone/Team";
import MarketingFaq from "@/components/mvp-clone/MarketingFaq";
import MarketingCta from "@/components/mvp-clone/MarketingCta";

type BrandValue = {
  title: string;
  description: string;
};

type ComparisonRow = {
  alternative: string;
  theirFailure: string;
  bekurWins: string;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type AboutPageProps = {
  content: {
    hero: {
      headline: string;
      subheadline: string;
      primaryCta: { label: string; href: string };
    };
    trustLine: string;
    whoWeAre: { eyebrow: string; headline: string; body: string };
    stats: { value: string; label: string; description: string }[];
    mission: string;
    vision: string;
    delivery: { headquarters: string; serviceArea: string };
    teamPrinciple: string;
  };
  brandValues: BrandValue[];
  comparisonRows: ComparisonRow[];
  faqItems: FaqItem[];
};

export default function AboutPage({
  content,
  brandValues,
  comparisonRows,
  faqItems,
}: AboutPageProps) {
  return (
    <main className="min-h-screen bg-muted/30 text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-background">
      <AboutHero
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        trustLine={content.trustLine}
        ctaLabel={content.hero.primaryCta.label}
        ctaHref={content.hero.primaryCta.href}
      />
      <AboutWhoWeAre
        eyebrow={content.whoWeAre.eyebrow}
        headline={content.whoWeAre.headline}
        body={content.whoWeAre.body}
        mission={content.mission}
        stats={content.stats}
      />
      <AboutValues values={brandValues} />
      <AboutComparison rows={comparisonRows} />
      <Team />
      <MarketingFaq items={faqItems} />
      <MarketingCta
        ctaLabel={content.hero.primaryCta.label}
        ctaHref={content.hero.primaryCta.href}
      />
    </main>
  );
}
