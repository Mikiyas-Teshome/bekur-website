"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

// Real Project Data
const projects = [
  {
    id: 13,
    title: "Finden",
    stats: "+45% engagement, -20% churn",
    image: "https://minio.bekurtechnologies.com/bekur-hms/1765450377815-finden.jpg",
  },
  {
    id: 14,
    title: "Bekur HMS",
    stats: "+21% signup conversion rate",
    image: "https://minio.bekurtechnologies.com/bekur-hms/1765450466670-vigorHMS.jpg",
  },
  {
    id: 8,
    title: "Mental Bank",
    stats: "Real-time data for modern teams",
    image: "https://minio.bekurtechnologies.com/bekur-hms/1765449915633-mental bank.jpg",
  }
];

const AUTOPLAY_DURATION = 5000; // 5 seconds

export default function FeaturedProject() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [key, setKey] = useState(0); // Key to reset timer/animation

  // Auto-advance timer
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTOPLAY_DURATION);

    return () => clearInterval(timer);
  }, [isAutoPlaying, activeIndex, key]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % projects.length);
    setKey(prev => prev + 1); // Reset animation
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    setKey(prev => prev + 1); // Reset animation
    // Don't stop autoplay on manual nav if following reference behavior, 
    // but usually user interaction pauses it. Let's keep it playing but reset timer.
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setKey(prev => prev + 1); // Reset animation
  };

  const currentProject = projects[activeIndex];

  return (
    <section className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 py-[85px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="max-w-7xl mx-auto"
      >
        <div className="relative w-full bg-card rounded-[40px] p-3 md:p-4 shadow-[0_4px_16px_-6px_rgba(161,161,170,0.15)] hover:shadow-[0_8px_30px_-6px_rgba(161,161,170,0.2)] transition-shadow duration-500">
          
          {/* Header Row: Title, Stats, Controls/Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-6 md:px-6 md:py-6 gap-6">
             <div className="flex flex-col gap-1">
                 <AnimatePresence mode="wait">
                    <motion.h3 
                        key={`title-${currentProject.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-[24px] font-medium text-foreground leading-tight"
                    >
                        {currentProject.title}
                    </motion.h3>
                 </AnimatePresence>
                 
                 <AnimatePresence mode="wait">
                    <motion.p 
                        key={`stats-${currentProject.id}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-[16px] text-muted-foreground font-normal"
                    >
                        {currentProject.stats}
                    </motion.p>
                 </AnimatePresence>
             </div>

             <div className="flex items-center gap-4">
                 {/* Navigation Arrows (Desktop) */}
                 <div className="hidden md:flex items-center gap-2">
                     <button 
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-105 transition-all active:scale-95"
                    >
                         <ArrowLeft className="w-4 h-4" />
                     </button>
                     <button 
                        onClick={handleNext}
                        className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-105 transition-all active:scale-95"
                    >
                         <ArrowRight className="w-4 h-4" />
                     </button>
                 </div>

                 {/* View Project Button */}
                 <Link href={`/portfolio/${currentProject.id}`}>
                     <button className="flex items-center gap-2 px-5 py-2.5 bg-background rounded-full border border-border shadow-sm hover:shadow-md transition-all active:scale-95 group">
                         <span className="text-[15px] font-medium text-foreground">View Project</span>
                         <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                         </div>
                     </button>
                 </Link>
             </div>
          </div>

          {/* Image Container */}
          <div className="relative w-full h-[400px] md:h-[750px] bg-background rounded-[32px] overflow-hidden group/image">
             <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentProject.id}
                    custom={direction}
                    variants={{
                        enter: (direction: number) => ({
                            x: direction > 0 ? 1000 : -1000,
                            opacity: 0,
                            zIndex: 1 // Coming in
                        }),
                        center: {
                            zIndex: 1,
                            x: 0,
                            opacity: 1
                        },
                        exit: (direction: number) => ({
                            zIndex: 0,
                            x: direction < 0 ? 1000 : -1000,
                            opacity: 0
                        })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                     <Link href={`/portfolio/${currentProject.id}`} className="block w-full h-full">
                         <motion.img 
                            src={currentProject.image} 
                            alt={currentProject.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1.0 }}
                            transition={{ duration: 6, ease: "linear" }}
                         />
                         <div className="absolute inset-0 bg-black/5" />
                     </Link>
                </motion.div>
             </AnimatePresence>

             {/* Carousel Progress Indicators */}
             <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3">
                 {projects.map((project, index) => {
                     const isActive = index === activeIndex;
                     return (
                         <button
                            key={project.id}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative w-[60px] h-[36px] md:w-[80px] md:h-[48px] rounded-[8px] overflow-hidden transition-all duration-300 ${
                                isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                            }`}
                         >
                             <img 
                                src={project.image} 
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                             />
                             {/* Progress Border Animation for Active Item */}
                             {isActive && isAutoPlaying && (
                                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                     <motion.rect
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: AUTOPLAY_DURATION / 1000, ease: "linear" }}
                                        // Reset animation when key changes
                                        key={key}
                                        x="2" y="2" 
                                        width="100%" height="100%" 
                                        className="w-[calc(100%-4px)] h-[calc(100%-4px)]"
                                        rx="6" ry="6" // slightly less than outer radius
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                     />
                                 </svg>
                             )}
                             {/* Static Border for active state if autoplay pauses or just to show selected */}
                             {isActive && !isAutoPlaying && (
                                 <div className="absolute inset-0 border-2 border-white rounded-[8px]" />
                             )}
                         </button>
                     );
                 })}
             </div>

             {/* Mobile Navigation Overlay (Hidden in this layout since we have thumbnails, but keeping simple arrows for strict mobile if needed, or removing to rely on thumbnails/swipe. Removing based on specific 'no thumbnails' instruction previously reversed by this new instruction, so we trust thumbnails are enough or let's keep arrows minimal) */}
          </div>

        </div>
      </motion.div>
    </section>
  );
}
