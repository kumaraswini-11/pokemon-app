"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GitBranch, LucideIcon, Users } from "lucide-react";
import { ElementType } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SiteBranding } from "./site-branding";
import { ThemeSwitcher } from "./theme-switcher";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon | ElementType;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Pokedex", icon: Home },
  { href: "/compare", label: "Compare", icon: Users },
  { href: "/team-builder", label: "Team Builder", icon: GitBranch },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container ml-2 flex h-14 items-center justify-between">
        <SiteBranding />

        <nav className="flex items-center space-x-1 md:space-x-2 lg:space-x-4">
          <ThemeSwitcher />

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-primary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline-block">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
