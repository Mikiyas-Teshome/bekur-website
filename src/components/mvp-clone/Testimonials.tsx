"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BookCallLink from "@/components/BookCallLink";
import Image from "next/image";

const testimonials = [
  {
    stat: "100%",
    label: "Job Success Score on Upwork",
    text: "Top Rated with $20K+ earned in under 12 months. Credibility from shipped systems — not pitch decks or open-ended discovery.",
    author: "Upwork",
    role: "Top Rated Partner",
    logoConfig: "U"
  },
  {
    stat: "1M+",
    label: "App downloads",
    text: "Feres ride-hailing reached over a million downloads. From national COVID contact tracing to multi-tenant SaaS — production at scale.",
    author: "Feres",
    role: "Ride-hailing platform",
    logoConfig: "F"
  },
  {
    stat: "50K+",
    label: "Cases tracked nationally",
    text: "Debo — national COVID contact-tracing app built for the Ministry of Health. Real infrastructure under real pressure.",
    author: "Debo",
    role: "Ministry of Health",
    logoConfig: "D"
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 ">
      <div className="max-w-7xl mx-auto">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false }}
           transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
           className="text-center mb-16"
        >
           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">
             Shipped systems.
           </h2>
           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground leading-tight">
             Not shelfware.
           </h2>
        </motion.div>

        <div className="bg-card rounded-[32px] grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
           {testimonials.map((item, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, amount: 0.2 }}
               transition={{ delay: i * 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
               className="bg-background p-8 md:p-10 rounded-[32px] shadow-[0_4px_16px_-6px_rgba(161,161,170,0.1)] flex flex-col justify-between border border-border"
             >
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">{item.stat}</h3>
                    <p className="text-lg text-muted-foreground">{item.label}</p>
                  </div>
                   {/* Quote Icon */}
                  <div className="text-[#E1443A] text-4xl font-serif">“</div>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {item.text}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                         {/* Avatar Placeholder */}
                         <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600" />
                      </div>
                      <div>
                         <p className="font-bold text-foreground text-sm">{item.author}</p>
                         <p className="text-muted-foreground text-xs">{item.role}</p>
                      </div>
                   </div>
                   <div className="text-gray-300">
                      {/* Logo Placeholder */}
                      {item.logoConfig}
                   </div>
                </div>
             </motion.div>
           ))}

           {/* Dark CTA Card - Takes standard slot */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
             className="bg-primary p-8 md:p-10 rounded-[32px] shadow-xl flex flex-col justify-center relative overflow-hidden dark:bg-card border border-border"
           >
              {/* Dotted Background */}
              <div className="absolute inset-0 opacity-20" 
                   style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              </div>

              <div className="relative z-10">
                 <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground dark:text-foreground mb-2 leading-tight">
                    You focus on
                 </h3>
                 <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground/80 dark:text-foreground/80 mb-2 leading-tight">
                    client work.
                 </h3>
                 <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground dark:text-foreground mb-2 leading-tight">
                 <span className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground/80 dark:text-foreground/80 mb-2 leading-tight">
                    We reclaim
                 </span>
                    {' '}partner hours.
                 </h3>
                 <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground dark:text-foreground mb-10 leading-tight">
                    One workflow at a time.
                 </h3>

                 <BookCallLink
                    href="/blueprint#book"
                    variant="ctaBanner"
                    className="self-start px-6 py-3 text-base font-medium"
                    showArrow
                    arrowType="right"
                 />
              </div>
           </motion.div>
        </div>
        
        <div className="flex justify-end mt-12">
            <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors text-foreground"
            >
                View Our Work
                <ArrowRight className="w-4 h-4" />
            </motion.button>
        </div>
        
         {/* Review summary stats below button */}
        <div className="flex justify-end items-center gap-2 mt-4 opacity-100">
             <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-muted/50" />)}
             </div>
             <div className="flex text-foreground">
                 {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
             </div>
             <span className="text-xs font-medium text-muted-foreground">Top Rated · 100% Job Success</span>
        </div>

      </div>
    </section>
  );
}
