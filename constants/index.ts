import { Heart, Swords, Shield, Zap, BrainCircuit, Wind } from "lucide-react";

export const POKEMON_API_BASE_URL = "https://pokeapi.co/api/v2";
export const POKEMON_END_POINTS = {
  types: "/type",
  generations: "/generation",
  abilities: "/ability?limit=100",
};
export const POKEMON_IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export const ITEMS_PER_PAGE = 10;
export const DEBOUNCE_DELAY = 300;

export const POKEMON_BASE_STATS = [
  { key: "hp", label: "HP", icon: Heart, color: "text-red-500" },
  { key: "attack", label: "Attack", icon: Swords, color: "text-orange-500" },
  { key: "defense", label: "Defense", icon: Shield, color: "text-blue-500" },
  {
    key: "special-attack",
    label: "Sp. Attack",
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    key: "special-defense",
    label: "Sp. Defense",
    icon: BrainCircuit,
    color: "text-green-500",
  },
  { key: "speed", label: "Speed", icon: Wind, color: "text-purple-500" },
];

export const getMaxStat = (stat: string) => {
  const maxStats: Record<string, number> = {
    hp: 255,
    attack: 190,
    defense: 230,
    "special-attack": 194,
    "special-defense": 230,
    speed: 180,
  };
  return maxStats[stat] || 255;
};

export const getTypeColor = (type: string) => {
  const typeColors: Record<string, string> = {
    normal: "bg-stone-200 text-stone-700",
    fire: "bg-orange-200 text-orange-800",
    water: "bg-blue-200 text-blue-800",
    electric: "bg-yellow-200 text-yellow-800",
    grass: "bg-green-200 text-green-800",
    ice: "bg-cyan-200 text-cyan-800",
    fighting: "bg-red-200 text-red-800",
    poison: "bg-purple-200 text-purple-800",
    ground: "bg-amber-200 text-amber-800",
    flying: "bg-indigo-200 text-indigo-800",
    psychic: "bg-pink-200 text-pink-800",
    bug: "bg-lime-200 text-lime-800",
    rock: "bg-stone-300 text-stone-800",
    ghost: "bg-violet-200 text-violet-800",
    dragon: "bg-violet-300 text-violet-900",
    dark: "bg-gray-800 text-gray-200",
    steel: "bg-slate-200 text-slate-800",
    fairy: "bg-pink-300 text-pink-900",
  };
  return typeColors[type] || "bg-gray-200 text-gray-700";
};

export const CATEGORY_COLORS: Record<string, string> = {
  physical: "bg-orange-500 dark:bg-orange-600",
  special: "bg-indigo-500 dark:bg-indigo-600",
  status: "bg-emerald-500 dark:bg-emerald-600",
};

export const MAX_TEAM = 15;
export const MAX_POKEMON_PER_TEAM = 6;
