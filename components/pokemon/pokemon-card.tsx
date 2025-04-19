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

export const PokemonCard: React.FC<PokemonCardProps> = React.memo(({pokemon, pageIndex}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToTeamClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event from bubbling to card
    setIsDialogOpen(true);
  };

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="block">
      <Card
        className="relative overflow-hidden rounded-lg shadow-md py-0 gap-0"
        role="article"
        aria-label={`View details for ${pokemon.name}`}>
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
                placeholder="blur"
                blurDataURL="/placeholder.png"
              />
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
              <div className="flex flex-wrap  gap-2">
                {pokemon.types.map(type => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className={cn(
                      getPokemonTypeBgClass(type),
                      "text-xs capitalize  rounded-full shadow-sm"
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
                      className="text-xs capitalize px-2 py-1 rounded-md">
                      {ability
                        .split("-")
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

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
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="mt-4 w-full text-xs"
            onClick={handleAddToTeamClick}
            aria-label={`Add ${pokemon.name} to team`}>
            <CirclePlus className="size-4" />
            Add to Team
          </Button>

          <TeamSelectionPopup
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            pokemon={{id: pokemon.id, name: pokemon.name, types: pokemon.types}}
          />
        </CardContent>
      </Card>
    </Link>
  );
});

PokemonCard.displayName = "PokemonCard";
