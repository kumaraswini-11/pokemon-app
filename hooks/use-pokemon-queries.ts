/* eslint-disable @typescript-eslint/no-explicit-any */
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";

import {get} from "@/lib/api";
import {usePokemonFilterStore} from "@/store/filters";
import {
  Evolution,
  PokemonData,
  PokemonListItem,
  PokemonListResponse,
  Stat,
  TypeEffectiveness,
} from "@/types/pokemon";

const SIX_MONTHS_IN_MS = 1000 * 60 * 60 * 24 * 180;
const LIMIT = 20;

interface PokemonListApiResponse {
  results: {name: string; url: string}[];
  next: string | null;
  count: number;
}

// Generic query function for static Pokémon data
export const usePokemonQuery = <T>(key: string, endpoint: string) =>
  useQuery<T>({
    queryKey: [key],
    queryFn: async (): Promise<T> => {
      try {
        const {data} = await get<any>(endpoint);
        return (
          data.results
            .map((item: {name: string}) => item.name)
            // .filter((name: string) => !["unknown", "shadow"].includes(name))
            .sort()
        );
      } catch (error) {
        console.error(`Failed to fetch ${key}:`, error);
        return [] as T; // Fallback to empty array
      }
    },
    staleTime: SIX_MONTHS_IN_MS,
    gcTime: SIX_MONTHS_IN_MS,
    retry: 2, // Retry twice on failure
  });

export const usePokemonTypes = () => usePokemonQuery<string[]>("types", "/type");
export const usePokemonGenerations = () => usePokemonQuery<string[]>("generations", "/generation");
export const usePokemonAbilities = () => usePokemonQuery<string[]>("abilities", "/ability");

/***********************************************************************/

export const usePokemonList = () => {
  const {filters} = usePokemonFilterStore();

  const query = useInfiniteQuery({
    queryKey: ["pokemon", filters],
    queryFn: async ({pageParam = 0}): Promise<PokemonListResponse> => {
      const offset = pageParam * LIMIT;
      const {data} = await get<PokemonListApiResponse>("/pokemon", {LIMIT, offset});

      // Fetch detailed data for each Pokémon
      const detailedResults = await Promise.all(
        data.results.map(async p => {
          const {data: details} = await get<any>(p.url);
          const {data: species} = await get<any>(details.species.url);
          const {data: generationData} = await get<any>(species.generation.url);

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
          } as PokemonListItem;
        })
      );

      return {
        results: detailedResults,
        nextOffset: data.next ? offset + LIMIT : null,
        total: data.count,
      };
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.nextOffset !== null ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    select: data => {
      const allPokemon = data.pages.flatMap(page => page.results);

      const filteredPokemon = allPokemon.filter(pokemon => {
        const statMap = pokemon.stats.reduce((acc: Record<string, number>, s) => {
          acc[s.stat] = s.value;
          return acc;
        }, {});

        return (
          (!filters.search || pokemon.name.toLowerCase().includes(filters.search.toLowerCase())) &&
          (!filters.types?.length || filters.types.every(t => pokemon.types.includes(t))) &&
          (!filters.abilities?.length ||
            filters.abilities.every(a => pokemon.abilities.includes(a))) &&
          (!filters.generation || pokemon.generation === filters.generation) &&
          (!filters.stats?.length ||
            filters.stats.every(
              filter =>
                (!filter.min || statMap[filter.stat] >= filter.min) &&
                (!filter.max || statMap[filter.stat] <= filter.max)
            ))
        );
      });

      return filteredPokemon.length > 0
        ? {
            ...data,
            pages: [{results: filteredPokemon, nextOffset: null, total: filteredPokemon.length}],
          }
        : {pages: [{results: [], nextOffset: null, total: 0}], pageParams: []};
    },
  });

  return query;
};

/***********************************************************************/

export const usePokemonDetails = (name: string) => {
  return useQuery({
    queryKey: ["pokemon-details", name],
    queryFn: async (): Promise<PokemonData> => {
      const {data: pokemon} = await get<any>(`/pokemon/${name.toLowerCase()}`);

      const [speciesRes, evolutionRes, generationRes] = await Promise.all([
        get<any>(pokemon.species.url),
        get<any>(pokemon.species.url).then(({data}) => get<any>(data.evolution_chain.url)),
        get<any>(pokemon.species.url).then(({data}) => get<any>(data.generation.url)),
      ]);

      const species = speciesRes.data;
      const evolutionData = evolutionRes.data;
      const generationData = generationRes.data;

      const abilities = await Promise.all(
        pokemon.abilities.map(async (a: any) => {
          const {data: abilityData} = await get<any>(a.ability.url);
          const description =
            abilityData.effect_entries.find((entry: any) => entry.language.name === "en")
              ?.short_effect || "No description available";
          return {
            name: a.ability.name,
            description,
            hidden: a.is_hidden || false,
          };
        })
      );

      const moves = await Promise.all(
        pokemon.moves.slice(0, 10).map(async (m: any) => {
          const {data: moveData} = await get<any>(m.move.url);
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
        species.flavor_text_entries.find((entry: any) => entry.language.name === "en")
          ?.flavor_text || "No description available";

      const generation = generationData.name;

      const evolutionChain: Evolution[] = [];
      let evoStage = evolutionData.chain;

      while (evoStage) {
        const {data: evoPokemon} = await get<any>(`/pokemon/${evoStage.species.name}`);
        evolutionChain.push({
          id: evoPokemon.id,
          name: evoStage.species.name,
          level: evoStage.evolution_details[0]?.min_level ?? null,
          trigger: evoStage.evolution_details[0]?.trigger?.name ?? null,
          image: evoPokemon.sprites.front_default,
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

export const usePokemonTypeEffectiveness = () => {
  return useQuery({
    queryKey: ["type-effectiveness"],
    queryFn: async (): Promise<Record<string, TypeEffectiveness>> => {
      const {data} = await get<any>("/type");
      const types = data.results
        .filter(({name}: {name: string}) => name !== "unknown" && name !== "shadow")
        .map(({name}: {name: string}) => name);

      const extractNames = (arr: {name: string}[] = []) => arr.map(t => t.name);

      const typeData = await Promise.all(
        types.map(async (type: string) => {
          const {data} = await get<any>(`/type/${type}`);
          return {
            name: type,
            double_damage_to: extractNames(data.damage_relations.double_damage_to),
            double_damage_from: extractNames(data.damage_relations.double_damage_from),
            half_damage_to: extractNames(data.damage_relations.half_damage_to),
            half_damage_from: extractNames(data.damage_relations.half_damage_from),
            no_damage_to: extractNames(data.damage_relations.no_damage_to),
            no_damage_from: extractNames(data.damage_relations.no_damage_from),
          };
        })
      );

      return Object.fromEntries(
        typeData.map(type => [
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
    staleTime: SIX_MONTHS_IN_MS,
    gcTime: SIX_MONTHS_IN_MS,
  });
};
