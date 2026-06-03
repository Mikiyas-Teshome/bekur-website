"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Logos() {
  const logos = ["Linear", "Framer", "Lottie", "Contra", "Hype"];

  return (
    <section className="w-full bg-muted/30 dark:bg-background py-[85px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-8">Trusted by top founders.</p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale dark:invert">
          {logos.map((logo, index) => (
             <motion.div 
               key={index}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: false, amount: 0.2 }}
               transition={{ delay: index * 0.1, duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
               className="text-2xl font-bold font-sans text-foreground"
             >
               {/* Placeholder for SVG */}
               {logo}
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
