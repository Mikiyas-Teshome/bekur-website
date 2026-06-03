"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  {
    value: "Top Rated",
    label: "100% Job Success on Upwork",
    desc: "$20K+ earned in under 12 months — credibility from shipped work, not pitch decks."
  },
  {
    value: "#3",
    label: "Product of the Day on Product Hunt",
    desc: "Finden AI ranked ahead of Vercel v0 — production systems built to real-world standards."
  },
  {
    value: "1M+",
    label: "Downloads on Feres ride-hailing",
    desc: "From national COVID contact tracing to multi-tenant SaaS — we ship at scale."
  }
];

export default function Stats() {
  return (
    <section className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 py-[85px]">
      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false }}
           transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
           className="text-center mb-16"
        >
           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight">
             Proof over promises.<br className="hidden md:block"/>
             <span className="text-muted-foreground">Shipped systems at scale.</span>
           </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="bg-card p-8 md:p-10 rounded-[32px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] h-full flex flex-col"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">{stat.value}</h3>
              <p className="text-lg font-medium text-foreground mb-4">{stat.label}</p>
              <p className="text-muted-foreground leading-relaxed text-[17px]">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
