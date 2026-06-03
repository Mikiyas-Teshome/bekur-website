import React from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = "" }) => {
  return (
    <div
      className={`w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin ${className}`}
    />
  );
};

export default Spinner;
