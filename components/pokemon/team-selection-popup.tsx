"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTeamStore } from "@/store/team-store";
import { toast } from "sonner";
import { MAX_POKEMON_PER_TEAM, MAX_TEAM } from "@/constants";

interface TeamSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  pokemon: {
    id: number;
    name: string;
    types: string[];
  } | null;
}

export const TeamSelectionPopup: React.FC<TeamSelectionPopupProps> = ({
  isOpen,
  onClose,
  pokemon,
}) => {
  const teams = useTeamStore((state) => state.teams);
  const addTeam = useTeamStore((state) => state.addTeam);
  const addPokemonToTeam = useTeamStore((state) => state.addPokemonToTeam);

  const [newTeamName, setNewTeamName] = useState("");

  const handleAddToTeam = useCallback(
    (teamId: string) => {
      if (!pokemon) return;

      const team = teams.find((t) => t.id === teamId);
      if (!team) return;

      // Check if Pokemon already exists in the team
      const isAlreadyInTeam = team.members.some(
        (member) => member.id === pokemon.id
      );
      if (isAlreadyInTeam) {
        toast.error("Already Exists", {
          description: `${pokemon.name} is already in ${team.name}.`,
        });
        return;
      }

      if (team.members.length >= MAX_POKEMON_PER_TEAM) {
        toast.error("Team Full", {
          description: `This team already has ${MAX_POKEMON_PER_TEAM} Pokemon.`,
        });
        return;
      }

      try {
        addPokemonToTeam(teamId, {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types,
        });
        toast.success("Pokemon Added!", {
          description: `${pokemon.name} was added to ${team.name}.`,
        });
        onClose();
      } catch (error) {
        toast.error("Error", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    [pokemon, teams, addPokemonToTeam, onClose]
  );

  const handleCreateTeam = useCallback(() => {
    if (!newTeamName.trim()) {
      toast.error("Error", {
        description: "Team name cannot be empty",
      });
      return;
    }

    if (teams.length >= MAX_TEAM) {
      toast.error("Limit Reached", {
        description: `You can only create up to ${MAX_TEAM} teams.`,
      });
      return;
    }

    try {
      const teamId = addTeam(newTeamName);
      setNewTeamName("");
      if (pokemon) handleAddToTeam(teamId);
      else {
        toast.success("Team Created", {
          description: `Team "${newTeamName}" has been created.`,
        });
        onClose();
      }
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [newTeamName, teams.length, addTeam, pokemon, handleAddToTeam, onClose]);

  const teamList = useMemo(
    () =>
      teams?.map((team) => (
        <Button
          key={team.id}
          variant="outline"
          size="lg"
          className="border-border hover:bg-muted flex w-full items-center justify-between gap-1 rounded-md border p-3 transition"
          onClick={() => handleAddToTeam(team.id)}
          aria-label={`Add to ${team.name} team`}
        >
          {/* Left Section: Team Info */}
          <div className="flex w-full flex-col items-start">
            {/* Team Name + Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-foreground text-sm font-medium">
                {team.name}
              </span>
              <Badge variant="secondary" className="px-2 py-0 text-xs">
                {team.members.length}/{MAX_POKEMON_PER_TEAM}
              </Badge>
            </div>

            {/* Team Members List */}
            {team.members.length > 0 && (
              <p className="text-muted-foreground line-clamp-2 text-xs leading-tight text-wrap">
                <span className="text-foreground font-medium">Members:</span>{" "}
                {team.members.map((member) => member.name).join(", ")}
              </p>
            )}
          </div>
        </Button>
      )),
    [teams, handleAddToTeam]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a Team</DialogTitle>
          <DialogDescription>
            Create a new team or add to an existing one (max{" "}
            {MAX_POKEMON_PER_TEAM} Pokemon per team). For more functionality, go
            to the Team Builder page.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {teams.length > 0 ? (
            teamList
          ) : (
            <div className="text-muted-foreground py-4 text-center">
              No teams yet. Create your first team below.
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            placeholder="New team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
            aria-label="New team name input"
          />
          <Button onClick={handleCreateTeam} aria-label="Create new team">
            <PlusCircle className="mr-2 size-4" />
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
