import {Heart, LucideIcon, Shield, ShieldCheck, Sword, Wind, Zap} from "lucide-react";

interface PokemonStat {
  key: PokemonStatKey;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  description: string;
}

export type PokemonStatKey =
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed";

export const MAX_TEAMS = 15;
export const MAX_MEMBERS_PER_TEAM = 6;

export const MAX_STAT_VALUE = 255;
export const POKEMON_BASE_URL = "https://pokeapi.co/api/v2";
export const POKEMON_IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export const POKEMON_BASE_STATS: PokemonStat[] = [
  {
    key: "hp",
    label: "HP",
    icon: Heart,
    colorClass: "text-red-500",
    description:
      "Hit Points – represents the total health of the Pokémon. When it drops to 0, the Pokémon faints.",
  },
  {
    key: "attack",
    label: "Attack",
    icon: Sword,
    colorClass: "text-orange-500",
    description:
      "Determines how much physical damage the Pokémon can inflict using physical moves.",
  },
  {
    key: "defense",
    label: "Defense",
    icon: Shield,
    colorClass: "text-yellow-500",
    description: "Reduces physical damage taken from opponents' physical attacks.",
  },
  {
    key: "special-attack",
    label: "Sp. Atk",
    icon: Zap,
    colorClass: "text-blue-500",
    description: "Determines the strength of special (non-physical) moves used by the Pokémon.",
  },
  {
    key: "special-defense",
    label: "Sp. Def",
    icon: ShieldCheck,
    colorClass: "text-green-500",
    description: "Reduces damage received from special (non-physical) attacks.",
  },
  {
    key: "speed",
    label: "Speed",
    icon: Wind,
    colorClass: "text-purple-500",
    description: "Determines which Pokémon moves first in battle; higher speed attacks first.",
  },
];

export const TYPE_COLOR_MAP: Record<string, string> = {
  normal: "bg-neutral-400",
  fire: "bg-orange-500",
  water: "bg-sky-500",
  electric: "bg-amber-400",
  grass: "bg-emerald-500",
  ice: "bg-cyan-300",
  fighting: "bg-rose-600",
  poison: "bg-violet-500",
  ground: "bg-yellow-700",
  flying: "bg-indigo-300",
  psychic: "bg-pink-400",
  bug: "bg-lime-500",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-zinc-700",
  steel: "bg-slate-500",
  fairy: "bg-pink-300",
};

export const getPokemonTypeBgClass = (type: string): string => {
  return TYPE_COLOR_MAP[type.toLowerCase()] || "bg-gray-300";
};
