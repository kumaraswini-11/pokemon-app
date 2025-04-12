"use client";

import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  GripVertical,
  Trash2,
  Edit,
  Check,
  X,
  PlusCircle,
  Info,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { useTeamStore, analyzeTeam } from "@/store/team-store";
import { getTypeColor, MAX_POKEMON_PER_TEAM } from "@/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePokemonTypeEffectiveness } from "@/hooks/use-pokemon-queries";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/shared/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TeamGridProps,
  TeamCardProps,
  DragItem,
  TeamAnalysisProps,
  TeamAnalysisItemProps,
  PokemonItemProps,
} from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const ITEM_TYPE = "POKEMON";

export default function TeamBuilderPage() {
  const { data: typeEffectiveness, isLoading } = usePokemonTypeEffectiveness();
  const { teams, addTeam } = useTeamStore();

  const handleAddTeam = () => {
    const teamName = `Team ${teams.length + 1}`;
    addTeam(teamName);
    toast.success(`Created "${teamName}"`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto space-y-3 px-6 py-2">
        <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">
              Team Builder
            </h2>
            <p className="text-muted-foreground text-xs">
              Organize your Pokemon roster into strategic teams
            </p>
          </div>
          <Button onClick={handleAddTeam} size="sm" className="flex-shrink-0">
            <PlusCircle className="mr-1.5 size-3.5" />
            New Team
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader message="Loading team details..." />
          </div>
        ) : (
          <TeamGrid typeEffectiveness={typeEffectiveness} />
        )}
      </div>
    </DndProvider>
  );
}

