"use client";

import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { usePokemonList } from "@/hooks/use-pokemon-queries";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { PokemonListParams } from "@/types";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
import { PokemonCard } from "./pokemon-card";

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
          Failed to load Pokémon. Please try again later.
        </p>
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
      <div ref={ref} className="col-span-full py-8 text-center">
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading more Pokémon...
            </span>
          </div>
        ) : hasNextPage ? (
          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Scroll to load more
          </Badge>
        ) : (
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            No more Pokémon
          </Badge>
        )}
      </div>
    </div>
  );
};
