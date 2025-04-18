"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {ElementType} from "react";

import {GitBranch, Home, LucideIcon, Users} from "lucide-react";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon | ElementType;
}

export const navItems: NavItem[] = [
  {href: "/", label: "Pokedex", icon: Home},
  {href: "/compare", label: "Compare", icon: Users},
  {href: "/team-builder", label: "Team Builder", icon: GitBranch},
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1 md:space-x-2 lg:space-x-4">
      {navItems.map(item => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={cn(
              "transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-primary"
            )}
            aria-current={isActive ? "page" : undefined}>
            <Link
              href={item.href}
              className="flex items-center gap-2">
              <Icon
                className="h-4 w-4"
                aria-hidden="true"
              />
              <span className="hidden sm:inline-block">{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
