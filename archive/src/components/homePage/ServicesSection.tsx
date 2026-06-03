"use client";
import { useRef, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getServices } from "@/data/static-content";

const ServicesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const servicesListRef = useRef<HTMLDivElement>(null);
  const services = getServices();

  // Map service titles to paths
  const servicePaths: Record<string, string> = {
    "Outsource": "/services/outsource",
    // "UI/UX Design": "/services/ui-ux",
    // "Graphics Design": "/services/graphics-design",
    "Digital Marketing": "/services/digital-marketing",
    "Social Media Management": "/services/social-media-management",
    // "Web Development": "/services/website-development",
    // "App Development": "/services/app-development",
    "Website Development": "/services/website-development",
    "UI/UX": "/services/ui-ux",
    "Graphics": "/services/graphics-design",
    "Social Media": "/services/social-media",
  };

  // GSAP animations setup
  useEffect(() => {
    if (services.length === 0) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: 50,
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

      // Services list entrance animation
      const serviceCards =
        servicesListRef.current?.querySelectorAll(".service-card");
      if (serviceCards) {
        serviceCards.forEach((card, index) => {
          const cardElement = card as HTMLElement;

          gsap.fromTo(
            cardElement,
            {
              opacity: 0,
              x: -60,
              y: 30,
              scale: 0.95,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.3 + index * 0.1, // Stagger delay
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "bottom 30%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    const serviceCards =
      containerRef.current?.querySelectorAll(".service-card");
    const cleanupFunctions: (() => void)[] = [];

    serviceCards?.forEach((card) => {
      const cardElement = card as HTMLElement;
      const title = card.querySelector(".service-title") as HTMLElement;
      const description = card.querySelector(
        ".service-description"
      ) as HTMLElement;
      const arrow = card.querySelector(".service-arrow") as HTMLElement;

      // Set initial state
      gsap.set(cardElement, {
        backgroundColor: "transparent",
        borderRadius: "0px",
        scale: 1,
      });

      // Set initial state for content
      gsap.set([title, description, arrow], {
        scale: 1,
      });

      // Set initial position for arrow
      gsap.set(arrow, {
        x: 0,
      });

      // Hover enter animation
      const handleMouseEnter = () => {
        const tl = gsap.timeline();

        tl.to(cardElement, {
          backgroundColor: "#214A9C",
          borderRadius: "8px",
          paddingLeft: "10px",
          paddingRight: "10px",
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        })
          .to(
            [title, description],
            {
              color: "white",
              scale: 1.04,
              duration: 0.25,
              ease: "power2.out",
            },
            "-=0.15"
          )
          .to(
            arrow,
            {
              color: "white",
              scale: 1.04,
              x: 8,
              duration: 0.25,
              ease: "power2.out",
            },
            "-=0.25"
          );
      };

      // Hover leave animation with slower, smoother timing
      const handleMouseLeave = () => {
        const tl = gsap.timeline({ delay: 0.1 });

        // First scale down both content and card together (slower)
        tl.to([title, description], {
          scale: 0.98,
          duration: 0.25,
          ease: "power1.inOut",
        })
          .to(
            arrow,
            {
              scale: 0.98,
              x: -2,
              duration: 0.25,
              ease: "power1.inOut",
            },
            "-=0.25"
          )
          .to(
            cardElement,
            {
              scale: 0.98,
              duration: 0.25,
              ease: "power1.inOut",
            },
            "-=0.25"
          )
          // Then return to normal scale and change colors/background (much slower)
          .to(
            [title, description],
            {
              color: "",
              scale: 1,
              duration: 0.6,
              ease: "power1.out",
            },
            "-=0.1"
          )
          .to(
            arrow,
            {
              color: "",
              scale: 1,
              x: 0,
              duration: 0.6,
              ease: "power1.out",
            },
            "-=0.6"
          )
          .to(
            cardElement,
            {
              backgroundColor: "transparent",
              borderRadius: "0px",
              scale: 1,
              duration: 0.7,
              ease: "power1.out",
            },
            "-=0.6"
          );
      };

      cardElement.addEventListener("mouseenter", handleMouseEnter);
      cardElement.addEventListener("mouseleave", handleMouseLeave);

      // Store cleanup function
      cleanupFunctions.push(() => {
        cardElement.removeEventListener("mouseenter", handleMouseEnter);
        cardElement.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    // Cleanup function
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, [services.length]);

  return (
    <section ref={sectionRef} className="py-6 md:py-12.5">
      <div
        className="container mx-auto px-4 space-y-1.75 md:space-y-8"
        ref={containerRef}
      >
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        >
          <SectionHeader title="Our Services" description="Best Experienced" />
        </div>

        {/* Services List */}
        <div ref={servicesListRef} className="space-y-0">
          {services.map((service, index) => {
            // Generate path from service title if not found in mapping
            const getServicePath = (title: string) => {
              if (servicePaths[title]) {
                return servicePaths[title];
              }
              // Generate path from title: "Web Development" -> "/services/web-development"
              const slug = title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              return `/services/${slug}`;
            };

            return (
              <Link
                key={index}
                href={getServicePath(service.title)}
                className="block"
              >
              <div className="service-card relative overflow-hidden cursor-pointer">
                <div className="service-content flex items-center justify-between py-3 sm:py-6 px-4">
                  {/* Service Title */}
                  <div className="flex-1">
                    <h3
                      className={`service-title text-lg sm:text-[1.375rem] leading-[1.875rem] text-foreground`}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Service Description */}
                  <div className="hidden md:block text-lg leading-[1.875rem]">
                    <p className="service-description text-base text-muted-foreground dark:text-foreground">
                      {service.description}
                    </p>
                  </div>

                  {/* Navigation Arrow */}
                  <div className="flex-shrink-0">
                    <ArrowUpRight className="service-arrow w-5 h-5 text-[#3B82F6]" />
                  </div>
                </div>

                {/* Separator Line */}
                {index < services.length - 1 && (
                  <div className="service-separator border-t mt-0 border-[#12202233] dark:border-[#6B6B6B]"></div>
                )}
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
