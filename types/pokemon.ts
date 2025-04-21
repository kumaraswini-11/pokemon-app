export interface Stat {
  stat: string;
  value: number;
}

export interface Ability {
  name: string;
  description: string;
  hidden: boolean;
}

export interface Move {
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  level: number | null;
}

export interface Evolution {
  id: number;
  name: string;
  level: number | null;
  trigger: string | null;
  image: string;
}

export interface PokemonData {
  id: number;
  name: string;
  generation: string;
  types: string[];
  abilities: Ability[];
  moves: Move[];
  evolution: Evolution[];
  stats: Stat[];
  height: number;
  weight: number;
  description: string;
}

export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
  types: string[];
  abilities: string[];
  generation: string;
  stats: Stat[];
}

export interface PokemonInTeam {
  id: number;
  name: string;
  types: string[];
}

export interface Team {
  id: string;
  name: string;
  members: PokemonInTeam[];
}

export interface PokemonListResponse {
  results: PokemonListItem[];
  nextOffset: number | null;
  total: number;
}

export interface StatFilter {
  stat: string;
  min: number;
  max: number;
}

export interface PokemonListParams {
  search?: string;
  types?: string[];
  abilities?: string[];
  generation?: string | null;
  stats?: StatFilter[];
  limit?: number;
  offset?: number;
}

export interface TypeEffectiveness {
  double_damage_to: string[];
  double_damage_from: string[];
  half_damage_to: string[];
  half_damage_from: string[];
  no_damage_to: string[];
  no_damage_from: string[];
}

export interface SelectOption {
  value: string;
  label: string;
}

// =========================COMPARE======================================

export interface PokemonListItem {
  id: number;
  name: string;
  generation: string;
}

export interface PokemonAbility {
  name: string;
  hidden: boolean;
}

export interface PokemonStat {
  stat: string;
  base_stat: number;
}

export interface PokemonMove {
  name: string;
  type: string;
  power: number | null;
  pp: number | null;
}

export interface PokemonData {
  id: number;
  name: string;
  types: string[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  moves: PokemonMove[];
}

export interface TypeEffectiveness {
  double_damage_to: string[];
  half_damage_to: string[];
  no_damage_to: string[];
}

export interface TypeEffectivenessData {
  [type: string]: TypeEffectiveness;
}
