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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_COLORS,
  POKEMON_IMAGE_BASE_URL,
  getTypeColor,
  getMaxStat,
  POKEMON_BASE_STATS,
} from "@/constants";

interface PokemonDetailsProps {
  name: string;
}

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
          <Skeleton className="h-64 w-64 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <Skeleton className="mt-6 h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="container mx-auto max-w-5xl p-6 text-center">
        <p className="text-destructive">
          Failed to load Pokemon details. Please try again.
        </p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="bg-muted relative h-64 w-64 overflow-hidden rounded-lg p-4 shadow-md transition-all hover:shadow-lg">
              <Image
                src={`${POKEMON_IMAGE_BASE_URL}/${data.id}.png`}
                alt={data.name}
                fill
                sizes="(max-width: 768px) 50vw, 256px"
                className="object-contain drop-shadow-lg"
                priority
              />
              <Badge variant="outline" className="absolute top-4 left-4">
                {data.generation.replace("-", " ").toUpperCase()}
              </Badge>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold capitalize">{data.name}</h1>
                <span className="text-muted-foreground text-xl">
                  #{data.id.toString().padStart(3, "0")}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.types.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className={cn(
                      "px-3 py-1 text-sm font-medium capitalize",
                      getTypeColor(type)
                    )}
                  >
                    {type}
                  </Badge>
                ))}
              </div>

              <div>
                <p>{data.description}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {data.height} m • {data.weight} kg
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <span className="text-muted-foreground font-medium">
                    Height:
                  </span>{" "}
                  {data.height} m
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">
                    Weight:
                  </span>{" "}
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
                <h3 className="mb-2 font-semibold">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {data.abilities.map((ability) => (
                    <Badge
                      key={ability.name}
                      variant={ability.hidden ? "outline" : "secondary"}
                      className="max-w-[150px] truncate px-3 py-1 text-sm capitalize"
                    >
                      {ability.name.replace("-", " ")}{" "}
                      {ability.hidden && "(Hidden)"}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                {data.stats.map((stat) => {
                  const percentage = (stat.value / getMaxStat(stat.stat)) * 100;
                  let progressColor = "bg-red-500 dark:bg-red-600";

                  if (percentage > 70) {
                    progressColor = "bg-green-500 dark:bg-green-600";
                  } else if (percentage > 40) {
                    progressColor = "bg-amber-500 dark:bg-amber-600";
                  }

                  // Only to show the icon
                  const baseStat = POKEMON_BASE_STATS.find(
                    (s) => s.key === stat.stat
                  );

                  return (
                    <div key={stat.stat} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start gap-1">
                          {baseStat && (
                            <baseStat.icon
                              className={`${baseStat.color} size-4`}
                            />
                          )}
                          <span className="text-muted-foreground text-sm capitalize">
                            {stat.stat.replace("-", " ")}
                          </span>
                        </div>
                        <span className="font-mono text-sm">{stat.value}</span>
                      </div>
                      <Progress
                        value={percentage}
                        className={cn("h-2", progressColor)}
                      />
                    </div>
                  );
                })}
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
                      className={cn(
                        "rounded-lg p-3 text-center transition-all",
                        evo.id === data.id
                          ? "border-primary bg-primary/5 border shadow-md"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      <div className="bg-background/50 relative mx-auto mb-2 h-24 w-24 overflow-hidden rounded-full transition-transform hover:scale-105">
                        <Image
                          src={evo.image}
                          alt={evo.name}
                          fill
                          sizes="96px"
                          className="object-contain drop-shadow-sm"
                        />
                      </div>
                      <div className="font-medium capitalize">{evo.name}</div>
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
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <div className="p-4">
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
                          className="hover:bg-muted/50 border-b transition-colors last:border-0"
                        >
                          <td className="py-2 capitalize">
                            {move.name.replace("-", " ")}
                          </td>
                          <td className="py-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "px-2 py-0.5 text-xs",
                                getTypeColor(move.type)
                              )}
                            >
                              {move.type}
                            </Badge>
                          </td>
                          <td className="py-2">
                            <Badge
                              className={cn(
                                "px-2 py-0.5 text-xs text-white",
                                CATEGORY_COLORS[move.category]
                              )}
                            >
                              {move.category}
                            </Badge>
                          </td>
                          <td className="py-2 text-right">
                            {move.power ?? "—"}
                          </td>
                          <td className="py-2 text-right">
                            {move.accuracy ?? "—"}
                          </td>
                          <td className="py-2 text-right">{move.pp ?? "—"}</td>
                          <td className="py-2 text-right">
                            {move.level ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  <div
                    key={ability.name}
                    className="hover:bg-muted rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold capitalize">
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
