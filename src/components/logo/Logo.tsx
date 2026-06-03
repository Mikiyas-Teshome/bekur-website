"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 431, height = 181, className }: LogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const logoSrc =
    currentTheme === "dark"
      ? "/assets/logo/logo-dark.svg"
      : "/assets/logo/logo-light.svg";

  if (!mounted) {
    return <div className={className} style={{ width, height }} aria-hidden="true" />;
  }

  return (
    <Image
      src={logoSrc}
      alt="Bekur Technologies"
      width={width}
      height={height}
      className={className}
      style={className ? { width: "auto", height: "auto" } : undefined}
      priority
    />
  );
}
