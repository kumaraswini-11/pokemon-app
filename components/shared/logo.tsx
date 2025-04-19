"use client";

import Link from "next/link";

import {MdOutlineCatchingPokemon} from "react-icons/md";

import {cn} from "@/lib/utils";

export interface AppLogoProps {
  href?: string;
  label?: string;
  isMobile?: boolean;
  className?: string;
}

export const Logo: React.FC<AppLogoProps> = ({
  href = "/",
  label = "App Name",
  isMobile = false,
  className,
}) => {
  return (
    <Link
      href={href}
      className={cn("flex items-center justify-start gap-2", className)}
      aria-label={`${label} Home`}>
      <MdOutlineCatchingPokemon
        size={isMobile ? 32 : 36}
        aria-hidden="true"
        className="text-primary bg-primary-foreground rounded-full"
      />
      <span className="text-xl font-bold hidden md:block whitespace-nowrap">{label}</span>
    </Link>
  );
};
