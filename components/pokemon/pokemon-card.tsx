"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";

import {CirclePlus} from "lucide-react";
import {motion} from "motion/react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {POKEMON_BASE_STATS, POKEMON_IMAGE_BASE_URL, getPokemonTypeBgClass} from "@/constants";
import {cn, formatPokemonId} from "@/lib/utils";
import {PokemonListItem} from "@/types/pokemon";

import {TeamSelectionPopup} from "./team-selection-popup";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  pageIndex: number;
}

export function formatAbility(ability: string): string {
  return ability
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const PokemonCard: React.FC<PokemonCardProps> = ({pokemon, pageIndex}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const {addToComparisonQueue} = usePokemonTeamsStore();

  const handleAddToTeamClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling
    setIsDialogOpen(true);
  };

  return (
    <Card
      className="relative overflow-hidden rounded-lg shadow-md py-0 gap-0"
      role="article"
      aria-label={`Pokémon card for ${pokemon.name}`}>
      <Link
        href={`/pokemon/${pokemon.id}`}
        aria-label={`View ${pokemon.name} details`}>
        <CardHeader className="p-4 pb-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            {/* Pokémon Image */}
            <div className="relative h-32 w-32 self-center sm:self-start">
              <Image
                src={`${POKEMON_IMAGE_BASE_URL}/${pokemon.id}.png`}
                alt={pokemon.name}
                fill
                sizes="128px"
                className="object-contain"
                priority={pageIndex < 20}
                onError={() => (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Image not found</span>
                  </div>
                )}
              />
              <Badge
                variant="outline"
                className="absolute top-2 right-2 capitalize"
                aria-label={`Generation: ${pokemon.generation}`}>
                {pokemon.generation}
              </Badge>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-1">
              {/* Name and ID */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold capitalize tracking-wide">{pokemon.name}</h2>
                <span className="text-base font-mono text-muted-foreground">
                  #{formatPokemonId(pokemon.id)}
                </span>
              </div>

              {/* Types */}
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map(type => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className={cn(
                      getPokemonTypeBgClass(type),
                      "text-xs capitalize rounded-full shadow-sm"
                    )}>
                    {type}
                  </Badge>
                ))}
              </div>

              {/* Abilities */}
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Abilities:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {pokemon.abilities.map(ability => (
                    <Badge
                      key={ability}
                      variant="outline"
                      className="text-xs capitalize px-2 py-1 rounded-md"
                      aria-label={`Ability: ${formatAbility(ability)}`}>
                      {formatAbility(ability)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4 pt-0">
        <div className="mt-4 space-y-2">
          <div className="space-y-2">
            {POKEMON_BASE_STATS.map(({key, label}, index) => {
              const stat = pokemon.stats.find(s => s.stat === key);
              const value = stat?.value ?? 0;
              const percentage = (value / 255) * 100;

              return (
                <motion.div
                  key={key}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: index * 0.1}}
                  className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn("h-1.5 transition-all duration-300 bg-accent")}
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={255}
                    aria-label={`Stat ${label}: ${value}`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex relative gap-2 w-full items-center justify-between mt-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full text-xs"
            onClick={handleAddToTeamClick}
            aria-label={`Add ${pokemon.name} to team`}>
            <CirclePlus className="size-4 mr-1" />
            Add to Team
          </Button>
        </div>
      </CardContent>

      {/* Moved Popup outside Link */}
      <TeamSelectionPopup
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        pokemon={{id: pokemon.id, name: pokemon.name, types: pokemon.types}}
      />
    </Card>
  );
};
