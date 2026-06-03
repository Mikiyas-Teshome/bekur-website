import "reflect-metadata";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../provider/theme-provider";
import { inter } from "./fonts";
import { ReactQueryProvider } from "@/provider/ReactQueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Favicon from "@/components/Favicon";
import { Toaster } from "@/components/ui/sonner";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bekurtechnologies.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bekur Technologies — Custom Automation for Professional Service Firms",
    template: "%s | Bekur Technologies",
  },
  description:
    "We help small professional service firms reclaim partner hours in 3–6 weeks — without rigid SaaS templates, surprise AI bills, or scope creep. The Automation Sprint: one workflow, fixed scope, fixed price.",
  icons: {
    icon: [
      {
        url: "/assets/logo/logo-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/assets/logo/logo-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    shortcut: [{ url: "/assets/logo/logo-light.svg", type: "image/svg+xml" }],
    apple: [
      {
        url: "/assets/logo/logo-light.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Bekur Technologies",
    title: "Bekur Technologies — Custom Automation for Professional Service Firms",
    description:
      "We help small professional service firms reclaim partner hours in 3–6 weeks — without rigid SaaS, surprise AI bills, or scope creep.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1280,
        height: 672,
        type: "image/jpeg",
        alt: "Bekur Technologies",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased w-full max-w-screen-7xl overflow-x-hidden mx-auto min-h-screen bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Favicon />
            <Toaster />
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
