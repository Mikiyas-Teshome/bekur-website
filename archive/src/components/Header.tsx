"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import LogoSvg from "../../public/assets/logo/Logo";
import { ThemeToggle } from "./theme-toggle";
import { dmSans5 } from "@/app/fonts";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { getServices } from "@/data/static-content";
import BookCallButton from "./BookCallButton";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const services = getServices();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems = [
    { name: "Home", hasDropdown: false, href: "/" },
    { name: "Mvp", hasDropdown: false, href: "/mvp" },
    { name: "Service", hasDropdown: true, href: "/services" },
    { name: "Portfolio", hasDropdown: false, href: "/portfolio" },
    { name: "About", hasDropdown: false, href: "/about" },
    { name: "Blog", hasDropdown: false, href: "/blog" },
    { name: "Contact", hasDropdown: false, href: "/contact" },
  ];

  // Transform services for dropdown display
  const serviceDropdownItems = services.map((service) => ({
    name: service.title,
    href: `/${service.slug}`,
    description: service.description,
  }));

  const handleDropdownOpenChange = (itemName: string, isOpen: boolean) => {
    setDropdownStates((prev) => ({
      ...prev,
      [itemName]: isOpen,
    }));
  };

  const isActive = (href: string) => {
    return (
      pathname === href ||
      (href === "/services" &&
        serviceDropdownItems.some((item) => pathname === item.href))
    );
  };

  const getLogoColors = () => {
    if (!mounted) {
      // Return default light theme colors during SSR/initial render
      return {
        color1: "#214A9C",
        color2: "black",
      };
    }

    return {
      color1: resolvedTheme === "dark" ? "#F4F4F4" : "#214A9C",
      color2: resolvedTheme === "dark" ? "#F4F4F4" : "black",
    };
  };

  const logoColors = getLogoColors();

  return (
    <header className="sticky top-0 z-50 bg-header-background backdrop-blur-[70px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <LogoSvg color1={logoColors.color1} color2={logoColors.color2} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div
                    className="group relative"
                    onMouseEnter={() =>
                      handleDropdownOpenChange(item.name, true)
                    }
                    onMouseLeave={() =>
                      handleDropdownOpenChange(item.name, false)
                    }
                  >
                    <DropdownMenu
                      open={dropdownStates[item.name] || false}
                      onOpenChange={(isOpen) =>
                        handleDropdownOpenChange(item.name, isOpen)
                      }
                    >
                      <DropdownMenuTrigger
                        asChild
                        className="border-none hover:border-none focus:outline-none focus-visible:outline-none"
                      >
                        <button
                          className={`flex items-center border-none hover:border-none focus:outline-none focus-visible:outline-none space-x-1 transition-colors p-0 h-auto font-normal relative ${
                            isActive(item.href)
                              ? "text-primary"
                              : "text-foreground hover:text-primary"
                          } group`}
                        >
                          <span
                            className={`${dmSans5.className} text-lg xl:text-xl leading-5`}
                          >
                            {item.name}
                          </span>
                          <ChevronDown
                            className={`w-3 h-3 transition-transform duration-200 ${
                              dropdownStates[item.name]
                                ? "rotate-180"
                                : "rotate-0"
                            }`}
                          />
                          <span className="absolute bottom-[-4px] left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[480px] max-w-xl p-2 mt-1 bg-secondary"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
                          {serviceDropdownItems.map((dropdownItem) => (
                            <div
                              key={dropdownItem.name}
                              className="space-y-1 p-0.5 relative group"
                            >
                              <Link
                                href={`/services${dropdownItem.href}`}
                                className={`block text-sm font-semibold relative w-fit ${
                                  isActive(`/services${dropdownItem.href}`)
                                    ? "text-primary"
                                    : "text-foreground"
                                } group-hover:text-primary`}
                                onClick={() =>
                                  handleDropdownOpenChange("Service", false)
                                }
                              >
                                {dropdownItem.name}
                                <span className="absolute bottom-[-4px] left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                              </Link>
                              <p className="text-sm font-normal leading-[138%] text-muted-foreground">
                                {dropdownItem.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`relative group ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    } transition-colors`}
                  >
                    <span
                      className={`${dmSans5.className} text-lg xl:text-xl leading-5`}
                    >
                      {item.name}
                    </span>
                    <span className="absolute bottom-[-4px] left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button and Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <BookCallButton
              className="px-12.5 h-12.25 text-base"
              text="Book Call"
            />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeToggle />
            <button
              className="p-2 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-primary dark:text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-primary dark:text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-1 md:space-y-2 lg:space-y-6">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.name === "Service" ? (
                    <div>
                      <button
                        onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                        className={`flex items-center justify-between w-full transition-colors py-2 px-2 relative group ${
                          isActive(item.href)
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        <span
                          className={`${dmSans5.className} text-lg leading-5`}
                        >
                          {item.name}
                        </span>
                        <span className="text-foreground text-xl">
                          {mobileServiceOpen ? "-" : "+"}
                        </span>
                        <span className="absolute bottom-[-4px] left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                      </button>
                      {mobileServiceOpen && (
                        <div className="ml-4 space-y-2 border-l border-gray-300 pl-4 mt-2">
                          {serviceDropdownItems.map((serviceItem) => (
                            <Link
                              key={serviceItem.name}
                              href={`/services${serviceItem.href}`}
                              className={`block transition-colors py-2 text-sm relative group w-fit ${
                                isActive(serviceItem.href)
                                  ? "text-primary"
                                  : "text-foreground hover:text-primary"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {serviceItem.name}
                              <span className="absolute bottom-[-4px] left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block transition-colors py-2 px-2 relative group ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span
                        className={`${dmSans5.className} text-lg leading-5`}
                      >
                        {item.name}
                      </span>
                      <span className="absolute bottom-[-4px] left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 px-2">
                <BookCallButton
                  className="px-3 sm:px-6 lg:px-12.5 h-10 lg:h-12.25 text-base font-normal"
                  text="Book Call"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
