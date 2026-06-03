import React from 'react';
import Hero from '@/components/mvp-clone/Hero';
import FeaturedProject from '@/components/mvp-clone/FeaturedProject';
import Logos from '@/components/mvp-clone/Logos';
import Stats from '@/components/mvp-clone/Stats';
import Services from '@/components/mvp-clone/Services';
import FeaturedProjectsGrid from '@/components/mvp-clone/FeaturedProjectsGrid';
import Process from '@/components/mvp-clone/Process';
import Testimonials from '@/components/mvp-clone/Testimonials';
import Pricing from '@/components/mvp-clone/Pricing';
import CTA from '@/components/mvp-clone/CTA';
import FAQ from '@/components/mvp-clone/FAQ';
import Blog from '@/components/mvp-clone/Blog';

export default function MVPPage() {
  return (
    <main className="min-h-screen bg-muted/30 dark:bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Hero />
      <FeaturedProject />
      {/* <Logos /> */}
      <Stats />
      <Services />
      <FeaturedProjectsGrid />
      <Process />
      <Testimonials />
      <Pricing />
      <CTA />
      <FAQ />
      <Blog />
    </main>
  );
}
