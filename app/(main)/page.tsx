"use client";

import React, {useMemo, useState} from "react";

import {FilterState, PokemonFilters} from "@/components/pokemon/pokemon-filter";
import {PokemonGrid} from "@/components/pokemon/pokemon-grid";
import {SearchInput} from "@/components/pokemon/pokemon-search-input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ITEMS_PER_PAGE} from "@/constants";

export default function HomePage() {
  const [filterState, setFilterState] = useState<FilterState>({
    search: "",
    types: [],
    abilities: [],
    generation: null,
    stats: [
      {stat: "hp", min: 0, max: 255},
      {stat: "attack", min: 0, max: 255},
      {stat: "defense", min: 0, max: 255},
      {stat: "special-attack", min: 0, max: 255},
      {stat: "special-defense", min: 0, max: 255},
      {stat: "speed", min: 0, max: 255},
    ],
  });

  // Memoize params to avoid unnecessary re-renders - React 19 has in-bult compiler, so we can ignoer. Its just for safe side.
  const params = useMemo(
    () => ({
      search: filterState.search,
      types: filterState.types,
      abilities: filterState.abilities,
      generation: filterState.generation,
      stats: filterState.stats,
      limit: ITEMS_PER_PAGE,
    }),
    [filterState]
  );

  return (
    <div className="flex h-screen w-full flex-col gap-2 overflow-hidden px-2 py-1">
      {/* Top search bar with mobile filter button - fixed */}
      <div className="flex items-center gap-2">
        <SearchInput
          value={filterState.search}
          onChange={value => setFilterState({...filterState, search: value})}
          className="flex-1"
        />
        {/* Mobile filter button - only visible on small screens */}
        {/* <MobileViewFilters /> */}
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Desktop filters - hidden on mobile - fixed */}
        <ScrollArea className="hidden w-auto md:block">
          <PokemonFilters
            filterState={filterState}
            setFilterState={setFilterState}
          />
        </ScrollArea>

        {/* Pokemon grid - scrollable */}
        <ScrollArea className="w-full">
          <PokemonGrid params={params} />
        </ScrollArea>
      </div>
    </div>
  );
}

// export const MobileViewFilters = () => {
//   const [isSheetOpen, setIsSheetOpen] = useState(false);

//   return (
//     <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
//       <SheetTrigger asChild>
//         <Button variant="outline" size="icon" className="md:hidden">
//           <FilterIcon className="size-4" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-[24rem] p-0 sm:w-[350px]">
//         <SheetHeader className="px-4 pt-4">
//           <SheetTitle>Pokemon Filters</SheetTitle>
//           <SheetDescription>Fine-tune your Pokemon search</SheetDescription>
//         </SheetHeader>
//       </SheetContent>
//     </Sheet>
//   );
// };
