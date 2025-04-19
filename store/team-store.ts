import {create} from "zustand";
import {persist} from "zustand/middleware";

import {MAX_MEMBERS_PER_TEAM} from "@/constants";
import {PokemonInTeam, Team, TypeEffectiveness} from "@/types/pokemon";

interface TeamStore {
  teams: Team[];
  addTeam: (name: string) => string;
  deleteTeam: (id: string) => void;
  addPokemonToTeam: (teamId: string, pokemon: PokemonInTeam) => void;
  removePokemonFromTeam: (teamId: string, pokemonId: number) => void;
  updateTeamName: (teamId: string, name: string) => void;
  reorderPokemonInTeam: (teamId: string, startIndex: number, endIndex: number) => void;
}

export const usePokemonTeamsStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teams: [],
      addTeam: (name: string) => {
        if (!name?.trim()) throw new Error("Team name cannot be empty");
        const trimmedName = name.trim();
        const teams = get().teams;
        if (teams.some(team => team.name.toLowerCase() === trimmedName.toLowerCase())) {
          throw new Error(`A team named "${trimmedName}" already exists`);
        }
        const id = crypto.randomUUID();
        set(state => ({
          teams: [...state.teams, {id, name: trimmedName, members: []}],
        }));
        return id;
      },

      deleteTeam: (id: string) =>
        set(state => ({
          teams: state.teams.filter(team => team.id !== id),
        })),

      addPokemonToTeam: (teamId: string, pokemon: PokemonInTeam) =>
        set(state => {
          const team = state.teams.find(t => t.id === teamId);
          if (!team) return state;
          if (team.members.length >= MAX_MEMBERS_PER_TEAM) return state;
          if (!pokemon?.types?.length) return state;
          if (team.members.some(p => p.id === pokemon.id)) return state;
          return {
            teams: state.teams.map(t =>
              t.id === teamId ? {...t, members: [...t.members, pokemon]} : t
            ),
          };
        }),

      removePokemonFromTeam: (teamId: string, pokemonId: number) =>
        set(state => {
          const team = state.teams.find(t => t.id === teamId);
          if (!team) return state;
          return {
            teams: state.teams.map(t =>
              t.id === teamId ? {...t, members: t.members.filter(p => p.id !== pokemonId)} : t
            ),
          };
        }),

      updateTeamName: (teamId: string, name: string) =>
        set(state => {
          if (!name?.trim()) return state;
          const trimmedName = name.trim();
          const teams = state.teams;
          const teamToUpdate = teams.find(t => t.id === teamId);
          if (!teamToUpdate) return state;
          if (teamToUpdate.name === trimmedName) return state;
          if (
            teams.some(t => t.id !== teamId && t.name.toLowerCase() === trimmedName.toLowerCase())
          ) {
            throw new Error(`A team named "${trimmedName}" already exists`);
          }
          return {
            teams: state.teams.map(t => (t.id === teamId ? {...t, name: trimmedName} : t)),
          };
        }),

      reorderPokemonInTeam: (teamId: string, startIndex: number, endIndex: number) =>
        set(state => {
          const team = state.teams.find(t => t.id === teamId);
          if (!team) return state;
          if (
            startIndex < 0 ||
            endIndex < 0 ||
            startIndex >= team.members.length ||
            endIndex >= team.members.length
          ) {
            return state;
          }
          const newMembers = [...team.members];
          const [reorderedItem] = newMembers.splice(startIndex, 1);
          newMembers.splice(endIndex, 0, reorderedItem);
          return {
            teams: state.teams.map(t => (t.id === teamId ? {...t, members: newMembers} : t)),
          };
        }),
    }),
    {
      name: "team-storage",
      version: 1,
      partialize: state => ({teams: state.teams}),
    }
  )
);

export const analyzeTeam = (team: Team, typeEffectiveness: Record<string, TypeEffectiveness>) => {
  const typeCoverage: Record<string, number> = {};
  const weaknesses: Record<string, number> = {};
  const resistances: Record<string, number> = {};
  const immunities: Record<string, number> = {};

  if (!team?.members?.length || !typeEffectiveness) {
    return {
      typeCoverage: [],
      weaknesses: [],
      resistances: [],
      immunities: [],
      score: 0,
    };
  }

  team.members.forEach(pokemon => {
    pokemon.types.forEach(type => {
      const typeData = typeEffectiveness[type] || {};
      typeData.double_damage_to?.forEach(targetType => {
        typeCoverage[targetType] = (typeCoverage[targetType] || 0) + 1;
      });
      typeData.double_damage_from?.forEach(weakType => {
        weaknesses[weakType] = (weaknesses[weakType] || 0) + 1;
      });
      typeData.half_damage_from?.forEach(resistType => {
        resistances[resistType] = (resistances[resistType] || 0) + 1;
      });
      typeData.no_damage_from?.forEach(immuneType => {
        immunities[immuneType] = (immunities[immuneType] || 0) + 1;
      });
    });
  });

  const toList = (obj: Record<string, number>) =>
    Object.entries(obj)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({type, count}));

  const coverageList = toList(typeCoverage);
  const weaknessList = toList(weaknesses);
  const resistanceList = toList(resistances);
  const immunityList = toList(immunities);

  const score =
    coverageList.length - weaknessList.length + resistanceList.length * 0.5 + immunityList.length;

  return {
    typeCoverage: coverageList,
    weaknesses: weaknessList,
    resistances: resistanceList,
    immunities: immunityList,
    score: Math.round(score * 10) / 10,
  };
};
