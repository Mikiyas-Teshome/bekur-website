"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import Link from "next/link";

const testimonialsLeft = [
  { quote: "Helped me go live in days, not weeks—highly recommend.", author: "Marcus T" },
  { quote: "The updates and attention to detail are unmatched.", author: "Nora S" },
  { quote: "Saved me weeks of work, and the result looks professional.", author: "Ethan J" },
];

const testimonialsRight = [
  { quote: "Super smooth experience—launched my site in no time!", author: "Daniel K" },
  { quote: "Beautiful template, easy to customize, and worth every penny.", author: "Amelia R" },
  { quote: "Exactly what I needed to kickstart my SaaS project fast.", author: "Leo M" },
];

export default function Hero() {
  return (
    <section className="relative w-full bg-muted/30 dark:bg-background flex flex-col items-center justify-center overflow-hidden pt-[70px] pb-[40px]">
      {/* Background Dots/Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)', 
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      >
      </div>

      {/* Floating Testimonials - Left */}
      <div className="absolute left-[10%] xl:left-[14%] top-1/3 -translate-y-1/2 flex flex-col gap-6 hidden 2xl:flex pointer-events-none select-none">
        {testimonialsLeft.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: i === 1 ? 1 : 0.6, x: 0, filter: i === 1 ? 'blur(0px)' : 'blur(0.8px)' }} 
            transition={{ duration: 2.0, delay: 0.8 + i * 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
            className={`bg-white dark:bg-card p-6 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-transparent dark:border-border max-w-[240px] relative ${i === 1 ? 'z-10 scale-100' : 'z-0 scale-95'}`}
            style={{
                marginLeft: i === 1 ? '30px' : '0', 
                transform: `rotate(${i % 2 === 0 ? '-3deg' : '2deg'})`
            }}
          >
            <div className="absolute top-4 right-4 text-gray-200 dark:text-gray-700">
                <Quote size={20} fill="currentColor" />
            </div>
            <p className="text-foreground/80 dark:text-muted-foreground text-[14px] leading-relaxed font-medium mb-3 relative z-10">&quot;{t.quote}&quot;</p>
            <p className="text-foreground font-semibold text-xs text-right">— {t.author}</p>
          </motion.div>
        ))}
      </div>

      {/* Floating Testimonials - Right */}
      <div className="absolute right-[10%] xl:right-[14%] top-1/3 -translate-y-1/2 flex flex-col gap-6 hidden 2xl:flex pointer-events-none select-none">
        {testimonialsRight.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: i === 1 ? 1 : 0.6, x: 0, filter: i === 1 ? 'blur(0px)' : 'blur(0.8px)' }} 
            transition={{ duration: 2.0, delay: 0.8 + i * 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
            className={`bg-white dark:bg-card p-6 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-transparent dark:border-border max-w-[240px] relative ${i === 1 ? 'z-10 scale-100' : 'z-0 scale-95'}`}
            style={{
                marginRight: i === 1 ? '30px' : '0',
                transform: `rotate(${i % 2 === 0 ? '3deg' : '-2deg'})`
            }}
          >
            <div className="absolute top-4 right-4 text-gray-200 dark:text-gray-700">
                <Quote size={20} fill="currentColor" />
            </div>
            <p className="text-foreground/80 dark:text-muted-foreground text-[14px] leading-relaxed font-medium mb-3 relative z-10">&quot;{t.quote}&quot;</p>
            <p className="text-foreground font-semibold text-xs text-right">— {t.author}</p>
          </motion.div>
        ))}
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.0, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="mb-8 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-card rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100/80 dark:border-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
          </span>
          <span className="text-[13px] font-medium text-foreground tracking-tight">Open to Work</span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="text-center max-w-5xl mx-auto mb-8 relative z-10"
      >
        <span className="block text-[24px] md:text-[32px] lg:text-[40px] font-bold leading-[1.05] tracking-tight text-foreground">
          Web & Brand Design
        </span>
        <span className="block text-[24px] md:text-[32px] lg:text-[40px] font-bold leading-[1.05] tracking-tight text-foreground">
          For Ambitious Founders
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="text-center max-w-lg mx-auto text-[17px] text-muted-foreground mb-10 leading-relaxed relative z-10 font-medium"
      >
        We build conversion-driven websites and marketing that attract, engage, and convert.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="flex flex-col sm:flex-row items-center gap-4 relative z-10 mb-16"
      >
        <Link
          href="#"
          className="group relative flex items-center justify-center gap-2 px-7 py-3.5 bg-foreground text-background rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 text-[15px]"
        >
          Book A Call
          <div className="w-5 h-5 bg-background/20 flex items-center justify-center group-hover:translate-x-1 transition-transform rounded-full">
             <ArrowRight className="w-6 h-6 text-background" />
          </div>
        </Link>
        <Link
          href="#"
          className="group relative flex items-center justify-center gap-2 px-7 py-3.5 bg-background dark:bg-secondary text-foreground rounded-full font-medium border border-border transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md text-[15px]"
        >
          View Projects
        </Link>
      </motion.div>

      {/* Social Proof / Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="flex flex-col items-center gap-3 relative z-10"
      >
        <div className="flex -space-x-3">
            {[
                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=faces", 
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces", 
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces", 
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
            ].map((src, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                    <img src={src} alt="User" className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
        <div className="flex items-center gap-1">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-foreground" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <span className="text-xs font-semibold ml-2 text-foreground">From 150+ reviews</span>
        </div>
      </motion.div>
    </section>
  );
}
