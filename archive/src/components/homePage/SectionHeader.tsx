import type React from "react";
import { poppins4, poppins5 } from "@/app/fonts";

interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  className = "",
  titleClassName = "",
}) => {
  return (
    <div
      className={`flex flex-col space-y-3 md:space-y-6.5 w-full container mx-auto ${className}`}
    >
      <div className="">
        <span
          className={`${poppins4.className
            } text-sm text-[#6A7374] dark:text-foreground border border-[#6A7374] leading-3.5 rounded-full  pr-11.5 py-1.25 pl-2.25 uppercase ${titleClassName || ""
            }`}
        >
          {title}
        </span>
      </div>
      <p
        className={`${poppins5.className} text-foreground text-[1.5rem] md:text-[3rem] uppercase`}
      >
        {description}
      </p>
    </div>
  );
};

export default SectionHeader;
