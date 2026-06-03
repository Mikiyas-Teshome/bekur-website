"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Discovery & Strategy",
    description: "We uncover your goals, audience, and challenges to build a clear roadmap for success."
  },
  {
    id: "02",
    title: "Design & Prototyping",
    description: "Transforming insights into bold, user-focused designs that connect and convert."
  },
  {
    id: "03",
    title: "Development & Launch",
    description: "From pixel to code, we craft high-performing websites and launch them flawlessly."
  },
  {
    id: "04",
    title: "Evaluation & Iteration",
    description: "We analyze performance and iterate to ensure continuous growth and optimization."
  }
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress relative to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the progress bar animation
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 py-[85px] relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">
        {/* Sticky Header */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false }}
               transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
             >
                 <div className="flex items-center gap-2 mb-6">
                     <span className="text-foreground font-medium ml-2 uppercase tracking-wide text-sm">Process</span>
                 </div>
                 <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#171717] leading-tight mb-6">
                   Proven & effective process.<br />
                   <span className="text-muted-foreground">That delivers results.</span>
                 </h2>
                 <p className="text-gray-500 text-lg leading-relaxed">
                   We dive deep into your goals, audience, and challenges to craft a strategy that drives clear direction and impact.
                 </p>
             </motion.div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:w-2/3 relative">
           {/* Vertical Line Container */}
           <div className="absolute left-[20px] top-0 bottom-10 w-[2px] bg-border hidden md:block">
              {/* Active Progress Line */}
              <motion.div 
                style={{ scaleY }} 
                className="absolute top-0 left-0 w-full bg-[#E1443A] origin-top h-full" 
              />
           </div>

           <div className="flex flex-col gap-24 pb-24">
              {steps.map((step, index) => (
                 <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ delay: index * 0.1, duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="relative pl-0 md:pl-20"
                 >
                    {/* Step Number Circle */}
                     <div className="hidden md:flex absolute left-[-20px] top-0 w-[82px] h-[82px] rounded-full bg-muted/30 dark:bg-background border-[6px] border-muted/30 dark:border-background items-center justify-center z-10">
                        <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center text-sm font-bold text-muted-foreground shadow-sm border border-border">
                           {step.id}
                       </div>
                    </div>

                    {/* Mobile Step ID display */}
                     <div className="md:hidden text-[#E1443A] font-bold mb-2">
                        {step.id}
                     </div>

                    <div className="bg-card p-8 md:p-12 rounded-[32px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow duration-300">
                       <h3 className="text-2xl md:text-3xl font-bold text-[#171717] mb-4">{step.title}</h3>
                       <p className="text-muted-foreground text-lg leading-relaxed">
                          {step.description}
                       </p>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
