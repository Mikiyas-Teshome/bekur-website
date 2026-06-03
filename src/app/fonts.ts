import { Inter, Poppins, DM_Sans } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const poppins7 = Poppins({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const poppins4 = Poppins({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
export const poppins5 = Poppins({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const dmSans3 = DM_Sans({
  weight: "300",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const dmSans4 = DM_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const dmSans5 = DM_Sans({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const dmSans6 = DM_Sans({
  weight: "600",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const dmSans7 = DM_Sans({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const grotesk = localFont({
  src: [
    {
      path: "../../public/fonts/OverusedGrotesk-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-overused-grotesk",
  display: "swap",
  preload: false,
  fallback: ["Space Grotesk", "system-ui", "sans-serif"],
});
