"use client";

import React, {useEffect, useState} from "react";

import {Search, X} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import {usePokemonFilterStore} from "@/store/filters";

export const SearchInput: React.FC = () => {
  const {filters, setFilters} = usePokemonFilterStore();
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({search: debouncedSearch.trim()});

      // if (debouncedSearch.trim()) {
      //   toast.info("Search Applied", {
      //     description: `Filtering Pokemon by "${debouncedSearch.trim()}"`,
      //   });
      // }
    }
  }, [debouncedSearch, filters.search, setFilters]);

  const handleClear = () => {
    setSearchValue("");
    if (filters.search) {
      setFilters({search: ""});
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search Pokemon by name..."
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        className="pl-10 pr-10"
        aria-label="Search Pokemon by name"
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={handleClear}
          aria-label="Clear search">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
