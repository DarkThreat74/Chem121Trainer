"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, BookOpen, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/review", label: "Review", icon: Sparkles },
  { href: "/learn", label: "Learn", icon: BookOpen },
];

export default function NavBar() {
  const pathname = usePathname();

  // Don't show nav on landing page or during active review/practice sessions
  if (pathname === "/" || pathname.startsWith("/review") || pathname.startsWith("/practice/")) {
    return null;
  }

  return (
    <>
      {/* Desktop top nav */}
      <nav className="fixed left-0 right-0 top-0 z-50 hidden border-b border-border-subtle bg-bg/80 backdrop-blur-xl md:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-purple-500">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              <span className="gradient-text">Chem 121</span> Trainer
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-text"
                      : "text-text-tertiary hover:text-text-secondary"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-desktop"
                      className="absolute inset-0 rounded-lg bg-accent/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-bg/90 backdrop-blur-xl md:hidden safe-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${
                  isActive ? "text-accent" : "text-text-tertiary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-mobile"
                    className="absolute inset-0 rounded-xl bg-accent/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative h-5 w-5" />
                <span className="relative text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
