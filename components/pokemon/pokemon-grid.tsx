"use client";

import React, {useEffect, useMemo, useState} from "react";

import Fuse from "fuse.js";
import {useInView} from "react-intersection-observer";

import {Badge} from "@/components/ui/badge";
import useDebounce from "@/hooks/use-debounce";
import {usePokemonFilterStore} from "@/store/filters";
import {PokemonListItem} from "@/types/pokemon";

import {Loader} from "../shared/loader";
import {PokemonCard} from "./pokemon-card";
import {PokemonCardSkeleton} from "./pokemon-card-skeleton";

interface PokemonGridProps {
  pokemon: PokemonListItem[];
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({pokemon}) => {
  const ITEMS_PER_PAGE = 20;
  const DEBOUNCE_DELAY = 300;

  const {ref, inView} = useInView({threshold: 0.5, rootMargin: "200px"});
  const filters = usePokemonFilterStore(state => state.filters);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isFiltering, setIsFiltering] = useState(false);

  const debouncedInView = useDebounce(inView, DEBOUNCE_DELAY);

  // Pre-index Fuse.js
  const fuse = useMemo(
    () =>
      new Fuse<PokemonListItem>(pokemon, {
        keys: ["name"],
        threshold: 0.3,
      }),
    [pokemon]
  );

  // Debounce filters to reduce re-computation
  const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY);

  // Memoized filtering
  const filteredPokemon = useMemo(() => {
    setIsFiltering(true);
    let candidates = pokemon;

    // Fuzzy search
    if (debouncedFilters.search) {
      candidates = fuse.search(debouncedFilters.search).map(r => r.item);
    }

    // Apply filters
    candidates = candidates.filter(p => {
      const matchesGeneration = debouncedFilters.generation
        ? p.generation === debouncedFilters.generation
        : true;
      const matchesTypes = debouncedFilters.types.length
        ? debouncedFilters.types.every(t => p.types.includes(t))
        : true;
      const matchesAbilities = debouncedFilters.abilities.length
        ? debouncedFilters.abilities.every(a => p.abilities.includes(a))
        : true;
      const matchesStats = debouncedFilters.stats.every(s => {
        const stat = p.stats.find(ps => ps.stat === s.stat);
        return stat && stat.value >= s.min && stat.value <= s.max;
      });
      return matchesGeneration && matchesTypes && matchesAbilities && matchesStats;
    });

    setIsFiltering(false);
    return candidates;
  }, [debouncedFilters, pokemon, fuse]);

  // Infinite loading
  useEffect(() => {
    if (debouncedInView && displayCount < filteredPokemon.length) {
      requestAnimationFrame(() => {
        setDisplayCount(prev => prev + ITEMS_PER_PAGE);
      });
    }
  }, [debouncedInView, displayCount, filteredPokemon.length]);

  if (isFiltering) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(295px,1fr))] gap-2">
        {Array.from({length: ITEMS_PER_PAGE}).map((_, i) => (
          <PokemonCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (filteredPokemon.length === 0) {
    return (
      <div
        className="py-8 text-center"
        aria-live="polite">
        <Badge
          variant="secondary"
          className="px-4 py-1.5 text-sm">
          No Pokémon found with current filters.
        </Badge>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(295px,1fr))] gap-2"
        role="grid"
        aria-label="Pokémon grid">
        {filteredPokemon.slice(0, displayCount).map((p, i) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            pageIndex={i}
          />
        ))}
      </div>
      <div
        ref={ref}
        className="col-span-full py-8 text-center"
        aria-live="polite">
        {displayCount < filteredPokemon.length ? (
          <Loader
            message="Loading more Pokémon..."
            aria-label="Loading more Pokémon"
          />
        ) : (
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-sm"
            aria-label="All Pokémon loaded">
            No more Pokémon
          </Badge>
        )}
      </div>
    </>
  );
};
