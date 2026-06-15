"use client";

import Link from "next/link";
import BookCallLink from "@/components/BookCallLink";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarClock,
  GitBranch,
  Layers,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-[10px] bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-[0_4px_24px_-4px_rgba(33,74,156,0.55)] transition-all hover:shadow-[0_8px_32px_-4px_rgba(33,74,156,0.65)] active:scale-[0.98] sm:w-auto sm:min-w-[200px] sm:h-[52px] sm:px-9 ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0.14)_0%,transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="relative">{children}</span>
      <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border/90 bg-card/70 px-7 text-[15px] font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/35 hover:bg-card active:scale-[0.98] sm:w-auto sm:min-w-[168px]"
    >
      {children}
    </Link>
  );
}


function WorkflowSVGDiagram({ reducedMotion }: { reducedMotion: boolean }) {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const allPaths = {
    "path-in-1": "M 120 120 C 220 120, 220 250, 320 250",
    "path-in-2": "M 120 250 L 320 250",
    "path-in-3": "M 120 380 C 220 380, 220 250, 320 250",
    "path-core-link": "M 380 250 L 480 250",
    "path-out-1": "M 540 250 C 640 250, 660 120, 760 120",
    "path-out-2": "M 540 250 L 760 250",
    "path-out-3": "M 540 250 C 640 250, 660 380, 760 380",
    "path-final-1": "M 820 120 L 900 120",
    "path-final-2": "M 820 250 L 900 250",
    "path-final-3": "M 820 380 L 900 380",
  };

  const allNodes = [
    { id: "node-in-1", cx: 120, cy: 120, r: 30, icon: "📧" },
    { id: "node-in-2", cx: 120, cy: 250, r: 30, icon: "📝" },
    { id: "node-in-3", cx: 120, cy: 380, r: 30, icon: "🔗" },
    { id: "node-parser", cx: 350, cy: 250, r: 35, icon: "🔍", rect: true, w: 70, h: 70 },
    { id: "node-core", cx: 510, cy: 250, r: 35, icon: "⚙️", rect: true, w: 70, h: 70 },
    { id: "node-out-1", cx: 790, cy: 120, r: 30, icon: "📄" },
    { id: "node-out-2", cx: 790, cy: 250, r: 30, icon: "✅" },
    { id: "node-out-3", cx: 790, cy: 380, r: 30, icon: "📊" },
    { id: "node-final-sync", cx: 930, cy: 250, r: 30, icon: "✓", final: true },
  ];

  // Animation steps - nodes accumulate as flow progresses
  // 0: Inputs → Parser
  // 1: Parser → Core (keep inputs/parser active)
  // 2: Core → Outputs (keep all previous active)
  // 3: Outputs → Final (keep all active)
  const getActiveNodes = () => {
    const nodes = [];
    if (animationStep >= 0) nodes.push("node-in-1", "node-in-2", "node-in-3", "node-parser");
    if (animationStep >= 1) nodes.push("node-core");
    if (animationStep >= 2) nodes.push("node-out-1", "node-out-2", "node-out-3");
    if (animationStep >= 3) nodes.push("node-final-sync");
    // Step 4: All nodes active showing complete flow
    if (animationStep === 4) return ["node-in-1", "node-in-2", "node-in-3", "node-parser", "node-core", "node-out-1", "node-out-2", "node-out-3", "node-final-sync"];
    return nodes;
  };

  const getActivePaths = () => {
    const paths = [];
    if (animationStep >= 0) paths.push("path-in-1", "path-in-2", "path-in-3");
    if (animationStep >= 1) paths.push("path-core-link");
    if (animationStep >= 2) paths.push("path-out-1", "path-out-2", "path-out-3");
    if (animationStep >= 3) paths.push("path-final-1", "path-final-2", "path-final-3");
    // Step 4: Show complete flow with all paths animated
    if (animationStep === 4) return ["path-in-1", "path-in-2", "path-in-3", "path-core-link", "path-out-1", "path-out-2", "path-out-3", "path-final-1", "path-final-2", "path-final-3"];
    return paths;
  };

  const activeNodes = getActiveNodes();
  const activePaths = getActivePaths();

  const badges = ["Matter intake", "Document chase", "Billing reconciliation", "Complete workflow"];
  const badge = animationStep === 4 ? "Complete workflow" : badges[animationStep % 3];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-background p-6 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(74,144,226,0.12),transparent_70%)]" />

      <motion.div className="mb-4 flex items-center justify-between" key={badge}>
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {badge} · Sprint
        </motion.span>
      </motion.div>

      <div className="relative flex items-center justify-center overflow-hidden rounded-xl">
        <svg
          className="w-full h-auto max-h-96"
          viewBox="0 0 1000 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glow-demo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="grad-active-demo" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary, #214a9c)" />
              <stop offset="50%" stopColor="var(--chart-2, #4a90e2)" />
              <stop offset="100%" stopColor="var(--chart-3, #7bb3f0)" />
            </linearGradient>
          </defs>

          {/* Subtle background paths */}
          <g className="text-muted-foreground/10" opacity="0.15">
            {Object.entries(allPaths).map(([id, d]) => (
              <path key={`bg-${id}`} d={d} stroke="currentColor" strokeWidth="2.5" fill="none" />
            ))}
          </g>

          {/* Animated active paths - solid gradient lines with glow */}
          <g>
            {activePaths.map((pathId) => (
              <motion.g key={`active-${pathId}`}>
                {/* Glow layer */}
                <motion.path
                  d={allPaths[pathId as keyof typeof allPaths]}
                  stroke="url(#grad-active-demo)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.3"
                  filter="url(#glow-demo)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.4 }}
                />
                {/* Main animated line */}
                <motion.path
                  d={allPaths[pathId as keyof typeof allPaths]}
                  stroke="url(#grad-active-demo)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,1000;1000,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </motion.path>
              </motion.g>
            ))}
          </g>

          {/* Animated nodes */}
          <g>
            {allNodes.map((node) => {
              const isActive = activeNodes.includes(node.id);
              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0.2, scale: 0.9 }}
                  animate={{
                    opacity: isActive ? 1 : 0.2,
                    scale: isActive ? 1 : 0.85,
                    filter: isActive ? "brightness(1.3) drop-shadow(0 0 12px var(--primary))" : "brightness(1)",
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {node.rect ? (
                    <motion.rect
                      x={node.cx - node.w! / 2}
                      y={node.cy - node.h! / 2}
                      width={node.w}
                      height={node.h}
                      rx="14"
                      fill="currentColor"
                      fillOpacity={isActive ? 0.2 : 0.06}
                      stroke="currentColor"
                      strokeWidth={isActive ? 2.5 : 2}
                      className="text-foreground/60"
                    />
                  ) : (
                    <motion.circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r}
                      fill="currentColor"
                      fillOpacity={isActive ? 0.2 : 0.06}
                      stroke="currentColor"
                      strokeWidth={isActive ? 2.5 : 2}
                      className="text-foreground/60"
                    />
                  )}
                  <motion.text
                    x={node.cx}
                    y={node.cy + 6}
                    fontFamily="inherit"
                    fontSize={node.rect ? "32" : "28"}
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="currentColor"
                    fillOpacity={isActive ? 1 : 0.35}
                    animate={{ scale: isActive ? 1.1 : 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    {node.icon}
                  </motion.text>
                </motion.g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function SolutionBridge() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden bg-background px-4 py-20 md:px-8 md:py-28 lg:py-32"
      aria-label="The Automation Sprint"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_20%,rgba(33,74,156,0.09),transparent_55%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_80%_20%,rgba(33,74,156,0.16),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12 xl:gap-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col lg:max-w-xl"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                The Automation Sprint
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-5 text-[1.85rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem]"
            >
              We don&apos;t bend your firm to the{" "}
              <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
                tool.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
            >
              We build automation to your firm&apos;s logic — one production workflow, fixed
              scope and price, hard AI cap — shipped in 3–6 weeks into the stack you already
              use.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
            >
              <PrimaryButton href="/automation-sprint" className="whitespace-nowrap">Explore the Sprint</PrimaryButton>
              <BookCallLink variant="secondary" frameClassName="w-full sm:min-w-[168px]" />
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {[
                { icon: CalendarClock, label: "3–6 weeks" },
                { icon: Layers, label: "Fixed scope" },
                { icon: ShieldCheck, label: "AI cap" },
                { icon: GitBranch, label: "Blueprint first" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/50 px-3 py-2.5 backdrop-blur-sm"
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
                  <span className="text-xs font-medium text-foreground/80">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <WorkflowSVGDiagram reducedMotion={!!reducedMotion} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
