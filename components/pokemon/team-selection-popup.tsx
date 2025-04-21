"use client";

import React, {useCallback, useMemo, useState} from "react";

import {PlusCircle} from "lucide-react";
import {toast} from "sonner";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {MAX_MEMBERS_PER_TEAM, MAX_TEAMS} from "@/constants";
import {usePokemonTeamsStore} from "@/store/team-store";
import {PokemonInTeam} from "@/types/pokemon";

interface TeamSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  pokemon: PokemonInTeam | null;
}

export const TeamSelectionPopup: React.FC<TeamSelectionPopupProps> = ({
  isOpen,
  onClose,
  pokemon,
}) => {
  const {teams, addTeam, addPokemonToTeam} = usePokemonTeamsStore();
  const [newTeamName, setNewTeamName] = useState("");

  const handleAddToTeam = useCallback(
    (teamId: string) => {
      if (!pokemon) return;

      const team = teams.find(t => t.id === teamId);
      if (!team) return;

      if (team.members.some(member => member.id === pokemon.id)) {
        toast.error("Already Exists", {
          description: `${pokemon.name} is already in ${team.name}.`,
        });
        return;
      }

      if (team.members.length >= MAX_MEMBERS_PER_TEAM) {
        toast.error("Team Full", {
          description: `This team already has ${MAX_MEMBERS_PER_TEAM} Pokemon.`,
        });
        return;
      }

      try {
        addPokemonToTeam(teamId, pokemon);
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
        description: "Team name cannot be empty.",
      });
      return;
    }

    // if (newTeamName.trim().length < 3) {
    //   toast.error("Error", {
    //     description: "Team name must be at least 3 characters.",
    //   });
    //   return;
    // }

    if (teams.length >= MAX_TEAMS) {
      toast.error("Limit Reached", {
        description: `You can only create up to ${MAX_TEAMS} teams.`,
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
      teams.map(team => (
        <Button
          key={team.id}
          variant="outline"
          size="lg"
          className="flex w-full items-center justify-between gap-1 rounded-md border border-border p-3 transition hover:bg-muted"
          onClick={() => handleAddToTeam(team.id)}
          aria-label={`Add ${pokemon?.name} to ${team.name} team with ${team.members.length} members`}>
          <div className="flex w-full flex-col items-start">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-foreground">{team.name}</span>
              <Badge
                variant="secondary"
                className="px-2 py-0 text-xs">
                {team.members.length}/{MAX_MEMBERS_PER_TEAM}
              </Badge>
            </div>
            {team.members.length > 0 && (
              <p className="line-clamp-2 text-wrap text-xs leading-tight text-muted-foreground">
                <span className="font-medium text-foreground">Members:</span>{" "}
                {team.members.map((member: PokemonInTeam) => member.name).join(", ")}
              </p>
            )}
          </div>
        </Button>
      )),
    [teams, pokemon?.name, handleAddToTeam]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a Team</DialogTitle>
          <DialogDescription>
            Create a new team or add to an existing one (max {MAX_MEMBERS_PER_TEAM} Pokemon per
            team). For more functionality, go to the Team Builder page.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {teams.length > 0 ? (
            teamList
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No teams yet. Create your first team below.
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="New team name"
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCreateTeam()}
            aria-label="New team name input"
          />
          <Button
            onClick={handleCreateTeam}
            aria-label="Create new team">
            <PlusCircle className="mr-2 size-4" />
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
