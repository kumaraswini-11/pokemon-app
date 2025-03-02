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
