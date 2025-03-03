"use client";
import React, { useEffect } from "react";

import { usePokemonList } from "@/hooks/use-pokemon-queries";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { PokemonListParams } from "@/types";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
import { PokemonCard } from "./pokemon-card";
import { Loader } from "../loader";
import useDebounce from "@/hooks/use-debounce";
import { DEBOUNCE_DELAY } from "@/constants";

interface PokemonGridProps {
  params: Partial<PokemonListParams>;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({ params }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Allow re-triggering when scrolled back
    threshold: 0.1, // Adjusted for better accuracy
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = usePokemonList(params);

  const allPokemon = data?.pages?.flatMap((page) => page.results) ?? [];

  // Debounce the inView value to prevent unnecessary fetches
  const debouncedInView = useDebounce(inView, DEBOUNCE_DELAY);

  useEffect(() => {
    if (debouncedInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [debouncedInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Trigger a refetch if the cached data has no results
  useEffect(() => {
    if (!isLoading && allPokemon.length === 0) {
      refetch();
    }
  }, [allPokemon.length, isLoading, refetch]);

  // Prevent flickering of "Load More" button
  const showLoadMore = useDebounce(hasNextPage && !isFetchingNextPage, 500);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500 dark:text-red-400">
          Failed to load Pokemon. Please try again later.
        </p>
      </div>
    );
  }

  if (allPokemon.length === 0 && isLoading) {
    return (
      <div className="py-8 text-center">
        <Badge variant="secondary" className="px-4 py-1.5 text-sm">
          No Pokemon found with current filters.
        </Badge>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(295px,1fr))] gap-1">
        {allPokemon.map((pokemon, i) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} pageIndex={i} />
        ))}
      </div>

      {/* Footer area for loading indicators or end messages */}
      <div ref={ref} className="col-span-full py-8 text-center">
        {isFetchingNextPage ? (
          <Loader message="Loading more Pokemon..." />
        ) : showLoadMore ? (
          <Badge
            variant="default"
            className="px-4 py-1.5 text-sm"
            onClick={() => fetchNextPage()}
          >
            Load more Pokemon
          </Badge>
        ) : (
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            No more Pokemon
          </Badge>
        )}
      </div>
    </>
  );
};
