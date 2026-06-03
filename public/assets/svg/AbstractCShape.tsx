import React from "react";

const AbstractCShape = ({
  width = 400,
  height = 400,
  color = "#2176FF",
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Large C Shape - incomplete circle opening on the left */}
      <path
        d="M200 50C120 50 50 100 50 200C50 300 120 350 200 350"
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Interconnected circles cluster on the left - molecular/network structure */}
      {/* Core circles - varying sizes */}
      <circle cx="55" cy="120" r="14" fill={color} />
      <circle cx="40" cy="140" r="11" fill={color} />
      <circle cx="70" cy="145" r="9" fill={color} />
      <circle cx="50" cy="160" r="10" fill={color} />
      <circle cx="75" cy="165" r="8" fill={color} />
      <circle cx="35" cy="180" r="12" fill={color} />
      <circle cx="65" cy="185" r="7" fill={color} />
      <circle cx="60" cy="200" r="9" fill={color} />
      <circle cx="45" cy="205" r="6" fill={color} />
      
      {/* Secondary circles */}
      <circle cx="25" cy="130" r="6" fill={color} />
      <circle cx="85" cy="135" r="7" fill={color} />
      <circle cx="20" cy="150" r="5" fill={color} />
      <circle cx="90" cy="155" r="6" fill={color} />
      <circle cx="55" cy="175" r="5" fill={color} />
      <circle cx="95" cy="175" r="6" fill={color} />
      <circle cx="30" cy="195" r="5" fill={color} />
      <circle cx="80" cy="200" r="6" fill={color} />
      
      {/* Tertiary smaller circles */}
      <circle cx="15" cy="125" r="4" fill={color} />
      <circle cx="100" cy="130" r="4" fill={color} />
      <circle cx="10" cy="145" r="3" fill={color} />
      <circle cx="105" cy="150" r="4" fill={color} />
      <circle cx="20" cy="170" r="4" fill={color} />
      <circle cx="100" cy="170" r="4" fill={color} />
      
      {/* Connecting lines - creating network/molecular structure */}
      {/* Main connections */}
      <line x1="55" y1="120" x2="40" y2="140" stroke={color} strokeWidth="2.5" />
      <line x1="55" y1="120" x2="70" y2="145" stroke={color} strokeWidth="2.5" />
      <line x1="55" y1="120" x2="25" y2="130" stroke={color} strokeWidth="2" />
      <line x1="40" y1="140" x2="50" y2="160" stroke={color} strokeWidth="2.5" />
      <line x1="40" y1="140" x2="20" y2="150" stroke={color} strokeWidth="2" />
      <line x1="70" y1="145" x2="75" y2="165" stroke={color} strokeWidth="2.5" />
      <line x1="70" y1="145" x2="85" y2="135" stroke={color} strokeWidth="2" />
      <line x1="50" y1="160" x2="35" y2="180" stroke={color} strokeWidth="2.5" />
      <line x1="50" y1="160" x2="65" y2="185" stroke={color} strokeWidth="2.5" />
      <line x1="50" y1="160" x2="55" y2="175" stroke={color} strokeWidth="2" />
      <line x1="75" y1="165" x2="65" y2="185" stroke={color} strokeWidth="2.5" />
      <line x1="75" y1="165" x2="95" y2="175" stroke={color} strokeWidth="2" />
      <line x1="35" y1="180" x2="65" y2="185" stroke={color} strokeWidth="2.5" />
      <line x1="35" y1="180" x2="30" y2="195" stroke={color} strokeWidth="2" />
      <line x1="65" y1="185" x2="60" y2="200" stroke={color} strokeWidth="2.5" />
      <line x1="60" y1="200" x2="45" y2="205" stroke={color} strokeWidth="2.5" />
      <line x1="60" y1="200" x2="80" y2="200" stroke={color} strokeWidth="2" />
      
      {/* Secondary connections */}
      <line x1="25" y1="130" x2="20" y2="150" stroke={color} strokeWidth="1.5" />
      <line x1="25" y1="130" x2="15" y2="125" stroke={color} strokeWidth="1.5" />
      <line x1="85" y1="135" x2="90" y2="155" stroke={color} strokeWidth="1.5" />
      <line x1="85" y1="135" x2="100" y2="130" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="150" x2="10" y2="145" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="150" x2="20" y2="170" stroke={color} strokeWidth="1.5" />
      <line x1="90" y1="155" x2="105" y2="150" stroke={color} strokeWidth="1.5" />
      <line x1="90" y1="155" x2="100" y2="170" stroke={color} strokeWidth="1.5" />
      <line x1="55" y1="175" x2="50" y2="160" stroke={color} strokeWidth="1.5" />
      <line x1="95" y1="175" x2="75" y2="165" stroke={color} strokeWidth="1.5" />
      <line x1="30" y1="195" x2="35" y2="180" stroke={color} strokeWidth="1.5" />
      <line x1="80" y1="200" x2="60" y2="200" stroke={color} strokeWidth="1.5" />
      
      {/* Tertiary connections */}
      <line x1="15" y1="125" x2="25" y2="130" stroke={color} strokeWidth="1" />
      <line x1="100" y1="130" x2="85" y2="135" stroke={color} strokeWidth="1" />
      <line x1="10" y1="145" x2="20" y2="150" stroke={color} strokeWidth="1" />
      <line x1="105" y1="150" x2="90" y2="155" stroke={color} strokeWidth="1" />
      <line x1="20" y1="170" x2="20" y2="150" stroke={color} strokeWidth="1" />
      <line x1="100" y1="170" x2="90" y2="155" stroke={color} strokeWidth="1" />
    </svg>
  );
};

export default AbstractCShape;

