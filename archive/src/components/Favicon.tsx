"use client";

import { useEffect, useState } from "react";

export default function Favicon() {
  const [mounted, setMounted] = useState(false);
  const [systemTheme, setSystemTheme] = useState<string>("light");

  useEffect(() => {
    setMounted(true);
    
    // Check initial system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const faviconPath = systemTheme === "dark"
      ? "/assets/logo/logo-dark.svg"
      : "/assets/logo/logo-light.svg";
    
    // Find or create the favicon link element
    let faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    
    if (!faviconLink) {
      // Create the favicon link if it doesn't exist
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    
    // Update the href
    faviconLink.href = faviconPath;
  }, [systemTheme, mounted]);

  return null;
}

