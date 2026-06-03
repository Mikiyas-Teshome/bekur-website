"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What is included with each Framer template?",
    answer: "Each template comes with a fully responsive design, editable components, and SEO-friendly structure ready to customize. We include a comprehensive guide to help you get started quickly."
  },
  {
    question: "Do I need coding skills to use your templates?",
    answer: "No coding skills are required. Framer is a visual builder, so you can edit text, images, and layout through a drag-and-drop interface similar to Figma."
  },
  {
    question: "Can I use a template for multiple projects?",
    answer: "Yes, you can use the template for unlimited personal and commercial projects. However, you cannot resell or redistribute the template itself."
  },
  {
    question: "Are the templates optimized for performance?",
    answer: "Absolutely. We build every template with speed and best practices in mind, ensuring high Lighthouse scores and fast load times for your visitors."
  },
  {
    question: "Do you offer support after purchase?",
    answer: "Yes, we providing ongoing support via email. If you get stuck or find a bug, just reach out and we'll help you resolve it."
  },
  {
    question: "Can I integrate third-party tools with these templates?",
    answer: "Yes, Framer supports integrations with popular tools like Gumroad, HubSpot, Intercom, and more through code overrides or embed components."
  },
  {
    question: "Do you offer customizations beyond the template?",
    answer: "We offer custom design and development services if you need extensive modifications or a completely unique site. Contact us to discuss your project."
  },
  {
    question: "Will my template receive updates?",
    answer: "Yes, we periodically update our templates to fix bugs and ensure compatibility with the latest Framer features. You'll receive these updates for free."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-muted/30 dark:bg-background px-4 md:px-8 py-[85px]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">
        {/* Header */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false }}
           transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
           className="lg:w-1/3 lg:sticky lg:top-24 lg:h-fit"
        >
           <div className="flex items-center gap-2 mb-6">
              <span className="text-muted-foreground font-bold tracking-widest text-sm">FAQ</span>
           </div>
           
           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-0">
             Got a question?
           </h2>
           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground leading-tight">
             We&apos;ve got answers.
           </h2>
        </motion.div>

        {/* FAQ List */}
        <div className="lg:w-2/3">
           <div className="bg-card rounded-[32px] p-2 shadow-[0_4px_16px_-6px_rgba(161,161,170,0.05)]">
              {faqs.map((faq, index) => (
                 <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: false, margin: "-50px" }}
                     transition={{ delay: index * 0.1, duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className={`rounded-[24px] px-6 md:px-8 transition-colors duration-300 ${openIndex === index ? 'bg-muted/50' : 'bg-transparent'}`}
                 >
                    <button
                       onClick={() => setOpenIndex(openIndex === index ? null : index)}
                       className="flex items-center justify-between w-full py-6 bg-transparent"
                    >
                       <span className="text-lg font-medium text-foreground text-left">{faq.question}</span>
                       <motion.div
                          animate={{ rotate: openIndex === index ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0 ml-4"
                       >
                          <Plus className={`w-5 h-5 ${openIndex === index ? 'text-foreground' : 'text-muted-foreground'}`} />
                       </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                       {openIndex === index && (
                          <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: "auto", opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.3 }}
                          >
                             <p className="text-muted-foreground pb-8 leading-relaxed">
                                {faq.answer}
                             </p>
                          </motion.div>
                       )}
                    </AnimatePresence>
                    
                    {/* Divider line if not last */}
                    {index !== faqs.length - 1 && (
                        <div className={`h-[1px] w-full bg-border ${openIndex === index ? 'opacity-0' : 'opacity-100'}`} />
                    )}
                 </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
