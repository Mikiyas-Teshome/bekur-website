"use client";

import React from "react";
import { motion } from "framer-motion";
import BookCallLink from "@/components/BookCallLink";
import Image from "next/image";

export default function CTA() {
  return (
    <section className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 py-[85px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Stat */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false }}
           className="bg-card p-8 md:p-12 rounded-[40px] flex flex-col justify-between min-h-[400px] relative shadow-[0_4px_16px_-6px_rgba(161,161,170,0.1)]"
        >
           <div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">#3</h3>
              <p className="text-lg text-muted-foreground mb-8">Product of the Day on Product Hunt</p>
              
              <div className="text-[#E1443A] text-4xl font-serif">“</div>
              <p className="text-lg text-foreground leading-relaxed mb-8">
                 We don&apos;t sell AI. We end AI hype fatigue. Finden shipped as a production system — ranked ahead of Vercel v0 on Product Hunt — because we build for real-world data, not demos.
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative">
                 {/* Avatar Placeholder */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-500" />
              </div>
              <div>
                  <div className="font-bold text-foreground">Finden AI</div>
                  <div className="text-sm text-muted-foreground">Production app · Product Hunt</div>
              </div>
              
              {/* Decorative Star/Flower Icon */}
              <div className="ml-auto text-muted-foreground/20">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" />
                  </svg>
              </div>
           </div>
        </motion.div>

        {/* Right Card: Dark Booking CTA */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false }}
           transition={{ delay: 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
           className="bg-primary dark:bg-card p-8 md:p-12 rounded-[40px] flex flex-col justify-center relative overflow-hidden min-h-[400px]"
        >
             {/* Polka Dot Pattern */}
             <div className="absolute inset-0 opacity-20" 
                  style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
             </div>

             <div className="relative z-10 max-w-md">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground dark:text-foreground leading-tight mb-2">
                   Not sure where to start?
                </h3>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground dark:text-foreground leading-tight mb-16">
                   Book a call.
                </h3>

                <BookCallLink
                  href="/blueprint#book"
                  variant="ctaBanner"
                  showArrow
                  arrowType="right"
                />
             </div>
        </motion.div>
      </div>
    </section>
  );
}
