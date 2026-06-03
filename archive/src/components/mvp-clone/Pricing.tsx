"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, Zap } from "lucide-react";

const plans = [
    {
        title: "Product design",
        desc: "Ideal for launching or revamping a website or product to boost conversions.",
        price: "$ 2,200",
        unit: "One time",
        features: [
            "Senior designer",
            "One Active Request",
            "7-10 Days delivery time",
            "SEO optimized",
            "1-1 Private Slack channel",
            "50% secured upfront payment",
            "3X faster delivery"
        ],
        isDark: false,
        buttonText: "Get Started Now"
    },
    {
        title: "Design partner",
        desc: "Perfect for monthly design partnerships, keeping your brand fresh and driving consistent conversions.",
        price: "$ 4,000",
        unit: "/ month",
        features: [
            "Dedicated team & expert designers",
            "Multiple requests under fair use",
            "2-3 Days delivery time",
            "Monthly CRO & Growth Strategy",
            "1-1 Private Slack channel",
            "50% secured upfront payment"
        ],
        isDark: false,
        buttonText: "Get Started Now"
    },
    {
        title: "Custom",
        desc: "Ideal for brands seeking unlimited design and motion support, delivering high-impact results without constraints.",
        price: "$ 9,000+",
        unit: "Starts at",
        features: [
            "Dedicated team & expert designers",
            "Unlimited requests",
            "2 Days Delivery, monthly commitment",
            "Advanced SEO & Marketing",
            "1-1 Private Slack channel",
            "50% secured upfront payment"
        ],
        isDark: true,
        buttonText: "Get Started Now",
        badge: "Limited spots"
    }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">
              Choose a plan.
            </h2>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground leading-tight mb-6">
              That fits your needs.
            </h2>
           
           <p className="text-muted-foreground max-w-lg mx-auto mb-8">
             Flexible plans designed to accelerate growth, with solutions that evolve as your business scales.
           </p>

           {/* Toggle Switch - Visual representation (functionality is limited as pricing content is static in design) */}
           {/* <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-[#171717]' : 'text-gray-400'}`}>Monthly</span>
              <button 
                 onClick={() => setIsAnnual(!isAnnual)}
                 className="w-12 h-7 bg-gray-200 rounded-full relative transition-colors duration-300"
              >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isAnnual ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-medium flex items-center gap-1 ${isAnnual ? 'text-[#171717]' : 'text-gray-400'}`}>
                  Yearly
                  <span className="text-[10px] uppercase bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">Save 20%</span>
              </span>
           </div> */}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {plans.map((plan, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, amount: 0.2 }}
               transition={{ delay: i * 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                className={`flex flex-col p-8 rounded-[32px] overflow-hidden relative ${
                    plan.isDark ? 'bg-primary text-primary-foreground shadow-xl dark:bg-card dark:text-foreground' : 'bg-card text-foreground shadow-[0_4px_16px_-6px_rgba(161,161,170,0.1)]'
                }`}
             >
                {/* Header */}
                <div className="mb-8">
                   <div className="flex justify-between items-start mb-4">
                       {/* Icon Placeholder */}
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.isDark ? 'bg-primary-foreground/10 dark:bg-muted' : 'bg-muted'}`}>
                          <div className={`w-4 h-4 rounded-sm border-2 ${plan.isDark ? 'border-primary-foreground/50 dark:border-muted-foreground' : 'border-foreground'}`} />
                       </div>
                       
                       {plan.badge && (
                           <span className="px-3 py-1 bg-[#E1443A] text-white text-xs font-bold rounded-full">{plan.badge}</span>
                       )}
                   </div>
                   
                   <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                   <p className={`text-sm leading-relaxed ${plan.isDark ? 'text-primary-foreground/70 dark:text-muted-foreground' : 'text-muted-foreground'}`}>
                      {plan.desc}
                   </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                       {plan.unit === "Starts at" && <span className={`text-sm ${plan.isDark ? 'text-primary-foreground/70 dark:text-muted-foreground' : 'text-muted-foreground'}`}>Starts at</span>}
                       <h4 className="text-4xl font-bold tracking-tight">{plan.price}</h4>
                       {plan.unit !== "Starts at" && <span className={`text-sm ${plan.isDark ? 'text-primary-foreground/70 dark:text-muted-foreground' : 'text-muted-foreground'}`}>{plan.unit}</span>}
                    </div>
                </div>

                {/* Features */}
                <div className="flex-grow mb-8 space-y-3">
                    {plan.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-start gap-3">
                            {/* Custom check icon */}
                             <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${ feature.includes("faster delivery") ? 'text-[#E1443A]' : (plan.isDark ? 'text-primary-foreground/50 dark:text-muted-foreground' : 'text-muted-foreground/50')}`} />
                             <span className={`text-sm font-medium ${plan.isDark ? 'text-primary-foreground/90 dark:text-foreground' : 'text-muted-foreground'}`}>{feature}</span>
                             {feature.includes("3X faster delivery") && (
                                 <span className="ml-auto text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-900">+$1k</span>
                             )}
                        </div>
                    ))}
                    {/* Toggle feature specific to first card */}
                    {i === 0 && (
                        <div className="flex items-center justify-between mt-4 p-3 bg-muted/50 rounded-xl border border-border">
                             <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-foreground">3X faster delivery</span>
                             </div>
                             <div className="text-xs font-bold text-foreground">+$1k</div>
                             {/* Toggle switch visual */}
                             <div className="w-8 h-5 bg-gray-200 rounded-full relative">
                                <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                             </div>
                        </div>
                    )}
                </div>

                {/* Button */}
                <button className={`w-full py-5 px-6 rounded-full font-bold flex items-center justify-between transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                    plan.isDark 
                    ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-white dark:text-black dark:hover:bg-gray-100' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-gray-900/20'
                }`}>
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4" />
                </button>
             </motion.div>
           ))}
        </div>

        {/* Optional Framer Badge at bottom right styled like screenshot */}
        {/* <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
             <div className="bg-[#0A0A0A] dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                 Get template Now
             </div>
             <div className="bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                 <span className="font-serif italic">f</span> Made in Framer
             </div>
        </div> */}
      </div>
    </section>
  );
}
