import React from "react";
import { Lightbulb } from "lucide-react";
import { dmSans4, dmSans5, dmSans7 } from "@/app/fonts";

interface FeatureCardProps {
  description: string;
  className?: string;
  title: string;
  icon?: React.ReactNode | string;
}

const FeatureCard = ({
  description,
  className = "",
  title,
  icon = <Lightbulb className="w-4.5 md:w-8.5 h-4.5 md:h-8.5 text-secondary" />,
}: FeatureCardProps) => {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {/* Icon */}
      <div className="w-8 md:w-16 h-8 md:h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
        {typeof icon === "string" ? (
          <span
            className={`${dmSans7.className} text-secondary font-bold text-base md:text-xl leading-[120%]`}
          >
            {icon}
          </span>
        ) : (
          icon
        )}
      </div>
      <div className="space-y-1.25">
        <h3
          className={`${dmSans5.className} text-foreground text-xl md:text-[1.75rem] leading-[1.625rem] md:leading-[3.125rem]`}
        >
          {title}
        </h3>
        {/* Description */}
        <p
          className={`${dmSans4.className} text-muted-foreground text-base md:text-2xl leading-[1.125rem] md:leading-9 text-justify`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
