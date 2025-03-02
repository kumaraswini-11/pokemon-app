"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { usePokemonDetails } from "@/hooks/use-pokemon-queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Badge, ChevronRight } from "lucide-react";
import { POKEMON_IMAGE_BASE_URL } from "@/constants";

interface PokemonDetailsProps {
  name: string;
}

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-stone-200 text-stone-800",
  fire: "bg-orange-200 text-orange-800",
  water: "bg-blue-200 text-blue-800",
  electric: "bg-yellow-200 text-yellow-800",
  grass: "bg-green-200 text-green-800",
  ice: "bg-cyan-200 text-cyan-800",
  fighting: "bg-red-200 text-red-800",
  poison: "bg-purple-200 text-purple-800",
  ground: "bg-amber-200 text-amber-800",
  flying: "bg-indigo-200 text-indigo-800",
  psychic: "bg-pink-200 text-pink-800",
  bug: "bg-lime-200 text-lime-800",
  rock: "bg-stone-300 text-stone-800",
  ghost: "bg-violet-200 text-violet-800",
  dragon: "bg-violet-300 text-violet-900",
  dark: "bg-gray-800 text-gray-200",
  steel: "bg-slate-200 text-slate-800",
  fairy: "bg-pink-300 text-pink-900",
};

const CATEGORY_COLORS: Record<string, string> = {
  physical: "bg-red-500",
  special: "bg-blue-500",
  status: "bg-gray-500",
};

