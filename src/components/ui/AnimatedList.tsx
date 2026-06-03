import React from "react";
import { dmSans4, dmSans5 } from "@/app/fonts";

interface AnimatedListItem {
  id: string | number;
  icon?: string | React.ReactNode;
  title: string;
  description: string;
}

interface AnimatedListProps {
  items: AnimatedListItem[];
  showBorders?: boolean;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  showBorders = true,
  className = "space-y-4",
  itemClassName = "",
  iconClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}) => {
  return (
    <div
      className={`${
        showBorders
          ? "border-l border-r border-footer-border rounded-lg overflow-hidden"
          : ""
      } ${className}`}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`relative group overflow-hidden  ${itemClassName}`}
        >
          <div className="flex justify-between items-center gap-6 px-6 py-2">
            {/* Icon */}
            <div className="md:flex-1 min-w-0">
              <div
                className={`w-12 md:w-16 h-12 md:h-16 bg-background border border-primary rounded-full flex items-center justify-center flex-shrink-0 ${iconClassName}`}
              >
                {typeof item.icon === "string" ? (
                  <span
                    className={`${dmSans5.className} text-primary font-bold text-lg`}
                  >
                    {item.icon}
                  </span>
                ) : (
                  item.icon
                )}
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3
                className={`${dmSans4.className} text-[#6A7374] dark:text-foreground text-lg md:text-[1.375rem] leading-[1.875rem] ${titleClassName}`}
              >
                {item.title}
              </h3>
            </div>

            {/* Description */}
            <div className="hidden sm:block flex-1 min-w-0">
              <p className={`text-base text-[#71717A]${descriptionClassName}`}>
                {item.description}
              </p>
            </div>
          </div>

          {/* Separator Line */}
          {index < items.length && (
            <div className="border-t mt-0 border-[#bcbcbc]"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnimatedList;
