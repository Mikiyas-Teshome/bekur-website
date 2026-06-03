"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { getTeamMembers, type StaticTeamMember } from "@/data/static-content";

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

const headerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

function TeamMemberCard({
  member,
  index,
  reducedMotion,
}: {
  member: StaticTeamMember;
  index: number;
  reducedMotion: boolean;
}) {
  const linkedin = member.socialLinks?.linkedin;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.75, ease }}
      className="group/card flex flex-col overflow-hidden rounded-[20px] border border-border/50 bg-card transition-all duration-500 hover:border-border/80 hover:shadow-[0_24px_56px_-24px_rgba(33,74,156,0.28)] dark:border-border/40 dark:bg-card/95 dark:hover:border-border/60 md:rounded-[24px]"
    >
      <div className="p-3 pb-0 md:p-3.5 md:pb-0">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-neutral-950 md:rounded-2xl">
          <Image
            src={member.profileImage}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-cover object-top transition-transform duration-700 group-hover/card:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-transparent to-transparent" />
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-3 px-4 py-4 md:px-5 md:py-5">
        <div className="min-w-0 text-left">
          <h3 className="truncate text-base font-bold tracking-tight text-foreground md:text-lg">
            {member.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{member.title}</p>
        </div>

        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted/50 hover:text-primary dark:hover:text-chart-3"
          >
            <Linkedin className="h-5 w-5" strokeWidth={1.5} />
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function Team() {
  const reducedMotion = useReducedMotion();
  const teamMembers = getTeamMembers();

  return (
    <section
      className="relative w-full overflow-hidden bg-background px-4 py-20 md:px-8 md:py-28 lg:py-32"
      aria-label="Our team"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(33,74,156,0.06),transparent_65%)] dark:bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(33,74,156,0.14),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3, margin: "-60px" }}
          variants={headerContainer}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-16 lg:mb-20"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Our team
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            Meet the minds behind{" "}
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              Bekur
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
          >
            We bring together business logic and engineering to ship custom automation your firm
            actually uses — senior-only, from discovery through go-live.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              index={index}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.15, duration: 0.65, ease }}
          className="mt-12 flex justify-center md:mt-14"
        >
          <Link
            href="/about"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 dark:text-chart-3"
          >
            Learn more about how we work
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
