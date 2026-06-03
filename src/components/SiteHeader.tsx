"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";
import LogoSvg from "../../public/assets/logo/Logo";
import { ThemeToggle } from "./theme-toggle";
import BookCallLink from "./BookCallLink";
import { dmSans5 } from "@/app/fonts";

type NavItem = {
  name: string;
  href: string;
  homeSectionId?: string;
};

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/portfolio" },
  { name: "Insights", href: "/#insights", homeSectionId: "insights" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (item.homeSectionId) {
      return false;
    }
    if (item.href === "/") {
      return pathname === "/";
    }
    if (item.href === "/blog") {
      return pathname === "/blog" || pathname.startsWith("/blog/");
    }
    return pathname.startsWith(item.href);
  };

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    if (!item.homeSectionId) return;

    if (pathname === "/") {
      event.preventDefault();
      setMobileOpen(false);
      document.getElementById(item.homeSectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState(null, "", `/#${item.homeSectionId}`);
      return;
    }

    event.preventDefault();
    setMobileOpen(false);
    window.location.href = `/#${item.homeSectionId}`;
  };

  const isDark = !mounted || resolvedTheme !== "light";

  const logoColors = isDark
    ? { color1: "#F4F4F4", color2: "#FFFFFF" }
    : { color1: "#214A9C", color2: "#0a0a0a" };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "border-b border-white/10 bg-[#000104]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "border-b border-border bg-background/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:h-[72px]">
        <Link href="/" className="relative z-10 shrink-0" aria-label="Bekur Technologies home">
          <LogoSvg width={120} height={47} color1={logoColors.color1} color2={logoColors.color2} />
        </Link>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavClick(event, item)}
              className={`${dmSans5.className} relative text-[15px] transition-colors ${
                isActive(item)
                  ? isDark
                    ? "text-white"
                    : "text-foreground"
                  : isDark
                    ? "text-white/60 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                  isDark ? "bg-white" : "bg-foreground"
                } ${isActive(item) ? "w-full" : "w-0"}`}
              />
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <BookCallLink variant="header" />
          <button
            type="button"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors lg:hidden ${
              isDark
                ? "border-white/15 text-white"
                : "border-border text-foreground"
            }`}
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className={`border-t backdrop-blur-xl lg:hidden ${
            isDark
              ? "border-white/10 bg-[#000104]/95"
              : "border-border bg-background/95"
          }`}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 md:px-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(event) => handleNavClick(event, item)}
                className={`rounded-lg px-3 py-2.5 text-[15px] transition-colors ${
                  isActive(item)
                    ? isDark
                      ? "bg-white/10 text-white"
                      : "bg-muted text-foreground"
                    : isDark
                      ? "text-white/70 hover:bg-white/5 hover:text-white"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <BookCallLink variant="headerMobile" className="w-full" />
          </nav>
        </div>
      )}
    </header>
  );
}
