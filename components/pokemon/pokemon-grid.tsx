"use client";

import React, {useEffect} from "react";

import {useInView} from "react-intersection-observer";

import {Badge} from "@/components/ui/badge";
import useDebounce from "@/hooks/use-debounce";
import {usePokemonList} from "@/hooks/use-pokemon-queries";

import {Loader} from "../shared/loader";
import {PokemonCard} from "./pokemon-card";
import {PokemonCardSkeleton} from "./pokemon-card-skeleton";

export const PokemonGrid: React.FC = () => {
  const {ref, inView} = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch} =
    usePokemonList();

  const allPokemon = data?.pages.flatMap(page => page.results) ?? [];
  const debouncedInView = useDebounce(inView, 300);
  const showLoadMore = useDebounce(hasNextPage && !isFetchingNextPage, 500);

  useEffect(() => {
    if (debouncedInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [debouncedInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isLoading && allPokemon.length === 0 && hasNextPage) {
      refetch();
    }
  }, [allPokemon.length, isLoading, hasNextPage, refetch]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({length: 9}).map((_, i) => (
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

  if (allPokemon.length === 0 && !hasNextPage) {
    return (
      <div className="py-8 text-center">
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(295px,1fr))] gap-2">
        {allPokemon.map((pokemon, i) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            pageIndex={i}
          />
        ))}
      </div>
      <div
        ref={ref}
        className="col-span-full py-8 text-center">
        {isFetchingNextPage ? (
          <Loader message="Loading more Pokémon..." />
        ) : showLoadMore ? (
          <Badge
            variant="default"
            className="px-4 py-1.5 text-sm cursor-pointer"
            onClick={() => fetchNextPage()}>
            Load more Pokémon
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-sm">
            No more Pokémon
          </Badge>
        )}
      </div>
    </>
  );
};
