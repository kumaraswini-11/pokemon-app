import {Suspense} from "react";

import {PokemonComparisonClient} from "@/components/pokemon/pokemon-compare";
import {Skeleton} from "@/components/ui/skeleton";
import {POKEMON_BASE_URL} from "@/constants";
import type {PokemonListItem} from "@/types/pokemon";

export async function fetchPokemonList(): Promise<
  Pick<PokemonListItem, "id" | "name" | "generation">[]
> {
  const response = await fetch(`${POKEMON_BASE_URL}/pokemon?limit=1302`, {
    next: {revalidate: 86400}, // Revalidate every 24 hours
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.results.map((p: any) => {
    const id = Number.parseInt(p.url.split("/")[6]);
    return {
      id,
      name: p.name,
      generation: `gen${Math.ceil(id / 151)}`,
    };
  });
}

export default async function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<ComparisonSkeleton />}>
        <PokemonComparisonLoader />
      </Suspense>
    </div>
  );
}

async function PokemonComparisonLoader() {
  const pokemonList = await fetchPokemonList();

  return <PokemonComparisonClient pokemonList={pokemonList} />;
}

function ComparisonSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-8">
      <Skeleton className="h-8 w-64 mx-auto" />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
