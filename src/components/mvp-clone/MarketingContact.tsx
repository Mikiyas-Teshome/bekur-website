"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { getContactInfo } from "@/data/static-content";
import MarketingContactForm from "@/components/mvp-clone/MarketingContactForm";
import BookCallLink from "@/components/BookCallLink";
import { cn } from "@/lib/utils";
import { ease, fadeUp, headerContainer } from "./motion";

const iconMap = {
  email: Mail,
  phone: Phone,
  linkedin: Linkedin,
  location: MapPin,
} as const;

function contactHref(iconType: string, description: string, href?: string) {
  if (href) return href;
  if (iconType === "email") return `mailto:${description}`;
  if (iconType === "phone") return `tel:${description.replace(/[^\d+]/g, "")}`;
  return undefined;
}

export default function MarketingContact() {
  const reducedMotion = useReducedMotion();
  const contactInfo = getContactInfo();

  return (
    <section
      id="contact"
      className="relative w-full scroll-mt-28 overflow-hidden bg-background px-4 pb-20 pt-4 md:px-8 md:pb-28 lg:pb-32"
      aria-label="Contact us"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(33,74,156,0.06),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(33,74,156,0.12),transparent_65%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={headerContainer}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            Contact
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            Get in touch
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              with us
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
          >
            Have questions or ready to map a workflow? Fill out the form and we&apos;ll respond
            within one business day.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px] lg:gap-10 xl:grid-cols-[1fr_380px]">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease }}
            className="rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_8px_32px_-16px_rgba(33,74,156,0.12)] dark:bg-card/95 md:rounded-[32px] md:p-8 lg:p-10"
          >
            <MarketingContactForm />
          </motion.div>

          <motion.aside
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.1, duration: 0.7, ease }}
            className="lg:sticky lg:top-28"
          >
            <div className="rounded-[28px] border border-border/60 bg-card p-6 dark:bg-card/95 md:rounded-[32px] md:p-8">
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Reach us directly
              </p>

              <ul className="space-y-5">
                {contactInfo.map((item) => {
                  const Icon = iconMap[item.iconType];
                  const href = contactHref(item.iconType, item.description, item.href);
                  const label =
                    item.iconType === "email"
                      ? "E-mail"
                      : item.iconType === "phone"
                        ? "Phone"
                        : item.title;

                  const inner = (
                    <>
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {label}
                        </p>
                        <p
                          className={cn(
                            "text-base font-semibold leading-snug md:text-[17px]",
                            item.iconType === "location"
                              ? "text-muted-foreground"
                              : "text-foreground",
                          )}
                        >
                          {item.description}
                        </p>
                      </span>
                    </>
                  );

                  return (
                    <li key={item.id}>
                      {href ? (
                        <Link
                          href={href}
                          target={item.iconType === "linkedin" ? "_blank" : undefined}
                          rel={item.iconType === "linkedin" ? "noopener noreferrer" : undefined}
                          className="group flex items-start gap-3 transition-colors hover:text-primary dark:hover:text-chart-3"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className="flex items-start gap-3">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 border-t border-border/60 pt-8">
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Prefer a live conversation? Book a call and we&apos;ll walk through scope together.
                </p>
                <BookCallLink variant="primary" showArrow className="w-full sm:w-auto" />
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
