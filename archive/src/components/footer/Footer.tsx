"use client";

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmSans5, grotesk, inter } from "@/app/fonts";
import BookCallButton from "../BookCallButton";
import { FOOTER_ANIMATION_REFRESH_EVENT } from "@/hooks/useFooterAnimationRefresh";

const getAnimationConfig = () => {
  const isMobile = window.innerWidth < 768;

  return {
    depth: isMobile ? 0.6 : 0.7,
    start: isMobile ? "top 90%" : "top bottom",
    scrub: isMobile ? 0.5 : 1,
  };
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerWrapperRef = useRef<HTMLElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pathname = usePathname();

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((callback: () => void, delay: number) => {
    const timerId = setTimeout(callback, delay);
    timersRef.current.push(timerId);
    return timerId;
  }, []);

  const resetFooterContent = useCallback((content: HTMLDivElement | null) => {
    if (!content) return;

    gsap.set(content, {
      y: 0,
      opacity: 1,
      visibility: "visible",
      clearProps: "transform",
    });
  }, []);

  const killAnimation = useCallback(() => {
    scrollTriggerRef.current?.kill();
    scrollTriggerRef.current = null;
    resetFooterContent(footerContentRef.current);
  }, [resetFooterContent]);

  const setupAnimation = useCallback(() => {
    const footerWrapper = footerWrapperRef.current;
    const footerContent = footerContentRef.current;

    if (!footerWrapper || !footerContent) return;

    scrollTriggerRef.current?.kill();
    scrollTriggerRef.current = null;

    gsap.set(footerContent, {
      clearProps: "transform",
      opacity: 1,
      visibility: "visible",
    });

    const footerHeight = footerWrapper.offsetHeight;
    if (footerHeight <= 0) {
      gsap.set(footerContent, { y: 0 });
      return;
    }

    const config = getAnimationConfig();
    const wrapperRect = footerWrapper.getBoundingClientRect();

    if (wrapperRect.top <= window.innerHeight * 0.85) {
      gsap.set(footerContent, { y: 0 });
      return;
    }

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: footerWrapper,
      start: config.start,
      end: "bottom bottom",
      scrub: config.scrub,
      invalidateOnRefresh: true,
      refreshPriority: -1,
      animation: gsap.fromTo(
        footerContent,
        {
          y: () => -footerWrapper.offsetHeight * getAnimationConfig().depth,
          force3D: true,
        },
        {
          y: 0,
          ease: "none",
          force3D: true,
        }
      ),
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let observerTimer: ReturnType<typeof setTimeout> | undefined;

    const debouncedSetup = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupAnimation, 150);
    };

    const handleRefresh = () => {
      killAnimation();
      scheduleTimer(() => {
        setupAnimation();
        scheduleTimer(() => ScrollTrigger.refresh(), 200);
      }, 100);
    };

    scheduleTimer(() => {
      setupAnimation();
      scheduleTimer(() => ScrollTrigger.refresh(), 300);
    }, 100);

    window.addEventListener("resize", debouncedSetup);
    window.addEventListener(FOOTER_ANIMATION_REFRESH_EVENT, handleRefresh);

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(observerTimer);
      observerTimer = setTimeout(setupAnimation, 150);
    });

    if (footerWrapperRef.current) {
      resizeObserver.observe(footerWrapperRef.current);
    }

    return () => {
      clearTimeout(resizeTimer);
      clearTimeout(observerTimer);
      clearTimers();
      window.removeEventListener("resize", debouncedSetup);
      window.removeEventListener(FOOTER_ANIMATION_REFRESH_EVENT, handleRefresh);
      resizeObserver.disconnect();
      killAnimation();
    };
  }, [
    pathname,
    clearTimers,
    killAnimation,
    scheduleTimer,
    setupAnimation,
  ]);

  return (
    <footer
      ref={footerWrapperRef}
      className="footer-wrapper relative overflow-hidden min-h-[200px]"
    >
      <div
        ref={footerContentRef}
        className="footer-content container mx-auto space-y-4 py-4 md:py-8"
      >
        <div className="px-4 space-y-8 md:space-y-18">
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 md:space-y-16 py-0 md:pt-13">
            <h2
              className={`${dmSans5.className} text-[2rem] md:text-4xl lg:text-[5rem] leading-[2.875rem] md:leading-[3.5rem] lg:leading-[4.5rem] tracking-[-2.4px] font-bold text-footer-text-light text-center`}
            >
              <span>LET&apos;S </span>
              <span className="text-dark-background dark:text-[#6B6B6B]">
                COLLAB{" "}
              </span>
              <span>TODAY.</span>
              <br />
              <span>AND </span>
              <span className="text-dark-background dark:text-[#6B6B6B]">
                BUILD{" "}
              </span>
              <span>YOUR EXPECTATIONS.</span>
            </h2>

            <BookCallButton
              className="px-12.5 h-15 text-xl md:text-[1.75rem]"
              text="Book A Call"
            />
          </div>

          <div className="flex items-center justify-center pointer-events-none z-0">
            <h2
              className={`${grotesk.className} text-3xl md:text-[4.5rem] lg:text-6xl xl:text-[8.25rem] leading-[100%] tracking-[-6%] select-none pb-2.5`}
              style={{
                background:
                  "linear-gradient(to bottom, var(--footer-gradient-start), var(--footer-gradient-end))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: 1,
              }}
            >
              Bekur Technologies
            </h2>
          </div>

          <div className="border-t border-footer-border pt-4 md:pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p
                className={`${inter.className} text-muted-foreground dark:text-muted-foreground text-[13px] md:text-base font-normal leading-[140%] tracking-[2%]`}
              >
                © {currentYear} All Right Reserved. Designed By Bekur
                Technologies
              </p>
              <div className="flex space-x-4.25">
                <Link
                  href="#"
                  className={`${inter.className} text-foreground dark:text-muted-foreground text-[13px] md:base font-normal leading[140%] tracking-[2%]`}
                >
                  Terms of service
                </Link>
                <Link
                  href="#"
                  className={`${inter.className} text-foreground dark:text-muted-foreground text-[13px] md:base font-normal leading[140%] tracking-[2%]`}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
