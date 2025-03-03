"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getMaxStat, getTypeColor, POKEMON_IMAGE_BASE_URL } from "@/constants";
import { cn } from "@/lib/utils";
import { TeamSelectionPopup } from "./team-selection-popup";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  generation: string;
  stats: { stat: string; value: number }[];
}

interface PokemonCardProps {
  pokemon: Pokemon;
  pageIndex: number;
  onAddToTeam?: (pokemon: Pokemon) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  pageIndex,
  onAddToTeam,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddToTeam = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation

    // Open the popup for team selection
    setIsPopupOpen(true);

    if (onAddToTeam) {
      onAddToTeam(pokemon);
    }
  };

  return (
    <>
      <Card className="group h-full overflow-hidden px-2 transition-all hover:shadow-md">
        <Link href={`/pokemon/${pokemon.name}`} className="block h-full">
          <CardHeader className="p-3 pb-2 text-center">
            <div className="relative mx-auto mb-1 size-24">
              <Image
                src={`${POKEMON_IMAGE_BASE_URL}/${pokemon.id}.png`}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 30vw, 96px"
                priority={pageIndex === 0}
                className="object-contain drop-shadow-md transition-transform group-hover:scale-105"
                unoptimized
              />
            </div>
            <div className="mb-1.5 flex items-center justify-between">
              <CardTitle className="text-base font-semibold capitalize">
                {pokemon.name}
              </CardTitle>
              <Badge variant="outline" className="h-5 px-1.5 font-mono text-xs">
                #{pokemon.id.toString().padStart(3, "0")}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {pokemon.types.map((type) => (
                <Badge
                  key={type}
                  className={cn(
                    "px-2 py-0.5 text-xs font-medium capitalize",
                    getTypeColor(type)
                  )}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <Separator className="mx-auto w-11/12" />

          <CardContent className="p-3 pt-3">
            {/* Generation details */}
            <div className="text-muted-foreground text-xs">
              <span className="font-medium">Generation:</span>{" "}
              {pokemon.generation.replace("-", " ").toUpperCase()}
            </div>

            {/* Abilities details */}
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Abilities</h4>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {pokemon.abilities.map((ability) => (
                  <Badge
                    key={ability}
                    variant="secondary"
                    className="max-w-full truncate px-1.5 py-0 text-xs capitalize"
                  >
                    {ability.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats details */}
            <div className="mt-3">
              <h4 className="mb-1 text-xs font-medium">Base Stats</h4>
              <div className="space-y-1.5">
                {pokemon.stats.map((stat) => {
                  const maxValue = getMaxStat(stat.stat);
                  const percentage = (stat.value / maxValue) * 100;
                  const progressColor =
                    percentage > 70
                      ? "bg-green-500"
                      : percentage > 40
                        ? "bg-amber-500"
                        : "bg-red-500";

                  return (
                    <div key={stat.stat} className="space-y-0.5">
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span className="capitalize">
                          {stat.stat.replace("-", " ")}
                        </span>
                        <span className="font-mono">{stat.value}</span>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-1"
                        color={progressColor}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-full border text-xs hover:opacity-75"
              onClick={handleAddToTeam}
            >
              <PlusCircle className="mr-1 size-3.5" />
              Add to Team
            </Button>
          </CardFooter>
        </Link>
      </Card>

      {/* Team Selection Popup */}
      <TeamSelectionPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        pokemon={{
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types,
        }}
      />
    </>
  );
};
