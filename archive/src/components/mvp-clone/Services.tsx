"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Code, Layout, Palette, Zap } from "lucide-react";

// Real image from the website (used for all services as per observation)
const SERVICE_IMAGE = "https://framerusercontent.com/images/vdtm4vbMi9SyPgj2Z1bVuq9b2o.png?width=960&height=1200";

const services = [
  {
    id: "web-design",
    icon: <Palette className="w-5 h-5" />,
    title: "Web Design & UX/UI",
    description: "Crafting sleek, user-focused interfaces in Figma that drive engagement and conversions.",
    image: SERVICE_IMAGE,
    imageColor: "from-orange-500 to-red-500" // kept as fallback/overlay background
  },
  {
    id: "no-code",
    icon: <Code className="w-5 h-5" />,
    title: "No-code Development",
    description: "Building robust, scalable websites using Webflow and Framer without the long dev cycles.",
    image: SERVICE_IMAGE,
    imageColor: "from-blue-500 to-purple-500"
  },
  {
    id: "mvp",
    icon: <Zap className="w-5 h-5" />,
    title: "MVP prototyping",
    description: "Rapidly turning ideas into clickable prototypes to validate concepts with real users.",
    image: SERVICE_IMAGE,
    imageColor: "from-green-500 to-emerald-500"
  },
  {
    id: "partner",
    icon: <Layout className="w-5 h-5" />,
    title: "Ongoing Design Partner",
    description: "Continuous design support to keep your product fresh and evolving with your user interactions.",
    image: SERVICE_IMAGE,
    imageColor: "from-pink-500 to-rose-500"
  }
];

export default function Services() {
  const [activeId, setActiveId] = useState(services[0].id);

  return (
    <section className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 py-[85px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: false }}
             transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
           >
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-0.5" /> 
               Services
             </div>
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
               From idea to scale.<br />
               <span className="text-muted-foreground">We master our craft.</span>
             </h2>
           </motion.div>
           
           <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-card sm:bg-transparent rounded-full border border-border shadow-sm hover:shadow-md transition-all text-foreground font-medium self-end md:self-auto"
           >
             Start A Project
             <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
           </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Accordion List */}
          <div className="flex flex-col gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => setActiveId(service.id)}
                className={`cursor-pointer rounded-[32px] overflow-hidden transition-colors duration-300 ${
                  activeId === service.id ? "bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]" : "bg-transparent hover:bg-card/50"
                }`}
              >
                <div className="p-6 md:p-8 flex flex-col gap-4 bg-white dark:bg-card border border-[#E5E7EB]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted text-foreground`}>
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: activeId === service.id ? 180 : 0 }}
                      className="text-muted-foreground"
                    >
                      {/* Chevron Icon */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {activeId === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                         <p className="text-normal text-md leading-relaxed pl-14 text-muted-foreground">
                           {service.description}
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dynamic Image Display */}
          <div className="relative h-[400px] lg:h-auto rounded-[40px] overflow-hidden bg-muted">
             <AnimatePresence mode="wait">
               {services.map((service) => (
                 activeId === service.id && (
                   <motion.div
                     key={service.id}
                     initial={{ opacity: 0, scale: 1.02 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.4 }}
                     className="absolute inset-0 w-full h-full"
                   >
                     <img 
                       src={service.image} 
                       alt={service.title}
                       className="w-full h-full object-cover"
                     />
                   </motion.div>
                 )
               ))}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
