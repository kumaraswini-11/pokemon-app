"use client";

import React, { useState, useMemo } from "react";

import {
  FilterState,
  PokemonFilters,
} from "@/components/pokemon/pokemon-filter";
import { PokemonGrid } from "@/components/pokemon/pokemon-grid";
import { SearchInput } from "@/components/pokemon/pokemon-search-input";
import { ITEMS_PER_PAGE } from "@/constants";

export default function HomePage() {
  const [filterState, setFilterState] = useState<FilterState>({
    search: "",
    types: [],
    abilities: [],
    generation: null,
    stats: [
      { stat: "hp", min: 0, max: 255 },
      { stat: "attack", min: 0, max: 255 },
      { stat: "defense", min: 0, max: 255 },
      { stat: "special-attack", min: 0, max: 255 },
      { stat: "special-defense", min: 0, max: 255 },
      { stat: "speed", min: 0, max: 255 },
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
    <>
      {/* Filters Sidebar */}
      <aside className="w-1/4 min-w-[300px]">
        <PokemonFilters
          filterState={filterState}
          setFilterState={setFilterState}
        />
      </aside>

      {/* Main Section with Fixed Search and Scrollable Grid */}
      <main className="flex w-3/4 flex-col">
        <div className="mb-4">
          <SearchInput
            value={filterState.search}
            onChange={(value) =>
              setFilterState({ ...filterState, search: value })
            }
          />
        </div>

        {/* Scrollable Grid */}
        <section className="h-[calc(100vh-9rem)] overflow-y-auto">
          <PokemonGrid params={params} />
        </section>
      </main>
    </>
  );
}
