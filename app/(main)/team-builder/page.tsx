"use client";

import React, {useMemo, useState} from "react";

import {Check, Edit, GripVertical, Info, PlusCircle, Trash2, Users, X} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {toast} from "sonner";

import {TeamSelectionPopup} from "@/components/pokemon/team-selection-popup";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {MAX_MEMBERS_PER_TEAM, getPokemonTypeBgClass} from "@/constants";
import {usePokemonTypeEffectiveness} from "@/hooks/use-pokemon-queries";
import {cn} from "@/lib/utils";
import {analyzeTeam, usePokemonTeamsStore} from "@/store/team-store";
import {PokemonInTeam} from "@/types/pokemon";

const ITEM_TYPE = "POKEMON";

interface TypeEffectivenessData {
  [type: string]: {
    doubleDamageFrom: string[];
    halfDamageFrom: string[];
    noDamageFrom: string[];
    doubleDamageTo: string[];
    halfDamageTo: string[];
    noDamageTo: string[];
  };
}

interface DragItem {
  type: string;
  pokemon: PokemonInTeam;
  fromTeamId: string;
}

interface TeamAnalysis {
  score: number;
  typeCoverage: {type: string; count: number}[];
  weaknesses: {type: string; count: number}[];
  resistances: {type: string; count: number}[];
  immunities: {type: string; count: number}[];
}

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    members: PokemonInTeam[];
  };
  typeEffectiveness?: TypeEffectivenessData;
  onRemove: () => void;
}

interface TeamAnalysisItemProps {
  label: string;
  items: {type: string; count: number}[];
  emptyText: string;
  icon: React.ReactNode;
}

interface PokemonItemProps {
  pokemon: PokemonInTeam;
  teamId: string;
  teamName: string;
}

export default function TeamBuilderPage() {
  const {data: typeEffectiveness, isLoading, isError} = usePokemonTypeEffectiveness();
  const {teams, addTeam} = usePokemonTeamsStore();

  const handleAddTeam = () => {
    const teamName = `Team ${teams.length + 1}`;
    addTeam(teamName);
    toast.success(`Created "${teamName}"`, {duration: 2000});
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        className="container mx-auto px-6 py-2"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5}}
        aria-live="polite">
        {/* Header */}
        <Card className="mb-2 py-0 rounded-xl shadow-md">
          <CardContent className="flex flex-col items-start justify-between gap-2 p-4 sm:flex-row sm:items-center">
            <div className="space-y-0.5">
              <h2 className="text-xl font-semibold tracking-tight">Team Builder</h2>
              <p className="text-muted-foreground text-xs">
                Organize your Pokémon roster into strategic teams
              </p>
            </div>
            <motion.div
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}>
              <Button
                onClick={handleAddTeam}
                size="sm"
                aria-label="Create new team">
                <PlusCircle className="mr-1.5 size-3.5" />
                New Team
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-3 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({length: 5}).map((_, i) => (
              <TeamCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <Card className="border-destructive rounded-xl text-center">
            <CardContent className="py-8">
              <p className="text-destructive mb-2 text-sm font-medium">
                Failed to load type effectiveness data.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                aria-label="Retry loading">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TeamGrid typeEffectiveness={typeEffectiveness} />
        )}
      </motion.div>
    </DndProvider>
  );
}

