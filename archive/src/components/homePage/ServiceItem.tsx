"use client";
import { ArrowRight } from "lucide-react";
import React from "react";

interface ServiceItemProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  number,
  title,
  description,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`bg-background rounded-[0.625rem] pt-20 pb-13.5 pl-5 pr-7.5 space-y-2.5 relative ${className}`}
    >
      <div>
        <div className="between mb-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground text-center">
            {title}
          </h3>
          <span className="leading-8 text-2xl font-bold text-primary">
            {number}
          </span>
        </div>
        {/* Icon */}
        {icon}
        {/* Description */}
        <p className="text-muted-foreground text-base leading-relaxed text-left mt-8">
          {description}
        </p>
      </div>

      {/* Navigation Arrow */}
      <div className="flex justify-end">
        <a
          href={`/services${
            title === "UI/UX Design"
              ? "/ui-ux"
              : title === "Graphics Design"
              ? "/graphics-design"
              : title === "Digital Marketing"
              ? "/digital-marketing"
              : title === "Social Media Management"
              ? "/social-media-management"
              : title === "Web Development"
              ? "/website-development"
              : title === "App Development"
              ? "/app-development"
              : "#"
          }`}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-secondary" />
        </a>
      </div>
    </div>
  );
};

export default ServiceItem;
