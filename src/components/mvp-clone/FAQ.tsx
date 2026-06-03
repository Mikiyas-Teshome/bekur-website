"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What is The Automation Sprint?",
    answer: "One production workflow, delivered in 3–6 weeks, for a fixed price. We start with Logic Mapping — understanding how your firm actually operates — then build into your existing stack with a hard monthly AI spend cap written into scope."
  },
  {
    question: "Do I need the Blueprint phase?",
    answer: "Not always, but we recommend it for first engagements. The Blueprint ($2,500) maps your business logic and fixes the sprint quote before full build. It credits toward the sprint if you proceed — and gives you a go/no-go gate before committing."
  },
  {
    question: "We tried SaaS tools before and they didn't fit. Why is this different?",
    answer: "Vertical SaaS is built for the median firm. When your workflow deviates, you bend to the product. We map your logic first and build around your stack — email, drives, CRM, spreadsheets — instead of replacing it."
  },
  {
    question: "How do you control AI costs?",
    answer: "Every sprint includes a hard monthly AI spend cap, written into scope before kickoff. No surprise token bills. We engineer for predictable economics, not open-ended experimentation."
  },
  {
    question: "Can you automate multiple workflows at once?",
    answer: "No — and that's intentional. One sprint, one workflow. Firms that try to 'do everything' end up with shelved pilots. Ship one workflow your team uses tomorrow, then decide on the next."
  },
  {
    question: "Who actually builds the work?",
    answer: "Senior-only team. The people in the discovery call build the work. No juniors learning on your project, no handoff to an offshore bench."
  },
  {
    question: "What industries do you work with?",
    answer: "Professional service firms — law, accounting, consulting, advisory, recruitment, agencies, and similar boutique knowledge-work practices. The wedge is the operator profile and pain pattern, not a single vertical."
  },
  {
    question: "What won't you take on?",
    answer: "Open-ended discovery, full SaaS replacement projects, compliance certifications we can't credibly deliver (SOC 2, HIPAA pipelines), or engagements where IT/procurement decides instead of the managing partner."
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
