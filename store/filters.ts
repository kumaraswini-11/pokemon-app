import {create} from "zustand";

export interface StatFilter {
  stat: string;
  min: number;
  max: number;
}

export interface FilterState {
  search: string;
  types: string[];
  abilities: string[];
  generation: string | null;
  stats: StatFilter[];
}

interface PokemonFilterStore {
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  search: "",
  types: [],
  abilities: [],
  generation: null,
  stats: [
    {stat: "hp", min: 0, max: 255},
    {stat: "attack", min: 0, max: 255},
    {stat: "defense", min: 0, max: 255},
    {stat: "special-attack", min: 0, max: 255},
    {stat: "special-defense", min: 0, max: 255},
    {stat: "speed", min: 0, max: 255},
  ],
};

export const usePokemonFilterStore = create<PokemonFilterStore>(set => ({
  filters: initialFilters,
  setFilters: newFilters =>
    set(state => ({
      filters: {...state.filters, ...newFilters},
    })),
  resetFilters: () => set({filters: initialFilters}),
}));
