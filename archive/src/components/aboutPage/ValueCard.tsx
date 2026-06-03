import React from "react";

interface ValueCardProps {
  title: string;
  description: string;
  step: string;
  icon: React.ReactNode;
}

const ValueCard = ({ title, description, icon }: ValueCardProps) => {
  return (
    <div className="flex flex-col items-center space-y-1.5 w-full max-w-[24.375rem]">
      <div className="w-12.5 h-12.5 text-primary">{icon}</div>
      <div className="flex flex-col items-center">
        <h3
          className="text-[1.375rem] text-foreground leading-[1.875rem] text-center font-normal"
        >
          {title}
        </h3>
        <p
          className="text-lg text-muted-foreground leading-[1.875rem] text-center font-normal"
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default ValueCard;