function TeamGrid({typeEffectiveness}: {typeEffectiveness?: TypeEffectivenessData}) {
  const {teams, deleteTeam} = usePokemonTeamsStore();

  const handleRemoveTeam = (teamId: string, teamName: string) => {
    if (!window.confirm(`Delete "${teamName}" team?`)) return;
    deleteTeam(teamId);
    toast.success(`"${teamName}" deleted`, {duration: 2000});
  };

  return (
    <AnimatePresence>
      {!teams.length ? (
        <motion.div
          key="empty"
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0, scale: 0.95}}
          transition={{duration: 0.3}}>
          <EmptyState
            onAddTeam={() => {
              const teamName = `Team ${teams.length + 1}`;
              usePokemonTeamsStore.getState().addTeam(teamName);
              toast.success(`Created "${teamName}"`, {duration: 2000});
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          className="grid gap-3 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.3}}>
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: index * 0.1}}>
              <TeamCard
                team={team}
                typeEffectiveness={typeEffectiveness}
                onRemove={() => handleRemoveTeam(team.id, team.name)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmptyState({onAddTeam}: {onAddTeam: () => void}) {
  return (
    <Card className="border-dashed rounded-xl shadow-md">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <motion.div
          initial={{scale: 0.8}}
          animate={{scale: 1}}
          transition={{duration: 0.5}}>
          <Users className="text-muted-foreground mb-3 size-10" />
        </motion.div>
        <h3 className="mb-1 text-base font-medium">No teams yet</h3>
        <p className="text-muted-foreground mb-2 max-w-md text-xs">
          Create your first team to start organizing your Pokémon roster
        </p>
        <motion.div
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}>
          <Button
            onClick={onAddTeam}
            size="sm"
            aria-label="Create first team">
            <PlusCircle className="mr-1.5 size-3.5" />
            Create Your First Team
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

const TeamCard = ({team, typeEffectiveness, onRemove}: TeamCardProps) => {
  const {addPokemonToTeam, removePokemonFromTeam, updateTeamName} = usePokemonTeamsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(team.name);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const analysis = useMemo(
    () => analyzeTeam(team, typeEffectiveness || {}),
    [team, typeEffectiveness]
  );

  const [{isOver, canDrop}, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: DragItem) => {
      if (!item.pokemon || team.id === item.fromTeamId) return;
      if (team.members.length >= MAX_MEMBERS_PER_TEAM) {
        toast.error(`Team full (${MAX_MEMBERS_PER_TEAM} max)`, {duration: 2000});
        return;
      }
      if (team.members.some(p => p.id === item.pokemon.id)) {
        toast.error(`${item.pokemon.name} already in ${team.name}`, {duration: 2000});
        return;
      }
      removePokemonFromTeam(item.fromTeamId, item.pokemon.id);
      addPokemonToTeam(team.id, item.pokemon);
      toast.success(`${item.pokemon.name} moved to ${team.name}`, {duration: 2000});
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleSaveName = () => {
    if (!name.trim()) {
      setName(team.name);
      toast.error("Team name cannot be empty", {duration: 2000});
      return;
    }
    updateTeamName(team.id, name);
    toast.success(`Renamed to "${name}"`, {duration: 2000});
    setIsEditing(false);
  };

  return (
    <>
      <TeamSelectionPopup
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelect={(pokemon: PokemonInTeam) => {
          if (team.members.length >= MAX_MEMBERS_PER_TEAM) {
            toast.error(`Team full (${MAX_MEMBERS_PER_TEAM} max)`, {duration: 2000});
            return;
          }
          if (team.members.some(p => p.id === pokemon.id)) {
            toast.error(`${pokemon.name} already in ${team.name}`, {duration: 2000});
            return;
          }
          addPokemonToTeam(team.id, pokemon);
          toast.success(`${pokemon.name} added to ${team.name}`, {duration: 2000});
        }}
      />
      <ScrollArea className="h-[30rem]">
        <Card
          ref={drop}
          className={cn(
            "transition-all py-0 gap-2",
            isOver && canDrop ? "border-primary bg-primary/5 border-2" : "",
            isOver && !canDrop ? "border-destructive bg-destructive/5 border-2" : "",
            "rounded-xl shadow-md"
          )}>
          <CardHeader className={cn("flex-row items-center justify-between gap-1 p-2 px-3")}>
            {isEditing ? (
              <div className="flex w-full items-center gap-1">
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveName()}
                  className="h-7 text-xs"
                  autoFocus
                  aria-label="Edit team name"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveName}
                        className="size-7"
                        aria-label="Save team name">
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
                        aria-label="Cancel editing">
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
                  <CardTitle className="truncate text-base capitalize">{team.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {team.members.length}/{MAX_MEMBERS_PER_TEAM}
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
                          aria-label="Rename team">
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
                          aria-label="Delete team">
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
          <Separator />
          <CardContent className="space-y-1.5 px-2 pt-2">
            {team.members.length ? (
              <ul className="space-y-1.5">
                {team.members.map(pokemon => (
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
                <p className="text-muted-foreground text-xs font-medium">No Pokémon in this team</p>
                <p className="text-muted-foreground text-[10px]">
                  Drag Pokémon here or click the + button to add
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="px-3 py-1.5">
            {team.members.length > 0 ? (
              <TeamAnalysis analysis={analysis} />
            ) : (
              <div className="text-muted-foreground w-full text-center text-xs italic">
                Add at least one Pokémon to see team analysis.
              </div>
            )}
          </CardFooter>
        </Card>
      </ScrollArea>
    </>
  );
};

function TeamAnalysis({analysis}: {analysis: TeamAnalysis}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="w-full"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.3}}>
      <div
        className="mb-1 flex cursor-pointer items-center justify-between"
        onClick={() => setExpanded(!expanded)}
        role="button"
        aria-expanded={expanded}
        aria-label="Toggle team analysis">
        <p className="flex items-center text-xs font-medium">
          <Info className="mr-1 size-3" />
          Team Analysis
        </p>
        <Badge
          variant="secondary"
          className="text-[10px]">
          Score: {analysis.score || "N/A"}
        </Badge>
      </div>

      <AnimatePresence>
        <motion.div
          className="text-muted-foreground bg-muted/40 flex flex-col mb-1 flex-wrap gap-1 rounded-xl border p-2 text-[10px]"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.3}}>
          <TypeSummary
            label="Coverage"
            items={analysis.typeCoverage}
          />
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
        </motion.div>
        {expanded && (
          <motion.div
            className="text-muted-foreground bg-muted/40 space-y-2 rounded-xl border p-2 text-[10px]"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3}}>
            <TeamAnalysisItem
              label="Coverage"
              items={analysis.typeCoverage}
              emptyText="No type coverage"
              icon={
                <svg
                  className="size-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M12 2L2 19h20L12 2z" />
                </svg>
              }
            />
            <TeamAnalysisItem
              label="Weaknesses"
              items={analysis.weaknesses}
              emptyText="No weaknesses"
              icon={
                <svg
                  className="size-3 mr-1 text-destructive"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              }
            />
            <TeamAnalysisItem
              label="Resistances"
              items={analysis.resistances}
              emptyText="No resistances"
              icon={
                <svg
                  className="size-3 mr-1 text-sky-500"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              }
            />
            <TeamAnalysisItem
              label="Immunities"
              items={analysis.immunities}
              emptyText="No immunities"
              icon={
                <svg
                  className="size-3 mr-1 text-green-500"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TypeSummary({
  label,
  items,
  color = "text-primary",
}: {
  label: string;
  items: {type: string; count: number}[];
  color?: string;
}) {
  if (!items.length) return null;
  return (
    <span className={cn("whitespace-nowrap", color)}>
      {label}: {items.length}
    </span>
  );
}

function TeamAnalysisItem({label, items, emptyText, icon}: TeamAnalysisItemProps) {
  return (
    <div>
      <p className="mb-0.5 flex items-center font-medium">
        {icon}
        {label}:
      </p>
      {items.length ? (
        <div className="flex flex-wrap gap-1">
          {items.map(item => (
            <Badge
              key={item.type}
              variant="outline"
              className={cn(
                "px-1.5 py-0 text-[10px] capitalize",
                getPokemonTypeBgClass(item.type)
              )}>
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

const PokemonItem = ({pokemon, teamId, teamName}: PokemonItemProps) => {
  const {removePokemonFromTeam} = usePokemonTeamsStore();
  const [{isDragging}, drag] = useDrag({
    type: ITEM_TYPE,
    item: {type: ITEM_TYPE, pokemon, fromTeamId: teamId} as DragItem,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleRemove = () => {
    removePokemonFromTeam(teamId, pokemon.id);
    toast.success(`${pokemon.name} removed from ${teamName}`, {duration: 2000});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Placeholder for keyboard drag-and-drop (e.g., open dialog to move)
      toast.info(`Keyboard drag not fully implemented. Remove ${pokemon.name} instead?`, {
        duration: 2000,
      });
    }
  };

  return (
    <motion.li
      ref={drag}
      className={cn(
        "flex items-center justify-between gap-1 rounded-md border px-1.5 py-0.5",
        "bg-card transition-all hover:shadow-sm",
        "hover:border-primary/30 cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-50 scale-105 rotate-2 shadow-lg" : ""
      )}
      whileHover={{scale: 1.02}}
      whileTap={{scale: 0.98}}
      tabIndex={0}
      role="button"
      aria-label={`Drag ${pokemon.name} to another team`}
      onKeyDown={handleKeyDown}>
      <div className="flex min-w-0 items-center gap-1">
        <GripVertical
          className="text-muted-foreground size-3 flex-shrink-0"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium capitalize">{pokemon.name}</p>
          <p className="text-muted-foreground text-[10px]">
            #{String(pokemon.id).padStart(3, "0")}
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-1">
        <div className="flex gap-0.5">
          {pokemon.types.map(type => (
            <Badge
              key={type}
              variant="outline"
              className={cn("px-1 py-0 text-[10px] capitalize", getPokemonTypeBgClass(type))}>
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
                aria-label={`Remove ${pokemon.name} from team`}>
                <Trash2 className="text-destructive size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove from team</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.li>
  );
};

export const TeamCardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{opacity: 0.5}}
      animate={{opacity: 1}}
      transition={{duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut"}}
      aria-hidden="true">
      <ScrollArea className="h-[30rem]">
        <Card className="rounded-xl shadow-md">
          <CardHeader className="flex-row items-center justify-between gap-1 p-2 px-3">
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-1">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5 px-2 pt-2">
            <ul className="space-y-1.5">
              {Array.from({length: 3}).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-1 rounded-md border px-1.5 py-0.5">
                  <div className="flex min-w-0 items-center gap-1">
                    <Skeleton className="h-3 w-3" />
                    <div className="min-w-0">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="mt-1 h-3 w-12" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className="px-1 py-0">
                      <Skeleton className="h-3 w-12" />
                    </Badge>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="px-3 py-1.5">
            <Skeleton className="h-4 w-full" />
          </CardFooter>
        </Card>
      </ScrollArea>
    </motion.div>
  );
};
