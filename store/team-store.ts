import { create } from "zustand";
import { persist } from "zustand/middleware";

import { MAX_POKEMON_PER_TEAM } from "@/constants";
import { PokemonInTeam, Team, TypeEffectiveness } from "@/types";

type TeamStore = {
  teams: Team[];
  addTeam: (name: string) => string;
  deleteTeam: (id: string) => void;
  addPokemonToTeam: (teamId: string, pokemon: PokemonInTeam) => void;
  removePokemonFromTeam: (teamId: string, pokemonId: number) => void;
  reorderPokemonInTeam?: (
    teamId: string,
    startIndex: number,
    endIndex: number
  ) => void; // Players often want to arrange their team in a specific order for personal preference, readability - only for that purpose is requred, else it will not effect end result.
};

// Zustand Store with Persistence
export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      teams: [],
      addTeam: (name: string) => {
        if (!name.trim()) throw new Error("Team name cannot be empty");
        const id = crypto.randomUUID();
        set((state) => ({
          teams: [...state.teams, { id, name, members: [] }],
        }));
        return id;
      },

      deleteTeam: (id: string) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id),
        })),

      addPokemonToTeam: (teamId: string, pokemon: PokemonInTeam) =>
        set((state) => {
          const team = state.teams.find((t) => t.id === teamId);

          if (!team) throw new Error(`Team with ID ${teamId} not found`);
          if (team.members.length >= MAX_POKEMON_PER_TEAM) return state; // Silently ignore if full
          if (!pokemon.types)
            throw new Error("Pokemon must have types for analysis");
          return {
            teams: state.teams.map((t) =>
              t.id === teamId ? { ...t, members: [...t.members, pokemon] } : t
            ),
          };
        }),

      removePokemonFromTeam: (teamId: string, pokemonId: number) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: team.members.filter((p) => p.id !== pokemonId),
                }
              : team
          ),
        })),

      reorderPokemonInTeam: (
        teamId: string,
        startIndex: number,
        endIndex: number
      ) =>
        set((state) => {
          const team = state.teams.find((t) => t.id === teamId);
          if (!team) throw new Error(`Team with ID ${teamId} not found`);
          if (
            startIndex < 0 ||
            endIndex < 0 ||
            startIndex >= team.members.length ||
            endIndex >= team.members.length
          ) {
            return state; // Ignore invalid indices
          }
          const newMembers = Array.from(team.members);
          const [reorderedItem] = newMembers.splice(startIndex, 1);
          newMembers.splice(endIndex, 0, reorderedItem);
          return {
            teams: state.teams.map((t) =>
              t.id === teamId ? { ...t, members: newMembers } : t
            ),
          };
        }),
    }),
    {
      name: "team-storage",
      version: 1,
      partialize: (state) => ({ teams: state.teams }), // Only persist teams
    }
  )
);

// Team Analysis Utility (uses dynamic type effectiveness)
export const analyzeTeam = (
  team: Team,
  typeEffectiveness: Record<string, TypeEffectiveness>
) => {
  const typeCoverage: Record<string, number> = {};
  const weaknesses: Record<string, number> = {};

  team.members.forEach((pokemon) => {
    pokemon.types.forEach((type) => {
      const typeData = typeEffectiveness[type] || {};

      // Offensive Coverage (super-effective)
      typeData.double_damage_to.forEach((targetType) => {
        typeCoverage[targetType] = (typeCoverage[targetType] || 0) + 1;
      });

      // Defensive Weaknesses
      Object.entries(typeEffectiveness).forEach(([atkType, effects]) => {
        if (effects.double_damage_to.includes(type)) {
          weaknesses[atkType] = (weaknesses[atkType] || 0) + 1;
        }
      });
    });
  });

  return {
    typeCoverage: Object.entries(typeCoverage)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({ type, count })),
    weaknesses: Object.entries(weaknesses)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({ type, count })),
  };
};
