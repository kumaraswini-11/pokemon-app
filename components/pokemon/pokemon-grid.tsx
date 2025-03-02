"use client";
import React, { useEffect } from "react";
import { usePokemonList } from "@/hooks/use-pokemon-queries";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { PokemonListParams } from "@/types";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
import { PokemonCard } from "./pokemon-card";
import { Loader } from "../loader";

interface PokemonGridProps {
  params: Partial<PokemonListParams>;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({ params }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePokemonList(params);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Initial loading state for first fetch
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error handling
  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500 dark:text-red-400">
          Failed to load Pokemon. Please try again later.
        </p>
      </div>
    );
  }

  const allPokemon = data?.pages.flatMap((page) => page.results) || [];

  // Check if there are no results after applying filters
  if (allPokemon.length === 0) {
    return (
      <div className="py-8 text-center">
        <Badge variant="secondary" className="px-4 py-1.5 text-sm">
          No Pokemon found with current filters
        </Badge>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.results.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} pageIndex={i} />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Footer area for loading indicators or end messages */}
      <div ref={ref} className="col-span-full py-8 text-center">
        {isFetchingNextPage ? (
          <Loader message="Loading more Pokemon..." />
        ) : hasNextPage ? (
          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
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
    </div>
  );
};
