"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogoSvg from "../../../public/assets/logo/Logo";
import MarketingButton from "./ui/MarketingButton";

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/portfolio" },
  { name: "Insights", href: "/blog" },
  { name: "About", href: "/about" },
];

export default function MarketingHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (item: NavItem) => {
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-mk-border bg-[#0A0A0C]/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8 lg:h-[72px]">
        <Link href="/" className="relative z-10 shrink-0" aria-label="Bekur Technologies home">
          <LogoSvg width={120} height={47} color1="#F4F4F4" color2="#FFFFFF" />
        </Link>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative text-[15px] transition-colors ${
                isActive(item)
                  ? "text-mk-text-1"
                  : "text-mk-text-2 hover:text-mk-text-1"
              }`}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-mk-accent transition-all duration-300 ${
                  isActive(item) ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <MarketingButton
            label="Book a call"
            className="hidden h-10 px-5 text-sm sm:inline-flex"
          />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-mk-border-strong text-mk-text-1 transition-colors hover:border-mk-accent-a25 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-mk-border bg-[#0A0A0C]/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-4 md:px-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-lg px-3 py-2.5 text-[15px] transition-colors ${
                  isActive(item)
                    ? "bg-mk-surface-2 text-mk-text-1"
                    : "text-mk-text-2 hover:bg-mk-surface-1 hover:text-mk-text-1"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <MarketingButton label="Book a call" className="mt-2 w-full" />
          </nav>
        </div>
      )}
    </header>
  );
}
