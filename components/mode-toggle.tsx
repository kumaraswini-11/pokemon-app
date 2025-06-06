"use client";

import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";

import {Button} from "@/components/ui/button";

export function ModeToggle() {
  const {theme, setTheme} = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="link"
      size="icon"
      onClick={toggleTheme}>
      <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
