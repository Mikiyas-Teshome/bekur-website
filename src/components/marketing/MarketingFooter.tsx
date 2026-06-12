"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapReveal } from "./motion/useGsapReveal";
import { FOOTER_ANIMATION_REFRESH_EVENT } from "@/hooks/useFooterAnimationRefresh";

const LINKEDIN_URL = "https://www.linkedin.com/company/bekur-technologies";
const CONTACT_EMAIL = "miki@bekurtechnologies.com";

const navColumns = [
  {
    heading: "Company",
    links: [
      { label: "Work", href: "/portfolio" },
      { label: "About", href: "/about" },
      { label: "Insights", href: "/blog" },
      { label: "Book a call", href: "/blueprint#book" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export default function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  const rootRef = useGsapReveal<HTMLElement>(({ root, gsap, ScrollTrigger }) => {
    const content = root.querySelector<HTMLElement>("[data-footer-content]");
    if (!content) return;

    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 0.8,
      invalidateOnRefresh: true,
      refreshPriority: -1,
      animation: gsap.fromTo(
        content,
        { y: () => -root.offsetHeight * 0.4, force3D: true },
        { y: 0, ease: "none", force3D: true },
      ),
    });
  });

  useEffect(() => {
    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener(FOOTER_ANIMATION_REFRESH_EVENT, handleRefresh);
    return () =>
      window.removeEventListener(FOOTER_ANIMATION_REFRESH_EVENT, handleRefresh);
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden border-t border-mk-border bg-mk-bg"
    >
      <div
        data-footer-content
        className="mx-auto w-full max-w-[1200px] px-4 pt-16 md:px-8 md:pt-20"
      >
        <div className="grid gap-12 pb-16 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <p className="font-mono-mk text-[11px] uppercase tracking-[0.16em] text-mk-text-3">
              Bekur Technologies
            </p>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mk-text-2">
              We don&apos;t bend your firm to the tool. We build the tool to
              your firm.
            </p>
            <div className="mt-6 space-y-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block w-fit text-sm text-mk-text-1 transition-colors hover:text-mk-accent"
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-fit text-sm text-mk-text-1 transition-colors hover:text-mk-accent"
              >
                LinkedIn
              </a>
            </div>
            <p className="mt-6 text-xs text-mk-text-3">Addis Ababa, Ethiopia</p>
          </div>

          {navColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="font-mono-mk text-[11px] uppercase tracking-[0.16em] text-mk-text-3">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-mk-text-2 transition-colors hover:text-mk-text-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="pointer-events-none flex items-end justify-center overflow-hidden">
          <h2
            aria-hidden
            className="select-none whitespace-nowrap font-display text-[13vw] font-semibold leading-[0.85] tracking-tight md:text-[10vw] lg:text-[120px]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0.02))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Bekur Technologies
          </h2>
        </div>

        <div className="border-t border-mk-border py-6">
          <p className="text-center text-[13px] text-mk-text-3">
            © {currentYear} Bekur Technologies. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
