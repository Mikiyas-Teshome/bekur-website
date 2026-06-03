import React from "react";
import Image from "next/image";
import { dmSans3, dmSans5 } from "@/app/fonts";

interface TeamCardProps {
  profileImage: string;
  name: string;
  title: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  className?: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  profileImage,
  name,
  title,
  className = "",
}) => {
  return (
    <div className={`text-center ${className} space-y-8`}>
      {/* Profile Picture */}
      <div>
        <div className="w-42.75 h-h-42.75 md:w-55.5 md:h-72.75 mx-auto rounded-[0.625rem] overflow-hidden relative">
          <Image
            src={profileImage}
            alt={`${name} profile`}
            fill
            className="object-cover"
          />
          <div
            className="absolute bottom-1.75 left-2 right-2 px-2.75 flex flex-col backdrop-blur-[10px] rounded-[0.3125rem]"
            style={{
              background:
                "linear-gradient(99.93deg, rgba(0, 0, 0, 0.48) 6.39%, rgba(0, 0, 0, 0.48) 91.48%)",
            }}
          >
            {/* Name */}
            <h3
              className={`${dmSans5.className} text-xs md:text-base  text-[#EFEFEF]  md:leading-7 text-left`}
            >
              {name}
            </h3>
            {/* Title */}
            <p
              className={`${dmSans3.className} text-[#EFEFEF] text-xs sm:text-sm  leading-7 text-left`}
            >
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
