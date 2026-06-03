"use client";
import { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import SectionHeader from "./SectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getTestimonials } from "@/data/static-content";

const TestimonialsSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const testimonials = getTestimonials();

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      // Only auto-scroll if no card is being hovered
      if (hoveredIndex === null) {
        api.scrollNext();
      }
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [api, hoveredIndex]);

  // Helper function to determine card opacity
  const getCardStyle = (index: number) => {
    // If hovering, make hovered card and adjacent cards visible
    if (hoveredIndex !== null) {
      const isHovered = index === hoveredIndex;
      const isAdjacent = Math.abs(index - hoveredIndex) === 1;

      if (isHovered) {
        return "opacity-100 transform transition-all duration-300";
      } else if (isAdjacent) {
        return "opacity-70 transform transition-all duration-300";
      } else {
        return "opacity-30 transform transition-all duration-300";
      }
    }

    // Default carousel behavior when not hovering
    return current === index
      ? "opacity-100 transform transition-all duration-500"
      : "opacity-50 transform transition-all duration-500";
  };

  // Handle mouse enter
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section className="py-4 md:py-12.5 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8 space-y-8">
        {/* Section Header */}
        <div className="">
          <SectionHeader title="Our Testimonials" description="Testimonials" />
        </div>

        {/* Testimonials Carousel */}
        <div className="px-4">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={testimonial.id || index}
                  className="pl-2 md:pl-4 basis-full md:basis-1/3"
                >
                  <div
                    className={`ease-in-out cursor-pointer ${getCardStyle(
                      index
                    )}`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <TestimonialCard
                      profileImage={testimonial.profileImage}
                      username={testimonial.username}
                      description={testimonial.description}
                      joinedDate={testimonial.joinedDate}
                      isHovered={hoveredIndex === index}
                      isAdjacent={
                        hoveredIndex !== null &&
                        Math.abs(index - hoveredIndex) === 1
                      }
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
