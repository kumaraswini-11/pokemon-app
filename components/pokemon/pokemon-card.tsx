"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { getMaxStat, getTypeColor, POKEMON_IMAGE_BASE_URL } from "@/constants";

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
  pageIndex: number; // For image priority on first page
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  pageIndex,
}) => {
  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      className="hover:ring-primary/10 block hover:shadow-lg hover:ring-1"
    >
      <Card className="h-full overflow-hidden transition-all">
        <CardHeader className="space-y-3 p-4 pb-2 text-center">
          <div className="relative mx-auto size-32">
            <Image
              src={`${POKEMON_IMAGE_BASE_URL}/${pokemon.id}.png`}
              alt={pokemon.name}
              fill
              sizes="(max-width: 768px) 30vw, 128px"
              priority={pageIndex === 0} // Prioritize images on first page
              className="object-contain drop-shadow-md"
              unoptimized
            />
          </div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800 capitalize dark:text-white">
              {pokemon.name}
            </CardTitle>
            <Badge
              variant="outline"
              className="h-6 px-2 font-mono text-xs text-gray-600 dark:text-gray-300"
            >
              #{pokemon.id.toString().padStart(3, "0")}
            </Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                className={`capitalize ${getTypeColor(type)} px-2 py-0.5 text-xs font-medium`}
              >
                {type}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Generation:</span>{" "}
            {pokemon.generation.replace("-", " ").toUpperCase()}
          </div>

          <div className="mt-3">
            <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Abilities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {pokemon.abilities.map((ability) => (
                <Badge
                  key={ability}
                  variant="secondary"
                  className="max-w-[120px] truncate px-2 py-0.5 text-xs text-gray-700 capitalize dark:text-gray-200"
                >
                  {ability.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Base Stats
            </h4>
            <div className="space-y-2">
              {pokemon.stats.map((stat) => {
                const maxValue = getMaxStat(stat.stat);
                const percentage = (stat.value / maxValue) * 100;
                return (
                  <div key={stat.stat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span className="capitalize">
                        {stat.stat.replace("-", " ")}
                      </span>
                      <span className="font-mono">{stat.value}</span>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-1.5"
                      color={
                        percentage > 70
                          ? "bg-green-500"
                          : percentage > 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
