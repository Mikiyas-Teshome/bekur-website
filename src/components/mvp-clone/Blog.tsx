"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Blog() {
  return (
    <section className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 py-[85px]">
       <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false }}
               transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
             >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-muted-foreground font-bold tracking-widest text-sm">Blog</span>
                  {/* <div className="text-xl font-bold italic tracking-tighter">Lamosa</div> */}
                </div>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">
                  Operator insights
                </h2>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground leading-tight mb-6">
                  for running a practice.
                </h2>
                
                <p className="text-muted-foreground max-w-lg">
                   Logic-first takes on automation, AI spend, and reclaiming partner hours — written for managing partners, not IT departments.
                </p>
             </motion.div>
             
             {/* <button className="flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white rounded-full font-medium hover:scale-105 transition-transform">
                Get Template
                <ArrowRight className="w-4 h-4" />
             </button> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Left: Featured Large Card */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="group relative bg-card rounded-[32px] overflow-hidden min-h-[500px] flex flex-col justify-end p-8 md:p-10 shadow-[0_4px_16px_-6px_rgba(161,161,170,0.1)] hover:shadow-lg transition-shadow"
             >
                 <Link href="/blog/15" className="absolute inset-0 z-20" />
                 {/* Image Background Placeholder */}
                 <div className="absolute inset-0 z-0">
                    <Image 
                      src="https://minio.bekurtechnologies.com/bekur-hms/1765371872606-Machine Learning Integration in Web Applications.jpeg"
                      alt="Machine Learning Integration in Web Applications"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                 </div>
                 
                 <div className="relative z-10 text-white">
                     <div className="flex items-center justify-between text-xs font-medium text-gray-300 mb-4">
                         <span>Bekur Team• Jul 9, 2025</span>
                         <span>8 min</span>
                     </div>
                     
                     <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                         Machine Learning Integration in Web Applications
                     </h3>
                     
                     <div className="flex items-center justify-between">
                         <div className="flex gap-2">
                             <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">Machine Learning</span>
                             <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">Web Development</span>
                         </div>
                         
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                              <ArrowRight className="w-4 h-4" />
                         </div>
                     </div>
                 </div>
             </motion.div>

             {/* Right: Stacked Cards */}
             <div className="flex flex-col gap-8">
                 {/* Article 1 */}
                 <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="flex bg-card rounded-[32px] overflow-hidden p-6 gap-6 shadow-[0_4px_16px_-6px_rgba(161,161,170,0.1)] hover:shadow-lg transition-shadow items-center relative"
                 > 
                     <Link href="/blog/11" className="absolute inset-0 z-20" />
                     {/* Image */}
                     <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-muted flex-shrink-0 overflow-hidden">
                       <Image 
                         src="https://minio.bekurtechnologies.com/bekur-hms/1765367698840-The Future of Development.jpeg"
                         alt="The Future of Web Development"
                         fill
                         className="object-cover"
                       />
                     </div>
                     
                     <div className="flex flex-col h-full justify-between w-full">
                         <div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>Bekur Team • Jun 18, 2025</span>
                                <span>9 min</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 leading-tight">
                                The Future of Web Development: AI-Powered Development Tools
                            </h3>
                         </div>
                         
                         <div className="flex items-center justify-between mt-auto">
                            <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">Artificial Intelligence</span>
                            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                         </div>
                     </div>
                 </motion.div>

                 {/* Article 2 */}
                 <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.2, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="flex bg-card rounded-[32px] overflow-hidden p-6 gap-6 shadow-[0_4px_16px_-6px_rgba(161,161,170,0.1)] hover:shadow-lg transition-shadow items-center relative"
                 > 
                     <Link href="/blog/12" className="absolute inset-0 z-20" />
                     {/* Image */}
                     <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-muted flex-shrink-0 overflow-hidden">
                       <Image 
                         src="https://minio.bekurtechnologies.com/bekur-hms/1765369836236-Cybersecurity Best Practices for Modern Web Applications.webp"
                         alt="The Future of Web Development"
                         fill
                         className="object-cover"
                       />
                     </div>
                     
                     <div className="flex flex-col h-full justify-between w-full">
                         <div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>Bekur Team • Jul 4, 2025</span>
                                <span>12 min</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 leading-tight">
                                Cybersecurity Best Practices for Modern Web Applications
                            </h3>
                         </div>
                         
                         <div className="flex items-center justify-between mt-auto">
                            <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">Security</span>
                            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                         </div>
                     </div>
                 </motion.div>
             </div>
          </div>
          
          <div className="flex justify-end mt-12">
              <Link href="/blog">
                  <motion.button 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
                      className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors text-foreground"
                  >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                  </motion.button>
              </Link>
          </div>
       </div>
    </section>
  );
}
