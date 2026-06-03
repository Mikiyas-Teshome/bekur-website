"use client";
import React, { useState, useEffect } from "react";
import WhatWeDo from "@/components/aboutPage/WhatWeDo";
import OurValue from "@/components/aboutPage/OurValue";
import TeamSection from "@/components/homePage/TeamSection";
import TestimonialsSection from "@/components/homePage/TestimonialsSection";
import TrustedCompany from "@/components/homePage/TrustedCompany";
import valuesData from "@/data/values.json";

interface Value {
  id: number;
  title: string;
  description: string;
  step: string;
  iconKey: string;
}

const AboutPage = () => {
  const [values] = useState<Value[]>(valuesData.values);

  return (
    <div className="min-h-screen bg-background text-foreground space-y-4 md:space-y-8 py-6 md:py-12.5">
      {/* What We Do Section */}
      <WhatWeDo />
      <OurValue title="value" description="our value" data={values} />
      <div className="container mx-auto px-4">
        <TrustedCompany />
      </div>
      <div className="">
        <div className="container mx-auto px-4">
          <TeamSection />
        </div>
      </div>
      <div className="container mx-auto px-4">
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default AboutPage;
