"use client";

import Image from "next/image";
import React, {useMemo} from "react";

import {ArrowRight, ChevronRight, Download, Heart, InfoIcon, Share2} from "lucide-react";
import {toast} from "sonner";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  CATEGORY_COLORS,
  POKEMON_BASE_STATS,
  POKEMON_IMAGE_BASE_URL,
  getMaxStat,
  getTypeColor,
} from "@/constants";
import {usePokemonDetails} from "@/hooks/use-pokemon-queries";
import {cn} from "@/lib/utils";

import {PokemonDetailsSkeleton} from "./pokemon-details-skeleton";

interface PokemonDetailsProps {
  name: string;
}

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({name}) => {
  const {data, isLoading, isError} = usePokemonDetails(name);

  const totalStats = useMemo(() => {
    if (!data) return 0;
    return data.stats.reduce((sum, stat) => sum + stat.value, 0);
  }, [data]);

  if (isLoading) {
    return <PokemonDetailsSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card className="container mx-auto max-w-5xl p-6 text-center">
        <CardContent>
          <InfoIcon className="text-destructive mx-auto mb-2 h-8 w-8" />
          <p className="text-destructive font-medium">
            Failed to load Pokemon details. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-2 py-4">
      {/* Header Section */}
      <Card className="mb-6 overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image column */}
            <div className="bg-muted/50 relative flex items-center justify-center p-6 md:w-1/3">
              <div className="bg-background/20 relative h-56 w-56 overflow-hidden rounded-full p-4 shadow-md">
                <Image
                  src={`${POKEMON_IMAGE_BASE_URL}/${data.id}.png`}
                  alt={data.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 224px"
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
              <Badge
                variant="outline"
                className="bg-background/70 absolute top-4 right-4 backdrop-blur-sm">
                {data.generation.replace("-", " ").toUpperCase()}
              </Badge>
            </div>

            {/* Info column */}
            <div className="flex-1 p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <h1 className="text-3xl font-bold capitalize">{data.name}</h1>
                    <span className="text-muted-foreground font-mono text-xl">
                      #{data.id.toString().padStart(3, "0")}
                    </span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {data.types.map(type => (
                      <Badge
                        key={type}
                        variant="outline"
                        className={cn(
                          "px-3 py-1 text-sm font-medium capitalize",
                          getTypeColor(type)
                        )}>
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      toast("🚀 Coming Soon!", {
                        description: "We're working hard to bring this feature to you. Stay tuned!",
                        style: {
                          backgroundColor: "#0a1124",
                          color: "#ffffff",
                          border: "1px solid #0e1629",
                        },
                      });
                    }}>
                    <Heart className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      toast("🚀 Coming Soon!", {
                        description: "We're working hard to bring this feature to you. Stay tuned!",
                        style: {
                          backgroundColor: "#0a1124",
                          color: "#ffffff",
                          border: "1px solid #0e1629",
                        },
                      });
                    }}>
                    <Share2 className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      toast("🚀 Coming Soon!", {
                        description: "We're working hard to bring this feature to you. Stay tuned!",
                        style: {
                          backgroundColor: "#0a1124",
                          color: "#ffffff",
                          border: "1px solid #0e1629",
                        },
                      });
                    }}>
                    <Download className="size-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm md:text-base">{data.description}</p>

              <div className="my-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Height:</span>
                  <span>{data.height} m</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Weight:</span>
                  <span>{data.weight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Base Exp:</span>
                  <span>{data.baseExperience || "N/A"}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="mb-2 text-sm font-medium">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {data.abilities.map(ability => (
                    <Badge
                      key={ability.name}
                      variant={ability.hidden ? "outline" : "secondary"}
                      className="max-w-full truncate px-3 py-1 text-xs capitalize">
                      {ability.name.replace("-", " ")} {ability.hidden && "(Hidden)"}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter className="bg-muted/20 px-6 py-3">
          <Button className="w-full">Add to Team</Button>
        </CardFooter> */}
      </Card>

      {/* Tabs Section */}
      <Tabs
        defaultValue="stats"
        className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
          <TabsTrigger value="moves">Moves</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent
          value="stats"
          className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Base Stats</CardTitle>
              <CardDescription>
                Individual values determining {data.name}&apos;s strengths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.stats.map(stat => {
                  const maxValue = getMaxStat(stat.stat);
                  const percentage = (stat.value / maxValue) * 100;
                  let progressColor = "bg-red-500 dark:bg-red-600";

                  if (percentage > 70) {
                    progressColor = "bg-green-500 dark:bg-green-600";
                  } else if (percentage > 40) {
                    progressColor = "bg-amber-500 dark:bg-amber-600";
                  }

                  // Only to show the icon
                  const baseStat = POKEMON_BASE_STATS.find(s => s.key === stat.stat);

                  return (
                    <div
                      key={stat.stat}
                      className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {baseStat && <baseStat.icon className={`${baseStat.color} size-4`} />}
                          <span className="text-muted-foreground text-sm capitalize">
                            {stat.stat.replace("-", " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pr-1">
                          {/* <span className="text-muted-foreground text-xs">
                            {maxValue}
                          </span> */}
                          <span className="w-8 text-right font-mono text-sm font-medium">
                            {stat.value}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className={cn("h-2", progressColor)}
                      />
                    </div>
                  );
                })}

                <Separator className="my-3" />

                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-mono font-medium">{totalStats}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evolution Tab */}
        <TabsContent
          value="evolution"
          className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Evolution Chain</CardTitle>
              <CardDescription>How {data.name} evolves over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                {data.evolution.map((evo, index) => (
                  <React.Fragment key={evo.id}>
                    {index > 0 && (
                      <div className="flex flex-col items-center py-2">
                        <ArrowRight
                          className="text-muted-foreground hidden md:block"
                          size={20}
                        />
                        <ChevronRight
                          className="text-muted-foreground block md:hidden"
                          size={20}
                        />
                        {evo.trigger && (
                          <span className="text-muted-foreground max-w-24 text-center text-xs">
                            {evo.trigger} {evo.level && `Lv. ${evo.level}`}
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      className={cn(
                        "flex-1 rounded-lg p-3 text-center transition-all",
                        evo.id === data.id
                          ? "border-primary bg-primary/5 border shadow-sm"
                          : "bg-muted hover:bg-muted/80"
                      )}>
                      <div className="bg-background/50 relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full transition-transform hover:scale-105">
                        <Image
                          src={evo.image}
                          alt={evo.name}
                          fill
                          sizes="80px"
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
        <TabsContent
          value="moves"
          className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Moves</CardTitle>
              <CardDescription>
                Techniques {data.name} can learn through leveling up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px] w-full rounded-md border">
                <div className="p-1">
                  <table className="w-full text-sm">
                    <thead className="bg-background/95 sticky top-0 backdrop-blur-sm">
                      <tr className="border-b">
                        <th className="px-3 py-2 text-left font-medium">Name</th>
                        <th className="px-3 py-2 text-left font-medium">Type</th>
                        <th className="px-3 py-2 text-left font-medium">Category</th>
                        <th className="px-3 py-2 text-right font-medium">Power</th>
                        <th className="px-3 py-2 text-right font-medium">Acc</th>
                        <th className="px-3 py-2 text-right font-medium">PP</th>
                        <th className="px-3 py-2 text-right font-medium">Lvl</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.moves.map(move => (
                        <tr
                          key={move.name}
                          className="hover:bg-muted/50 border-b transition-colors last:border-0">
                          <td className="px-3 py-1.5 capitalize">{move.name.replace("-", " ")}</td>
                          <td className="px-3 py-1.5">
                            <Badge
                              variant="outline"
                              className={cn("px-1.5 py-0.5 text-xs", getTypeColor(move.type))}>
                              {move.type}
                            </Badge>
                          </td>
                          <td className="px-3 py-1.5">
                            <Badge
                              className={cn(
                                "px-1.5 py-0.5 text-xs text-white",
                                CATEGORY_COLORS[move.category]
                              )}>
                              {move.category}
                            </Badge>
                          </td>
                          <td className="px-3 py-1.5 text-right">{move.power ?? "—"}</td>
                          <td className="px-3 py-1.5 text-right">{move.accuracy ?? "—"}</td>
                          <td className="px-3 py-1.5 text-right">{move.pp ?? "—"}</td>
                          <td className="px-3 py-1.5 text-right">{move.level ?? "—"}</td>
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
        <TabsContent
          value="abilities"
          className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Detailed Abilities</CardTitle>
              <CardDescription>
                Special traits and effects of {data.name}&apos;s abilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.abilities.map(ability => (
                  <Card
                    key={ability.name}
                    className="overflow-hidden">
                    <CardHeader className="bg-muted/30 px-4 py-2 pt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium capitalize">
                          {ability.name.replace("-", " ")}
                        </h3>
                        {ability.hidden && (
                          <Badge
                            variant="outline"
                            className="text-xs">
                            Hidden
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 py-0">
                      <p className="text-sm">{ability.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
