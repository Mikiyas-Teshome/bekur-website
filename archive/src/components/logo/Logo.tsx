"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo = ({ width = 431, height = 181, className }: LogoProps) => {
  const { theme, resolvedTheme } = useTheme();

  // Use resolvedTheme to handle system theme preference
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  // Determine which logo to show based on theme
  const logoSrc =
    currentTheme === "dark"
      ? "/assets/logo/logo.svg" // this will be the dark logo
      : "/assets/logo/logo.svg";

  return (
    <Image
      src={logoSrc}
      alt="Bekur Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};

export default Logo;
