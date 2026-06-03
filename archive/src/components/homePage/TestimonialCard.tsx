import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

interface TestimonialCardProps {
  profileImage: string;
  username: string;
  description: string;
  joinedDate: string;
  className?: string;
  isHovered?: boolean;
  isAdjacent?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  profileImage,
  username,
  description,
  joinedDate,
  className = "",
  isHovered = false,
  isAdjacent = false,
}) => {
  // Dynamic styling based on hover state
  const getCardClasses = () => {
    const baseClasses = "flex flex-col bg-background space-y-1 transition-all duration-300";

    if (isHovered) {
      return `${baseClasses} transform`;
    } else if (isAdjacent) {
      return `${baseClasses}`;
    } else {
      return baseClasses;
    }
  };

  const getBorderClasses = () => {
    return "text-[#14141426] dark:text-[#D3D3D3]"; // Keep consistent border color
  };

  const getContentClasses = () => {
    const baseClasses =
      "bg-[#FFFFFF] rounded-xl p-6 space-y-[6.3125rem] transition-all duration-300";

    if (isHovered) {
      return `${baseClasses} shadow-lg border-2 border-primary/20`;
    } else {
      return baseClasses;
    }
  };
  return (
    <div className={`${getCardClasses()} h-[450px]`}>
      <div className="flex items-center space-x-0.5">
        <span className={getBorderClasses()}>
          <Plus />
        </span>
        <div className="h-px w-full bg-[#14141426] dark:bg-[#D3D3D3] rounded-full"></div>
        <span className={getBorderClasses()}>
          <Plus />
        </span>
      </div>
      <div className="flex space-x-3 h-full">
        <div className="w-px bg-[#14141426] dark:bg-[#D3D3D3]  rounded-full"></div>
        <div className={`${getContentClasses()} ${className} h-full flex flex-col justify-between`}>
          <p
            className={`transition-all duration-300 ${
              isHovered ? "text-[#242424] font-medium" : "text-[#242424]"
            }`}
          >
            {description}
          </p>
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="shrink-0 flex space-x-4">
              <div
                className={`w-10 h-10 rounded-[0.5rem] overflow-hidden transition-all duration-300 relative ${
                  isHovered ? "ring-2 ring-primary/30" : ""
                }`}
              >
                <Image
                  src={profileImage}
                  alt={`${username} profile`}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Username */}
              <div className="flex flex-col space-y-1">
                <h3
                  className={`text-base font-normal leading-[100%] transition-all duration-300 ${
                    isHovered ? "text-primary" : "text-[#898989]"
                  }`}
                >
                  {username}
                </h3>
                <h4
                  className={`text-base font-extraLight leading-[100%] transition-all duration-300 ${
                    isHovered ? "text-[#666]" : "text-[#898989]"
                  }`}
                >
                  Joined {joinedDate}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="w-px bg-[#14141426] dark:bg-[#D3D3D3]  rounded-full"></div>
      </div>
      <div className="flex items-center space-x-0.5">
        <span className={getBorderClasses()}>
          <Plus />
        </span>
        <div className="h-px w-full bg-[#14141426] dark:bg-[#D3D3D3]  rounded-full"></div>
        <span className={getBorderClasses()}>
          <Plus />
        </span>
      </div>
    </div>
  );
};

export default TestimonialCard;
