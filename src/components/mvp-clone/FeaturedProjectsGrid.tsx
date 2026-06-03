"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "Finden",
    tags: ["AI Product", "Product Hunt #3"],
    image: "https://minio.bekurtechnologies.com/bekur-hms/1765450377815-finden.jpg",
    color: "from-gray-800 to-gray-900",
    id: 13,
  },
  {
    title: "Bekur HMS",
    tags: ["SaaS", "Multi-tenant"],
    image: "https://minio.bekurtechnologies.com/bekur-hms/1765450466670-vigorHMS.jpg",
    color: "from-gray-900 to-black",
    id: 14,
  },
  {
    title: "Feres",
    tags: ["Mobile", "1M+ downloads"],
    image: "https://minio.bekurtechnologies.com/bekur-hms/1765449915633-mental bank.jpg",
    color: "from-blue-900 to-slate-900",
    id: 8,
  },
  {
    title: "Debo",
    tags: ["GovTech", "50K+ cases tracked"],
    image: "https://minio.bekurtechnologies.com/bekur-hms/1765449752627-flikia.png",
    color: "from-emerald-900 to-teal-950",
    id: 7,
  }
];

export default function FeaturedProjectsGrid() {
  return (
    <section className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 py-[85px]">
       <div className="max-w-7xl mx-auto">
           <div className="flex flex-col justify-center items-center mb-12 gap-6 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="text-center w-full mx-auto"
              >
                 <p className="text-lg text-muted-foreground font-medium mb-2">Selected work</p>
                 <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                    <span>Production systems</span><br/>
                    <span className="text-muted-foreground">we&apos;ve shipped.</span>
                 </h2>
              </motion.div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {projects.map((project, i) => (
                <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: false, amount: 0.2 }}
                   transition={{ delay: i * 0.2, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                   className="group bg-card p-6 rounded-[40px] shadow-[0_4px_16px_-6px_rgba(161,161,170,0.15)] hover:shadow-[0_8px_30px_-6px_rgba(161,161,170,0.2)] transition-shadow duration-300 relative"
                >
                   <Link href={`/portfolio/${project.id}`} className="absolute inset-0 z-20" />
                   {/* Header */}
                   <div className="flex justify-between items-start mb-6 relative z-10 pointer-events-none">
                      <div>
                         <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                         <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                               <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                                  {tag}
                               </span>
                            ))}
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                         View <ArrowRight className="w-4 h-4" />
                      </div>
                   </div>

                   {/* Image Area */}
                   <div className="w-full h-[300px] md:h-[400px] rounded-[32px] overflow-hidden bg-muted relative z-10 pointer-events-none">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        sizes="(max-width: 768px) 100vw, 50vw" 
                      />
                   </div>
                </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}