const MAX_STATS: Record<string, number> = {
  hp: 255,
  attack: 190,
  defense: 230,
  "special-attack": 194,
  "special-defense": 230,
  speed: 180,
};

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({ name }) => {
  const { data, isLoading, isError } = usePokemonDetails(name);

  const totalStats = useMemo(() => {
    if (!data) return 0;
    return data.stats.reduce((sum, stat) => sum + stat.value, 0);
  }, [data]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex flex-col items-center gap-6 md:flex-row">
          <div className="h-64 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 animate-pulse bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse bg-gray-200" />
              <div className="h-6 w-16 animate-pulse bg-gray-200" />
            </div>
            <div className="h-20 w-full animate-pulse bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="text-red-500 dark:text-red-400">
          Failed to load Pokémon details. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="bg-muted relative h-64 w-64 rounded-lg p-4 shadow-md">
          <Image
            src={`${POKEMON_IMAGE_BASE_URL}/${data.id}.png`}
            alt={data.name}
            fill
            sizes="(max-width: 768px) 50vw, 256px"
            className="object-contain drop-shadow-lg"
            priority
          />
          <Badge className="bg-primary text-primary-foreground absolute top-4 left-4">
            {data.generation.replace("-", " ").toUpperCase()}
          </Badge>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-foreground text-3xl font-bold capitalize">
              {data.name}
            </h1>
            <span className="text-muted-foreground text-xl">
              #{data.id.toString().padStart(3, "0")}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.types.map((type) => (
              <Badge
                key={type}
                className={`${TYPE_COLORS[type]} px-3 py-1 text-sm font-medium`}
              >
                {type}
              </Badge>
            ))}
          </div>

          <div>
            <p className="text-foreground">{data.description}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {data.height} m • {data.weight} kg
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <span className="text-muted-foreground font-medium">Height:</span>{" "}
              {data.height} m
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Weight:</span>{" "}
              {data.weight} kg
            </div>
            <div>
              <span className="text-muted-foreground font-medium">
                Generation:
              </span>{" "}
              {data.generation.replace("-", " ").toUpperCase()}
            </div>
          </div>

          <div>
            <h3 className="text-foreground mb-2 font-semibold">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {data.abilities.map((ability) => (
                <Badge
                  key={ability.name}
                  variant={ability.hidden ? "outline" : "secondary"}
                  className="max-w-[150px] truncate px-3 py-1 text-sm"
                >
                  {ability.name.replace("-", " ")}{" "}
                  {ability.hidden && "(Hidden)"}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
          <TabsTrigger value="moves">Moves</TabsTrigger>
          <TabsTrigger value="abilities">Detailed Abilities</TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
              <CardDescription>
                Individual values determining {data.name}&apos;s strengths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.stats.map((stat) => (
                  <div key={stat.stat} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm capitalize">
                        {stat.stat.replace("-", " ")}
                      </span>
                      <span className="text-foreground font-mono text-sm">
                        {stat.value}
                      </span>
                    </div>
                    <Progress
                      value={(stat.value / MAX_STATS[stat.stat]) * 100}
                      className="h-2"
                      color={
                        stat.value > MAX_STATS[stat.stat] * 0.7
                          ? "bg-green-500"
                          : stat.value > MAX_STATS[stat.stat] * 0.4
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }
                    />
                  </div>
                ))}
                <div className="text-muted-foreground mt-4 text-sm">
                  Total: <span className="font-medium">{totalStats}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evolution Tab */}
        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Evolution Chain</CardTitle>
              <CardDescription>
                How {data.name} evolves over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
                {data.evolution.map((evo, index) => (
                  <React.Fragment key={evo.id}>
                    {index > 0 && (
                      <div className="flex flex-col items-center gap-1">
                        <ArrowRight
                          className="text-muted-foreground hidden md:block"
                          size={24}
                        />
                        <ChevronRight
                          className="text-muted-foreground block md:hidden"
                          size={24}
                        />
                        {evo.trigger && (
                          <span className="text-muted-foreground text-xs">
                            {evo.trigger} {evo.level && `Lv. ${evo.level}`}
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 text-center transition-all ${
                        evo.id === data.id
                          ? "border-primary bg-primary/5 border shadow-md"
                          : "bg-muted"
                      }`}
                    >
                      <div className="bg-background/50 relative mx-auto mb-2 h-24 w-24 rounded-full">
                        <Image
                          src={evo.image}
                          alt={evo.name}
                          fill
                          sizes="96px"
                          className="object-contain drop-shadow-sm"
                        />
                      </div>
                      <div className="text-foreground font-medium capitalize">
                        {evo.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        #{evo.id.toString().padStart(3, "0")}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moves Tab */}
        <TabsContent value="moves">
          <Card>
            <CardHeader>
              <CardTitle>Moves</CardTitle>
              <CardDescription>
                Techniques {data.name} can learn through leveling up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <table className="w-full text-sm">
                  <thead className="bg-background/95 sticky top-0 backdrop-blur-sm">
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Name</th>
                      <th className="py-3 text-left font-medium">Type</th>
                      <th className="py-3 text-left font-medium">Category</th>
                      <th className="py-3 text-right font-medium">Power</th>
                      <th className="py-3 text-right font-medium">Acc</th>
                      <th className="py-3 text-right font-medium">PP</th>
                      <th className="py-3 text-right font-medium">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.moves.map((move) => (
                      <tr
                        key={move.name}
                        className="hover:bg-muted/50 border-b last:border-0"
                      >
                        <td className="py-2 capitalize">
                          {move.name.replace("-", " ")}
                        </td>
                        <td className="py-2">
                          <Badge
                            className={`${TYPE_COLORS[move.type]} px-2 py-0.5 text-xs`}
                          >
                            {move.type}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <Badge
                            className={`${CATEGORY_COLORS[move.category]} px-2 py-0.5 text-xs text-white`}
                          >
                            {move.category}
                          </Badge>
                        </td>
                        <td className="py-2 text-right">{move.power ?? "—"}</td>
                        <td className="py-2 text-right">
                          {move.accuracy ?? "—"}
                        </td>
                        <td className="py-2 text-right">{move.pp ?? "—"}</td>
                        <td className="py-2 text-right">{move.level ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Abilities Tab */}
        <TabsContent value="abilities">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Abilities</CardTitle>
              <CardDescription>
                Special traits and effects of {data.name}&apos;s abilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.abilities.map((ability) => (
                  <div key={ability.name}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground font-semibold capitalize">
                        {ability.name.replace("-", " ")}
                      </h3>
                      {ability.hidden && (
                        <Badge variant="outline" className="text-xs">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {ability.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
