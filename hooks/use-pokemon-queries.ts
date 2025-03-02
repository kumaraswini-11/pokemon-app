import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/utils";
import {
  PokemonListParams,
  PokemonData,
  Ability,
  Move,
  Stat,
  Evolution,
  TypeEffectiveness,
} from "@/types";

interface PokemonListResponse {
  results: {
    id: number;
    name: string;
    url: string;
    types: string[];
    abilities: string[];
    generation: string;
    stats: Stat[];
  }[];
  nextOffset: number | null;
  total: number;
}

// Fetch Pokemon List with Client-Side Filtering and Infinite Scroll
export const usePokemonList = (params: Partial<PokemonListParams>) => {
  return useInfiniteQuery({
    queryKey: ["pokemon", params],
    queryFn: async ({ pageParam = 0 }): Promise<PokemonListResponse> => {
      const limit = params.limit || 20;
      const offset = pageParam * limit;
      const { data } = await api.get(
        `/pokemon?limit=${limit}&offset=${offset}`
      );

      // Fetch detailed data for each Pokemon
      const detailedResults = await Promise.all(
        data.results.map(async (p: { name: string; url: string }) => {
          const { data: details } = await api.get(p.url);
          const { data: species } = await api.get(details.species.url);
          const { data: generationData } = await api.get(
            species.generation.url
          );
          return {
            id: details.id,
            name: details.name,
            url: p.url,
            types: details.types.map((t: any) => t.type.name),
            abilities: details.abilities.map((a: any) => a.ability.name),
            generation: generationData.name,
            stats: details.stats.map((s: any) => ({
              stat: s.stat.name,
              value: s.base_stat,
            })),
          };
        })
      );

      // Apply filters client-side
      const filteredResults = detailedResults.filter((pokemon) => {
        const statMap = pokemon.stats.reduce(
          (acc: Record<string, number>, s) => {
            acc[s.stat] = s.value;
            return acc;
          },
          {}
        );

        return (
          (!params.search ||
            pokemon.name.toLowerCase().includes(params.search.toLowerCase())) &&
          (!params.types?.length ||
            params.types.every((t) => pokemon.types.includes(t))) &&
          (!params.abilities?.length ||
            params.abilities.every((a) => pokemon.abilities.includes(a))) &&
          (!params.generation || pokemon.generation === params.generation) &&
          (!params.stats?.length ||
            params.stats.every(
              (filter) =>
                (!filter.min || statMap[filter.stat] >= filter.min) &&
                (!filter.max || statMap[filter.stat] <= filter.max)
            ))
        );
      });

      return {
        results: filteredResults,
        nextOffset: data.next ? offset + limit : null,
        total: data.count, // Unfiltered total
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextOffset !== null
        ? lastPage.nextOffset / (params.limit || 20)
        : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Fetch All Pokemon Types
export const usePokemonTypes = () => {
  return useQuery({
    queryKey: ["types"],
    queryFn: async (): Promise<string[]> => {
      const { data } = await api.get("/type");
      return data.results
        .map((type: { name: string }) => type.name)
        .filter((name: string) => name !== "unknown" && name !== "shadow");
    },
    staleTime: Infinity,
    select: (data) => data.sort(),
  });
};

// Fetch All Generations
export const usePokemonGenerations = () => {
  return useQuery({
    queryKey: ["generations"],
    queryFn: async (): Promise<string[]> => {
      const { data } = await api.get("/generation");
      return data.results.map((gen: { name: string }) => gen.name);
    },
    staleTime: Infinity,
    select: (data) => data.sort(),
  });
};

// Fetch All Pokemon Abilities
export const usePokemonAbilities = () => {
  return useQuery({
    queryKey: ["abilities"],
    queryFn: async (): Promise<string[]> => {
      const { data } = await api.get("/ability");
      return data.results.map((ability: { name: string }) => ability.name);
    },
    staleTime: Infinity,
    select: (data) => data.sort(),
  });
};

// Fetch Individual Pokemon Details
export const usePokemonDetails = (name: string) => {
  return useQuery({
    queryKey: ["pokemon-details", name],
    queryFn: async (): Promise<PokemonData> => {
      const { data: pokemon } = await api.get(`/pokemon/${name.toLowerCase()}`);
      const [speciesRes, evolutionRes, generationRes] = await Promise.all([
        api.get(pokemon.species.url),
        api
          .get(pokemon.species.url)
          .then(({ data }) => api.get(data.evolution_chain.url)),
        api
          .get(pokemon.species.url)
          .then(({ data }) => api.get(data.generation.url)),
      ]);

      const species = speciesRes.data;
      const evolutionData = evolutionRes.data;
      const generationData = generationRes.data;

      const abilities: Ability[] = await Promise.all(
        pokemon.abilities.map(async (a: any) => {
          const { data: abilityData } = await api.get(a.ability.url);
          const description =
            abilityData.effect_entries.find(
              (entry: any) => entry.language.name === "en"
            )?.short_effect || "No description available";
          return {
            name: a.ability.name,
            description,
            hidden: a.is_hidden || false,
          };
        })
      );

      const moves: Move[] = await Promise.all(
        pokemon.moves.slice(0, 10).map(async (m: any) => {
          const { data: moveData } = await api.get(m.move.url);
          return {
            name: m.move.name,
            type: moveData.type.name,
            category: moveData.damage_class.name,
            power: moveData.power ?? null,
            accuracy: moveData.accuracy ?? null,
            pp: moveData.pp ?? null,
            level: m.version_group_details[0]?.level_learned_at ?? null,
          };
        })
      );

      const stats: Stat[] = pokemon.stats.map((s: any) => ({
        stat: s.stat.name,
        value: s.base_stat,
      }));

      const height = pokemon.height / 10;
      const weight = pokemon.weight / 10;
      const description =
        species.flavor_text_entries.find(
          (entry: any) => entry.language.name === "en"
        )?.flavor_text || "No description available";
      const generation = generationData.name;

      const evolutionChain: Evolution[] = [];
      let evoStage = evolutionData.chain;
      while (evoStage) {
        const { data: evoPokemon } = await api.get(
          `/pokemon/${evoStage.species.name}`
        );
        evolutionChain.push({
          id: evoPokemon.id,
          name: evoStage.species.name,
          level: evoStage.evolution_details[0]?.min_level ?? null,
          trigger: evoStage.evolution_details[0]?.trigger?.name ?? null,
          image: evoPokemon.sprites.front_default || "/api/placeholder/120/120",
        });
        evoStage = evoStage.evolves_to[0] || null;
      }

      return {
        id: pokemon.id,
        name: pokemon.name,
        generation,
        types: pokemon.types.map((t: any) => t.type.name),
        abilities,
        moves,
        evolution: evolutionChain,
        stats,
        height,
        weight,
        description,
      };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!name,
  });
};

// Fetch All Pokemon Species (helps only for auto complete)
export const usePokemonSpecies = (name: string) => {
  return useQuery({
    queryKey: ["pokemon-species", name],
    queryFn: async (): Promise<{ name: string; url: string }[]> => {
      const { data } = await api.get("/pokemon-species");
      return data.results;
    },
    enabled: !!name,
    staleTime: Infinity,
    select: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
};

// Fetching Type Effectiveness
export const usePokemonTypeEffectiveness = () => {
  return useQuery({
    queryKey: ["type-effectiveness"],
    queryFn: async (): Promise<Record<string, TypeEffectiveness>> => {
      const { data: typeList } = await api.get("/type");
      const types = typeList.results
        .filter(
          ({ name }: { name: string }) =>
            name !== "unknown" && name !== "shadow"
        )
        .map(({ name }: { name: string }) => name);

      const extractNames = (arr: { name: string }[] = []) =>
        arr.map((t) => t.name);

      const typeData = await Promise.all(
        types.map(async (type) => {
          const { data } = await api.get(`/type/${type}`);
          return {
            name: type,
            double_damage_to: extractNames(
              data.damage_relations.double_damage_to
            ),
            double_damage_from: extractNames(
              data.damage_relations.double_damage_from
            ),
            half_damage_to: extractNames(data.damage_relations.half_damage_to),
            half_damage_from: extractNames(
              data.damage_relations.half_damage_from
            ),
            no_damage_to: extractNames(data.damage_relations.no_damage_to),
            no_damage_from: extractNames(data.damage_relations.no_damage_from),
          };
        })
      );

      return Object.fromEntries(
        typeData.map((type) => [
          type.name,
          {
            double_damage_to: type.double_damage_to,
            double_damage_from: type.double_damage_from,
            half_damage_to: type.half_damage_to,
            half_damage_from: type.half_damage_from,
            no_damage_to: type.no_damage_to,
            no_damage_from: type.no_damage_from,
          },
        ])
      );
    },
    staleTime: Infinity,
  });
};
