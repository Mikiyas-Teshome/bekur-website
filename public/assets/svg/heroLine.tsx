import React from "react";

interface HeroLineProps {
  width?: number | string;
  height?: number | string;
}

const HeroLine = ({ width = 324, height = 16 }: HeroLineProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 324 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M153.578 4.09209C97.6721 -2.73358 27.8986 3.14408 0 6.93612V11.8117C25.4608 8.27543 94.5843 3.3247 167.392 11.8117C240.199 20.2986 301.738 13.7227 323.407 9.37392C295.373 14.6558 223.46 12.6242 153.578 4.09209Z"
        fill="#214A9C"
      />
    </svg>
  );
};

export default HeroLine;
