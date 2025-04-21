/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQuery} from "@tanstack/react-query";

import {POKEMON_BASE_URL} from "@/constants";
import {get} from "@/lib/api";

const SIX_MONTHS_IN_MS = 1000 * 60 * 60 * 24 * 180;

interface PokeApiType {
  name: string;
  url?: string;
}
interface PokeApiResponse<T> {
  results: T[];
}

export interface PokemonData {
  id: number;
  name: string;
  types: string[];
  abilities: {name: string; hidden: boolean}[];
  stats: {stat: string; value: number}[];
  height: number;
  weight: number;
  moves: {name: string; type: string; power: number | null; pp: number | null}[];
  generation?: string;
  description?: "";
  evolution: any;
}

export interface TypeEffectivenessData {
  [type: string]: {
    double_damage_to: string[];
    half_damage_to: string[];
    no_damage_to: string[];
  };
}

export const usePokemonQuery = <T>(key: string, endpoint: string) =>
  useQuery<T>({
    queryKey: [key],
    queryFn: async (): Promise<T> => {
      const {data} = await get<PokeApiResponse<PokeApiType>>(endpoint);
      const names = data.results
        .map(item => item.name)
        .filter(name => !["unknown", "shadow"].includes(name))
        .sort();
      return names as T;
    },
    staleTime: SIX_MONTHS_IN_MS,
    gcTime: SIX_MONTHS_IN_MS,
    retry: 2, // Retry twice on failure
  });

export const usePokemonTypes = () => usePokemonQuery<string[]>("types", "/type");
export const usePokemonGenerations = () => usePokemonQuery<string[]>("generations", "/generation");
export const usePokemonAbilities = () => usePokemonQuery<string[]>("abilities", "/ability");

// ==========================================================================

export const usePokemonDetails = (id: string) => {
  return useQuery({
    queryKey: ["pokemon-details", id],
    queryFn: async (): Promise<PokemonData> => {
      const {data: pokemon} = await get<any>(`/pokemon/${id.toLowerCase()}`);

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

      const stats = pokemon.stats.map((s: any) => ({
        stat: s.stat.name,
        value: s.base_stat,
      }));

      const height = pokemon.height / 10;
      const weight = pokemon.weight / 10;

      const description =
        species.flavor_text_entries.find((entry: any) => entry.language.name === "en")
          ?.flavor_text || "No description available";

      const generation = generationData.name;

      const evolutionChain: any = [];
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
    enabled: !!id,
  });
};

export const usePokemonTypeEffectiveness = () => {
  return useQuery<TypeEffectivenessData>({
    queryKey: ["typeEffectiveness"],
    queryFn: async () => {
      const response = await fetch(`${POKEMON_BASE_URL}/type`);
      if (!response.ok) {
        throw new Error("Failed to fetch type effectiveness data");
      }

      const data = await response.json();
      const result: TypeEffectivenessData = {};

      // Process each type in parallel for better performance
      await Promise.all(
        data.results.map(async (type: any) => {
          const typeResponse = await fetch(type.url);
          if (!typeResponse.ok) {
            return; // Skip this type if fetch fails
          }

          const typeData = await typeResponse.json();
          result[typeData.name] = {
            double_damage_to: typeData.damage_relations.double_damage_to.map((t: any) => t.name),
            half_damage_to: typeData.damage_relations.half_damage_to.map((t: any) => t.name),
            no_damage_to: typeData.damage_relations.no_damage_to.map((t: any) => t.name),
          };
        })
      );

      return result;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

// ===========================================================================================

// export const usePokemonList = () => {
//   const {filters} = usePokemonFilterStore();

//   const query = useInfiniteQuery({
//     queryKey: ["pokemon", filters],
//     queryFn: async ({pageParam = 0}): Promise<PokemonListResponse> => {
//       const offset = pageParam * LIMIT;
//       const {data} = await get<PokemonListApiResponse>("/pokemon", {LIMIT, offset});

//       // Fetch detailed data for each Pokémon
//       const detailedResults = await Promise.all(
//         data.results.map(async p => {
//           const {data: details} = await get<any>(p.url);
//           const {data: species} = await get<any>(details.species.url);
//           const {data: generationData} = await get<any>(species.generation.url);

//           return {
//             id: details.id,
//             name: details.name,
//             url: p.url,
//             types: details.types.map((t: any) => t.type.name),
//             abilities: details.abilities.map((a: any) => a.ability.name),
//             generation: generationData.name,
//             stats: details.stats.map((s: any) => ({
//               stat: s.stat.name,
//               value: s.base_stat,
//             })),
//           } as PokemonListItem;
//         })
//       );

//       return {
//         results: detailedResults,
//         nextOffset: data.next ? offset + LIMIT : null,
//         total: data.count,
//       };
//     },
//     getNextPageParam: (lastPage, _allPages, lastPageParam) =>
//       lastPage.nextOffset !== null ? lastPageParam + 1 : undefined,
//     initialPageParam: 0,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     refetchOnWindowFocus: false,
//     select: data => {
//       const allPokemon = data.pages.flatMap(page => page.results);

//       const filteredPokemon = allPokemon.filter(pokemon => {
//         const statMap = pokemon.stats.reduce((acc: Record<string, number>, s) => {
//           acc[s.stat] = s.value;
//           return acc;
//         }, {});

//         return (
//           (!filters.search || pokemon.name.toLowerCase().includes(filters.search.toLowerCase())) &&
//           (!filters.types?.length || filters.types.every(t => pokemon.types.includes(t))) &&
//           (!filters.abilities?.length ||
//             filters.abilities.every(a => pokemon.abilities.includes(a))) &&
//           (!filters.generation || pokemon.generation === filters.generation) &&
//           (!filters.stats?.length ||
//             filters.stats.every(
//               filter =>
//                 (!filter.min || statMap[filter.stat] >= filter.min) &&
//                 (!filter.max || statMap[filter.stat] <= filter.max)
//             ))
//         );
//       });

//       return filteredPokemon.length > 0
//         ? {
//             ...data,
//             pages: [{results: filteredPokemon, nextOffset: null, total: filteredPokemon.length}],
//           }
//         : {pages: [{results: [], nextOffset: null, total: 0}], pageParams: []};
//     },
//   });

//   return query;
// };
