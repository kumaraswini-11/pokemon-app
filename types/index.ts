export interface PokemonListParams {
  search?: string;
  types?: string[];
  abilities?: string[];
  generation?: string;
  stats?: StatFilter[];
  limit?: number;
  offset?: number;
}

export interface StatFilter {
  stat: string;
  min?: number;
  max?: number;
}

export interface Ability {
  name: string;
  description: string;
  hidden?: boolean;
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

export interface Stat {
  stat: string;
  value: number;
}

export interface Evolution {
  id: number;
  name: string;
  level: number | null;
  trigger: string | null;
  image: string;
}

export interface TypeEffectiveness {
  double_damage_to: string[];
  double_damage_from: string[];
  half_damage_to: string[];
  half_damage_from: string[];
  no_damage_to: string[];
  no_damage_from: string[];
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

export type PokemonInTeam = {
  id: number;
  name: string;
  image?: string;
  types: string[];
};

export type Team = {
  id: string;
  name: string;
  members: PokemonInTeam[];
};
