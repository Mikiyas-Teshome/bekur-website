'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  Settings,
  Users,
  BookOpen,
  Briefcase,
  DollarSign,
  Menu,
  X,
  Phone,
  Building2,
  MessageSquareHeart,
  HandPlatter
} from 'lucide-react';

const navigation = [
  // Main Dashboard
  { name: 'Overview', href: '/admin', icon: Home },

  // Content Management
  // { name: 'Hero Section', href: '/admin/content/hero', icon: Settings },
  { name: 'Features', href: '/admin/content/features', icon: Settings },
  { name: 'Services', href: '/admin/content/services', icon: HandPlatter },
  { name: 'Team', href: '/admin/content/team', icon: Users },
  { name: 'Testimonials', href: '/admin/content/testimonials', icon: Users },
  { name: 'Values', href: '/admin/content/values', icon: MessageSquareHeart },
  { name: 'Companies', href: '/admin/content/companies', icon: Building2 },
  { name: 'Contact Info', href: '/admin/content/contact', icon: Phone },

  // Content Creation
  { name: 'Blogs', href: '/admin/blogs', icon: BookOpen },
  { name: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },

  // Business Management
  { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
];

export function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-60">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-background/50 dark:border-r dark:border-border shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Bekur Admin
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {/* Main Dashboard */}
            <div className="mb-4">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Dashboard
              </div>
              <Link
                href="/admin"
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/admin"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
                Overview
              </Link>
            </div>

            {/* Content Management */}
            <div className="mb-4">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Content Management
              </div>
              {navigation.slice(1, 8).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Content Creation */}
            <div className="mb-4">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Content Creation
              </div>
              {navigation.slice(8, 10).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Business Management */}
            <div className="mb-4">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Business Management
              </div>
              {navigation.slice(10).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