function TeamGrid({ typeEffectiveness }: TeamGridProps) {
  const { teams, deleteTeam } = useTeamStore();

  const handleRemoveTeam = (teamId: string, teamName: string) => {
    if (!confirm(`Delete "${teamName}" team?`)) return;
    deleteTeam(teamId);
    toast.success(`"${teamName}" deleted`);
  };

  return (
    <>
      {!teams.length ? (
        <EmptyState
          onAddTeam={() => {
            const teamName = "Team 1";
            useTeamStore.getState().addTeam(teamName);
            toast.success(`Created "${teamName}"`);
          }}
        />
      ) : (
        <div className="xs:grid-cols-1 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              typeEffectiveness={typeEffectiveness}
              onRemove={() => handleRemoveTeam(team.id, team.name)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState({ onAddTeam }: { onAddTeam: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <Users className="text-muted-foreground mb-3 size-10" />
        <h3 className="mb-1 text-base font-medium">No teams yet</h3>
        <p className="text-muted-foreground mb-2 max-w-md text-xs">
          Create your first team to start organizing your Pokemon roster
        </p>
        <Button onClick={onAddTeam} size="sm">
          <PlusCircle className="mr-1.5 size-3.5" />
          Create Your First Team
        </Button>
      </CardContent>
    </Card>
  );
}

function TeamCard({ team, typeEffectiveness, onRemove }: TeamCardProps) {
  const { addPokemonToTeam, removePokemonFromTeam, updateTeamName } =
    useTeamStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(team.name);
  const analysis = analyzeTeam(team, typeEffectiveness || {});

  // useDrop is a React DnD hook that enables a component to act as a drop target
  const [{ isOver, canDrop }, drop] = useDrop({
    // Accept only items of type ITEM_TYPE (e.g., a Pokemon object).
    accept: ITEM_TYPE,

    // Function triggered when a draggable item is dropped on this target.
    drop: (item: DragItem) => {
      // Prevent moving a Pokemon within the same team.
      if (team.id === item.fromTeamId) return;

      // Check the team alredy riched the maximun limit
      if (team.members.length >= MAX_POKEMON_PER_TEAM) {
        toast.error(`Team full (${MAX_POKEMON_PER_TEAM} max)`);
        return;
      }

      // Pokemon alredy exits in the team
      if (team.members.some((p) => p.id === item.pokemon.id)) {
        toast.error(`${item.pokemon.name} already in ${team.name}`);
        return;
      }

      removePokemonFromTeam(item.fromTeamId, item.pokemon.id);
      addPokemonToTeam(team.id, item.pokemon);
      toast.success(`${item.pokemon.name} moved to ${team.name}`);
    },

    // Collect function gathers drop state information.
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleSaveName = () => {
    if (!name.trim()) {
      setName(team.name);
      toast.error("Team name cannot be empty");
      return;
    }
    updateTeamName(team.id, name);
    toast.success(`Renamed to "${name}"`);
    setIsEditing(false);
  };

  return (
    <ScrollArea className="h-[30rem]" key={team.id}>
      <Card
        ref={drop}
        className={cn(
          "py-2 transition-colors",
          isOver && canDrop ? "border-primary bg-primary/5 border-2" : null,
          isOver && !canDrop ? "border-destructive border-2" : null
        )}
      >
        <CardHeader className="flex-row items-center justify-between gap-1 p-2 px-3">
          {isEditing ? (
            <div className="flex w-full items-center gap-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="h-7 text-xs"
                autoFocus
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveName}
                      className="size-7"
                    >
                      <Check className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setName(team.name);
                        setIsEditing(false);
                      }}
                      className="size-7"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cancel</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <>
              <div className="flex min-w-0 flex-col">
                <CardTitle className="truncate text-base capitalize">
                  {team.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {team.members.length}/{MAX_POKEMON_PER_TEAM}
                </CardDescription>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                        className="size-7"
                      >
                        <Edit className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rename team</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={onRemove}
                        className="size-7"
                      >
                        <Trash2 className="text-destructive size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete team</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-1.5 px-2 pt-0">
          {team.members.length ? (
            <ul className="space-y-1.5">
              {team.members.map((pokemon) => (
                <PokemonItem
                  key={pokemon.id}
                  pokemon={pokemon}
                  teamId={team.id}
                  teamName={team.name}
                />
              ))}
            </ul>
          ) : (
            <div className="rounded-md border border-dashed p-1.5 text-center">
              <p className="text-muted-foreground text-xs font-medium">
                No Pokemon in this team
              </p>
              <p className="text-muted-foreground text-[10px]">
                Drag Pokemon here from other teams
              </p>
            </div>
          )}
        </CardContent>
        {team.members.length > 0 ? (
          <CardFooter className="px-3 py-1.5">
            <TeamAnalysis analysis={analysis} />
          </CardFooter>
        ) : (
          <CardFooter className="px-3 py-1.5">
            <div className="text-muted-foreground w-full text-center text-xs italic">
              Add at least one Pokemon to see team analysis.
            </div>
          </CardFooter>
        )}
      </Card>
    </ScrollArea>
  );
}

function TeamAnalysis({ analysis }: TeamAnalysisProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full">
      <div
        className="mb-1 flex cursor-pointer items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="flex items-center text-xs font-medium">
          <Info className="mr-1 size-3" />
          Team Analysis
        </p>
        <Badge variant="secondary" className="text-[10px]">
          Score: {analysis.score || "N/A"}
        </Badge>
      </div>

      {/* Collasiable team analysis report  */}
      {expanded ? (
        <div className="text-muted-foreground bg-muted/10 space-y-2 rounded-md border p-2 text-[10px]">
          <TeamAnalysisItem
            label="Coverage"
            items={analysis.typeCoverage}
            emptyText="No type coverage"
          />
          <TeamAnalysisItem
            label="Weaknesses"
            items={analysis.weaknesses}
            emptyText="No weaknesses"
          />
          <TeamAnalysisItem
            label="Resistances"
            items={analysis.resistances}
            emptyText="No resistances"
          />
          <TeamAnalysisItem
            label="Immunities"
            items={analysis.immunities}
            emptyText="No immunities"
          />
        </div>
      ) : (
        <div className="text-muted-foreground bg-muted/10 flex flex-wrap gap-1 rounded-md border p-2 text-[10px]">
          <TypeSummary label="Coverage" items={analysis.typeCoverage} />
          <TypeSummary
            label="Weaknesses"
            items={analysis.weaknesses}
            color="text-destructive"
          />
          <TypeSummary
            label="Resistances"
            items={analysis.resistances}
            color="text-sky-500"
          />
          <TypeSummary
            label="Immunities"
            items={analysis.immunities}
            color="text-green-500"
          />
        </div>
      )}
    </div>
  );
}

function TypeSummary({
  label,
  items,
  color = "text-primary",
}: {
  label: string;
  items: { type: string; count: number }[];
  color?: string;
}) {
  if (!items.length) return null;
  return (
    <span className={cn("whitespace-nowrap", color)}>
      {label}: {items.length}
    </span>
  );
}

function TeamAnalysisItem({ label, items, emptyText }: TeamAnalysisItemProps) {
  return (
    <div>
      <p className="mb-0.5 font-medium">{label}:</p>
      {items.length ? (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <Badge
              key={item.type}
              variant="outline"
              className={cn("px-1.5 py-0 text-[10px]", getTypeColor(item.type))}
            >
              {item.type} ({item.count}x)
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-[10px] italic">{emptyText}</p>
      )}
    </div>
  );
}

function PokemonItem({ pokemon, teamId, teamName }: PokemonItemProps) {
  const { removePokemonFromTeam } = useTeamStore();
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { type: ITEM_TYPE, pokemon, fromTeamId: teamId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleRemove = () => {
    removePokemonFromTeam(teamId, pokemon.id);
    toast.success(`${pokemon.name} removed from ${teamName}`);
  };

  return (
    <li
      ref={drag}
      className={cn(
        "flex items-center justify-between gap-1 rounded-md border px-1.5 py-0.5",
        "bg-card transition-all hover:shadow-sm",
        "hover:border-primary/30 cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-50" : ""
      )}
    >
      <div className="flex min-w-0 items-center gap-1">
        <GripVertical className="text-muted-foreground size-3 flex-shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium">{pokemon.name}</p>
          <p className="text-muted-foreground text-[10px]">
            #{String(pokemon.id).padStart(3, "0")}
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-1">
        <div className="flex gap-0.5">
          {pokemon.types.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className={cn("px-1 py-0 text-[10px]", getTypeColor(type))}
            >
              {type}
            </Badge>
          ))}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRemove}
                className="size-6"
              >
                <Trash2 className="text-destructive size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove from team</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </li>
  );
}
