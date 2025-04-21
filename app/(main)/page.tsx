import {Metadata} from "next";

import {PokemonFilters} from "@/components/pokemon/pokemon-filter";
import {PokemonGrid} from "@/components/pokemon/pokemon-grid";
import {SearchInput} from "@/components/pokemon/pokemon-search-input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {POKEMON_BASE_URL} from "@/constants";
import {PokemonListItem} from "@/types/pokemon";

export const metadata: Metadata = {
  title: "Pokedex - Complete Pokemon Database",
  description: "Explore all Pokemon across all generations.",
};

interface PokeApiPokemonList {
  results: {name: string; url: string}[];
}

interface PokeApiPokemon {
  id: number;
  name: string;
  types: {type: {name: string}}[];
  abilities: {ability: {name: string}}[];
  stats: {stat: {name: string}; base_stat: number}[];
  species: {url: string};
}

interface PokeApiSpecies {
  generation: {url: string};
}

interface PokeApiGeneration {
  name: string;
}

// Utility for fetching with static caching
async function fetchWithCache<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "force-cache", // Cache for SSG at build time
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

async function fetchAllPokemonGridDetails(): Promise<PokemonListItem[]> {
  try {
    const listData = await fetchWithCache<PokeApiPokemonList>(
      `${POKEMON_BASE_URL}/pokemon?limit=2000` // Fetch all Pokemon (~1302 as of 2025)
    );

    const pokemonDetailPromises = listData.results.map(async ({url}) => {
      try {
        const pokemonData = await fetchWithCache<PokeApiPokemon>(url);
        const speciesData = await fetchWithCache<PokeApiSpecies>(pokemonData.species.url);
        const generationData = await fetchWithCache<PokeApiGeneration>(speciesData.generation.url);

        return {
          id: pokemonData.id,
          name: pokemonData.name,
          types: pokemonData.types.map(t => t.type.name),
          abilities: pokemonData.abilities.map(a => a.ability.name),
          stats: pokemonData.stats.map(s => ({
            stat: s.stat.name,
            value: s.base_stat,
          })),
          generation: generationData.name,
        };
      } catch (err) {
        console.error(`Failed to fetch data for ${url}:`, err);
        return null;
      }
    });

    const allPokemonDetails = await Promise.all(pokemonDetailPromises);
    const validPokemon = allPokemonDetails.filter((item): item is PokemonListItem => item !== null);

    if (validPokemon.length === 0) {
      throw new Error("No valid Pokemon data retrieved");
    }

    return validPokemon;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw new Error("Failed to fetch Pokemon data");
  }
}

// Force static generation
export const dynamic = "force-static";

export default async function PokedexPage() {
  const pokemon: PokemonListItem[] = await fetchAllPokemonGridDetails();

  return (
    <div className="flex h-screen w-full flex-col gap-2 overflow-hidden px-2 py-1">
      {/* Top search bar */}
      <div className="flex items-center gap-2">
        <SearchInput />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Desktop filters - hidden on mobile */}
        <ScrollArea className="hidden w-auto md:block">
          <PokemonFilters />
        </ScrollArea>

        {/* Pokemon grid */}
        <ScrollArea className="w-full">
          <PokemonGrid pokemon={pokemon} />
        </ScrollArea>
      </div>
    </div>
  );
}
