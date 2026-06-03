"use client";

import Link from "next/link";
import BookCallLink from "@/components/BookCallLink";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  WorkflowMockup,
  LogicAIMockup,
  StackMockup,
  SprintMockup,
} from "./services/ServiceMockups";

type ServiceItem = {
  id: string;
  badge: string;
  title: string;
  description: string;
  tags: string[];
  Mockup: React.ComponentType;
};

const services: ServiceItem[] = [
  {
    id: "workflow",
    badge: "Workflow Automation",
    title: "Automate how your firm actually works",
    description:
      "We map intake, document chase, approvals, and reconciliations — then automate the manual steps partners hate. Built to your SOP, not a vertical SaaS template.",
    tags: ["Intake flows", "Approval chains", "Admin automation"],
    Mockup: WorkflowMockup,
  },
  {
    id: "logic-ai",
    badge: "Controlled AI",
    title: "AI bounded by your business logic",
    description:
      "No generic wrappers. Every AI step is gated by partner approval, firm rules, and a hard monthly spend cap — written into scope before kickoff.",
    tags: ["Spend caps", "Partner gates", "Firm rules"],
    Mockup: LogicAIMockup,
  },
  {
    id: "stack",
    badge: "Stack Integration",
    title: "Connect the tools you already use",
    description:
      "CRM, inbox, spreadsheets, and drives — unified in one workflow without rip-and-replace. Your stack stays; automation adapts to it.",
    tags: ["CRM sync", "Drive & sheets", "Email triggers"],
    Mockup: StackMockup,
  },
  {
    id: "sprint",
    badge: "The Automation Sprint",
    title: "One workflow. Fixed scope. Live in weeks.",
    description:
      "Optional Blueprint first, then a 3–6 week sprint that ships one production workflow your team uses Monday morning — fixed price, measurable ROI target.",
    tags: ["3–6 weeks", "Fixed price", "Blueprint first"],
    Mockup: SprintMockup,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ServiceRow({
  service,
  index,
  reducedMotion,
}: {
  service: ServiceItem;
  index: number;
  reducedMotion: boolean;
}) {
  const imageFirst = index % 2 === 1;
  const Mockup = service.Mockup;

  const slideFromImage = imageFirst ? -56 : 56;
  const slideFromText = imageFirst ? 56 : -56;

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, x: slideFromText }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
        className={imageFirst ? "lg:order-2" : "lg:order-1"}
      >
        <span className="mb-4 inline-flex rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
          {service.badge}
        </span>
        <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl lg:text-[2rem]">
          {service.title}
        </h3>
        <p className="mb-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]">
          {service.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag, tagIndex) => (
            <motion.span
              key={tag}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + tagIndex * 0.06, duration: 0.4 }}
              className="rounded-full border border-border/80 bg-background/50 px-3.5 py-1.5 text-xs font-medium text-foreground/75"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, x: slideFromImage }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        className={imageFirst ? "lg:order-1" : "lg:order-2"}
      >
        <motion.div
          whileInView={reducedMotion ? undefined : { y: [12, 0] }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Mockup />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden bg-background px-4 py-20 md:px-8 md:py-28 lg:py-32"
      aria-label="Services"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(33,74,156,0.06),transparent_60%)] dark:bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(33,74,156,0.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mb-16 flex flex-col items-center text-center md:mb-20 lg:mb-24"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm"
          >
            What we build
          </motion.span>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-4 max-w-3xl text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            Operational automation that
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              fits your firm
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[17px]"
          >
            We map, build, and ship custom workflows into your existing stack — not templates,
            not hype projects, not another tool your team has to bend around.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8"
          >
            <BookCallLink variant="secondary" showArrow />
          </motion.div>
        </motion.div>

        <div className="flex flex-col gap-20 md:gap-24 lg:gap-28">
          {services.map((service, index) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={index}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
