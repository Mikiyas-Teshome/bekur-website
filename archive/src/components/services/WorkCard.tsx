import React, { memo } from "react";
import Image from "next/image";
import { dmSans4, dmSans6 } from "@/app/fonts";

interface WorkCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  category: string;
  className?: string;
  onClick?: () => void;
}

const WorkCard: React.FC<WorkCardProps> = ({
  image,
  title,
  description,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`w-full max-w-[503px] [759px] rounded-[1.375rem] space-y-3 md:space-y-5.25 ${
        onClick
          ? "cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-[28px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="space-y-2 ">
        <div className="space-y-3 md:space-y-5.5">
          <h3
            className={`${dmSans6.className} text-lg sm:text-xl md:text-[1.375rem] leading-[136%] text-foreground`}
          >
            {title}
          </h3>
          <div
            className={`${dmSans4.className} text-muted-foreground dark:text-foreground/80 text-base sm:text-lg md:text-xl leading-6 md:leading-8 line-clamp-2`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Action Button */}
        {/* <Button className="w-full sm:w-auto px-4 sm:px-7 h-10 sm:h-13 items-center text-secondary hover:text-secondary/80 transition-colors duration-200 font-medium text-sm">
          See More
        </Button> */}
      </div>
    </div>
  );
};

export default memo(WorkCard);
