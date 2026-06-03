"use client";
import { useRef, useEffect } from "react";
import TeamCard from "./TeamCard";
import SectionHeader from "./SectionHeader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getTeamMembers } from "@/data/static-content";

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const teamMembers = getTeamMembers();

  useEffect(() => {
    if (teamMembers.length === 0) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
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
            toggleActions: "play none none reverse"
          }
        }
      );

      // Sequential team card animations
      const teamCards = gridRef.current?.children;
      if (teamCards) {
        Array.from(teamCards).forEach((card, index) => {
          const cardElement = card as HTMLElement;

          gsap.fromTo(cardElement,
            {
              opacity: 0,
              y: 60,
              scale: 0.8,
              rotation: 5
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: "back.out(1.7)",
              delay: 0.3 + (index * 0.1), // Sequential delay - each card 0.1s after previous
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "bottom 30%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // Add hover animation to each card
          cardElement.addEventListener('mouseenter', () => {
            gsap.to(cardElement, {
              scale: 1.08,
              y: -8,
              rotation: Math.random() > 0.5 ? 3 : -3, // Random slight rotation
              duration: 0.3,
              ease: "power2.out"
            });
          });

          cardElement.addEventListener('mouseleave', () => {
            gsap.to(cardElement, {
              scale: 1,
              y: 0,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [teamMembers.length]);

  return (
    <section ref={sectionRef} className="pb-4 md:pb-12.5">
      <div className="container mx-auto px-4 space-y-8">
        {/* Section Header */}
        <div ref={headerRef}>
          <SectionHeader title="Our Team" description="Experts" />
        </div>

        {/* Team Members Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-6 lg:gap-10 xl:gap-12.5">
          {teamMembers.map((member) => (
            <div key={member.id} className="w-full team-card">
              <TeamCard
                profileImage={member.profileImage}
                name={member.name}
                title={member.title}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
