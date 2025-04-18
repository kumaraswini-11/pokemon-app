"use client";

import React, {ChangeEvent} from "react";

import {Search} from "lucide-react";

import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search Pokemon by name...",
  className = "",
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="h-11 w-full pl-11"
        type="search"
      />
    </div>
  );
};
