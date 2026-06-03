import type React from "react";
import { memo } from "react";
import Image from "next/image";
import { poppins7 } from "@/app/fonts";

interface ProjectCardProps {
  id: number;
  image: string;
  categories: string[];
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  image,
  title,
  description,
  className = "",
  onClick,
}) => {
  return (
    <div 
      className={`w-full ${className} ${
        onClick
          ? "cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
          : ""
      }`}
      onClick={onClick}
    >
      {/* Project Image */}
      <div className="w-full aspect-610/406 rounded-3xl overflow-hidden mb-3 md:mb-6 relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Title and Description */}
      <div className="">
        <h3 className={`${poppins7.className} text-foreground text-center md:text-left text-lg md:text-[1.375rem] leading-7.5`}>
          {title}
        </h3>
        <div 
          className="text-[#6A7374] text-center md:text-left px-1 sm:p-0 leading-5 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};

export default memo(ProjectCard);
