"use client";
import { useRef, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import ContactForm from "../contactForm";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { poppins5 } from "@/app/fonts";
import Email from "../../../public/assets/svg/Email";
import Phone from "../../../public/assets/svg/Phone";
import Linkden from "../../../public/assets/svg/Linkden";
import Location from "../../../public/assets/svg/Location";
import { useTheme } from "next-themes";
import { getContactInfo } from "@/data/static-content";

const GetInTouch = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ourInfo = getContactInfo();

  // Ensure component is mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use fallback color during SSR/hydration
  const color = mounted && resolvedTheme === "dark" ? "#F4F4F4" : "#214A9C";

  // Function to get icon component based on iconType
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case "email":
        return <Email color={color} />;
      case "phone":
        return <Phone color={color} />;
      case "linkedin":
        return <Linkden color={color} />;
      case "location":
        return <Location color={color} />;
      default:
        return <Email color={color} />;
    }
  };
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation - fade in from top
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Left section animation (Contact Form) - slide in from left
      gsap.fromTo(
        leftSectionRef.current,
        {
          opacity: 0,
          x: -120,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Right section animation (Office Image) - slide in from right
      gsap.fromTo(
        rightSectionRef.current,
        {
          opacity: 0,
          x: 120,
          scale: 0.9,
          rotationY: 15,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          rotationY: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-7">
      <div
        className="absolute -bottom-10 left-0 w-60 h-64 md:w-72 md:h-80 lg:w-80 lg:h-88 xl:w-[458.72px] xl:h-[458.81px] bg-gradient-blur pointer-events-none -z-10"
        style={{
          transform: "rotate(-121.16deg)",
          background:
            "linear-gradient(-121.16deg, rgba(33, 74, 156, 0.57), #214A9C)",
          filter: "blur(100px)",
          opacity: 0.78,
        }}
      />
      <div className="container mx-auto px-4 md:px-8 ">
        {/* Left Section - Contact Form */}
        <div className="space-y-13 ">
          {/* Header */}
          <div ref={headerRef}>
            <SectionHeader title="Our Contact" description="Contact" />
          </div>

          <div className="flex flex-col space-y-10 ">
            <h2
              className={`${poppins5.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary dark:text-foreground text-left`}
            >
              Let&apos;s Get In Touch !
            </h2>
            <div className="flex flex-col lg:flex-row gap-8 md:gap-3.5 px-0 md:px-14">
              {/* Our Info Section */}
              <div
                ref={rightSectionRef}
                className="flex flex-col flex-1 space-y-6 md:space-y-8"
              >
                <h3
                  className={`${poppins5.className} text-xl md:text-[2rem] text-primary dark:text-foreground`}
                >
                  Our Info
                </h3>

                {/* Mobile: 2-column grid, Medium+: Vertical layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-6 md:gap-17.5 md:space-y-0 ">
                  {ourInfo.length > 0 ? (
                    ourInfo.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex items-start space-x-3 md:space-x-5.25"
                      >
                        <div className="shrink-0">
                          {getIconComponent(item.iconType)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-secondary-foreground text-lg md:text-2xl leading-7.5 font-medium">
                            {item.title}
                          </h4>
                          {item.isLink ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground md:text-xl leading-7.5 wrap-break-words underline cursor-pointer hover:text-primary transition-colors"
                            >
                              {item.description}
                            </a>
                          ) : (
                            <p className="text-muted-foreground md:text-xl leading-7.5 wrap-break-words">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback when no data is available
                    <div className="text-center text-gray-500 col-span-2 md:col-span-1">
                      <p>Contact information not available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <div
                ref={leftSectionRef}
                className="flex-1 space-y-4 md:space-y-5.25"
              >
                <div>
                  <h3
                    className={`${poppins5.className} text-xl md:text-[2rem] text-primary dark:text-foreground`}
                  >
                    Your Message
                  </h3>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
