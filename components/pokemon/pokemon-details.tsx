"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useMemo, useState} from "react";

import {
  ArrowRight,
  ChevronRight,
  // ArrowRight,
  // ChevronRight,
  Download,
  Heart,
  InfoIcon,
  PlusCircle,
  Share2,
} from "lucide-react";
import {motion} from "motion/react";
import {toast} from "sonner";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {POKEMON_BASE_STATS, POKEMON_IMAGE_BASE_URL, getPokemonTypeBgClass} from "@/constants";
import {usePokemonDetails} from "@/hooks/use-pokemon-queries";
import {cn, formatPokemonId} from "@/lib/utils";
import {PokemonInTeam} from "@/types/pokemon";

import {PokemonDetailsSkeleton} from "./pokemon-details-skeleton";
import {TeamSelectionPopup} from "./team-selection-popup";

interface PokemonDetailsProps {
  id: string;
}

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({id}) => {
  const {data, isLoading, isError} = usePokemonDetails(id);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  const totalStats = useMemo(() => {
    if (!data) return 0;
    return data.stats.reduce((sum, stat) => sum + stat.value, 0);
  }, [data]);

  const pokemonForTeam = useMemo<PokemonInTeam | null>(() => {
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      types: data.types,
      abilities: data.abilities.map(a => a.name),
      stats: data.stats,
      generation: data.generation,
    };
  }, [data]);

  if (isLoading) {
    return <PokemonDetailsSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card className="container mx-auto max-w-5xl rounded-xl p-6 text-center">
        <CardContent>
          <InfoIcon className="text-destructive mx-auto mb-2 h-8 w-8" />
          <p className="text-destructive font-medium">Failed to load Pokémon details.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button asChild>
              <Link href="/pokedex">Back to Pokédex</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      className="container mx-auto max-w-5xl px-2 py-4"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}>
      {/* Team Selection Popup */}
      <TeamSelectionPopup
        isOpen={isTeamDialogOpen}
        onClose={() => setIsTeamDialogOpen(false)}
        pokemon={pokemonForTeam}
      />

      {/* Header Section */}
      <Card className="mb-2 overflow-hidden rounded-xl shadow-lg py-0">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image column */}
            <motion.div
              className={cn(
                "relative flex items-center justify-center p-6 md:w-1/3",
                getPokemonTypeBgClass(data.types[0]) // Gradient based on primary type
              )}
              initial={{scale: 0.9, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{duration: 0.6, ease: "easeOut"}}>
              <motion.div
                className="bg-background/20 relative h-56 w-56 overflow-hidden rounded-full p-4 shadow-md"
                initial={{rotate: -10, scale: 0.8}}
                animate={{rotate: 0, scale: 1}}
                transition={{duration: 0.8, delay: 0.2}}>
                <Image
                  src={`${POKEMON_IMAGE_BASE_URL}/${data.id}.png`}
                  alt={data.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 224px"
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </motion.div>
              <Badge
                variant="outline"
                className="bg-background/70 absolute top-4 right-4 text-xs capitalize backdrop-blur-sm">
                {data!.generation!.replace("-", " ")}
              </Badge>
            </motion.div>

            {/* Info column */}
            <div className="flex-1 p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <motion.div
                    className="mb-2 flex items-center gap-2"
                    initial={{x: -20, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{duration: 0.5, delay: 0.3}}>
                    <h1 className="text-3xl text-primary font-bold capitalize">{data.name}</h1>
                    <span className="text-muted-foreground font-mono text-xl">
                      #{formatPokemonId(data.id)}
                    </span>
                  </motion.div>

                  <motion.div
                    className="mb-4 flex flex-wrap gap-2"
                    initial={{y: 10, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.5, delay: 0.4}}>
                    {data.types.map(type => (
                      <motion.div
                        key={type}
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.95}}>
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-3 py-1 text-sm font-medium capitalize",
                            getPokemonTypeBgClass(type)
                          )}>
                          {type}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-2"
                  initial={{y: 10, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{duration: 0.5, delay: 0.5}}>
                  <motion.div
                    whileHover={{scale: 1.2}}
                    whileTap={{scale: 0.9}}>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Add to favorites"
                      onClick={() => toast.info("Favorites coming soon!")}>
                      <Heart className="size-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{scale: 1.2}}
                    whileTap={{scale: 0.9}}>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Share Pokémon"
                      onClick={() => toast.info("Sharing coming soon!")}>
                      <Share2 className="size-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{scale: 1.2}}
                    whileTap={{scale: 0.9}}>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Download Pokémon data"
                      onClick={() => toast.info("Download coming soon!")}>
                      <Download className="size-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{scale: 1.2}}
                    whileTap={{scale: 0.9}}>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Add to team"
                      onClick={() => setIsTeamDialogOpen(true)}>
                      <PlusCircle className="size-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>

              <motion.p
                className="text-sm text-muted-foreground md:text-base"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5, delay: 0.6}}>
                {data.description}
              </motion.p>

              <motion.div
                className="my-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5, delay: 0.7}}>
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
                  <span>N/A</span> {/* Replace with data.baseExperience if available */}
                </div>
              </motion.div>

              <Separator className="my-2" />

              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5, delay: 0.8}}>
                <h3 className="mb-2 text-sm  text-muted-foreground font-medium">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {data.abilities.map(ability => (
                    <motion.div
                      key={ability.name}
                      whileHover={{scale: 1.1}}
                      whileTap={{scale: 0.95}}>
                      <Badge
                        variant={ability.hidden ? "outline" : "secondary"}
                        className="max-w-full truncate px-3 py-1 text-xs capitalize">
                        {ability.name.replace("-", " ")} {ability.hidden && "(Hidden)"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs
        defaultValue="stats"
        className="w-full">
        <TabsList className="mb-5 md:mb-0 grid w-full grid-cols-2 rounded-xl bg-muted/40 p-1 md:grid-cols-4">
          {["stats", "evolution", "moves", "abilities"].map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-lg text-sm capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Stats Tab */}
        <TabsContent
          value="stats"
          className="mt-0">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Base Stats</CardTitle>
                <CardDescription>
                  Individual values determining {data.name}&apos;s strengths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.stats.map((stat, index) => {
                    const maxValue = 255;
                    const percentage = (stat.value / maxValue) * 100;
                    let progressColor = "bg-red-500 dark:bg-red-600";
                    if (percentage > 70) {
                      progressColor = "bg-green-500 dark:bg-green-600";
                    } else if (percentage > 40) {
                      progressColor = "bg-amber-500 dark:bg-amber-600";
                    }

                    const baseStat = POKEMON_BASE_STATS.find(s => s.key === stat.stat);

                    return (
                      <motion.div
                        key={stat.stat}
                        className="space-y-1"
                        initial={{width: 0}}
                        animate={{width: "100%"}}
                        transition={{duration: 0.5, delay: index * 0.1}}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {baseStat && (
                              <baseStat.icon className={cn("size-4", baseStat.colorClass)} />
                            )}
                            <span className="text-muted-foreground text-sm capitalize">
                              {stat.stat.replace("-", " ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pr-1">
                            <span className="w-8 text-right font-mono text-sm font-medium">
                              {stat.value}
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={percentage}
                          className={cn("h-2", progressColor)}
                          aria-label={`${stat.stat}: ${stat.value}`}
                        />
                      </motion.div>
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
          </motion.div>
        </TabsContent>

        {/* Evolution Tab */}
        <TabsContent
          value="evolution"
          className="mt-0">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Evolution Chain</CardTitle>
                <CardDescription>How {data.name} evolves over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                  {data?.evolution?.map((evo: any, index: number) => (
                    <React.Fragment key={evo.id}>
                      {index > 0 && (
                        <motion.div
                          className="flex flex-col items-center py-2"
                          initial={{opacity: 0}}
                          animate={{opacity: 1}}
                          transition={{duration: 0.5, delay: index * 0.2}}>
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
                        </motion.div>
                      )}
                      <motion.div
                        className={cn(
                          "flex-1 rounded-lg p-3 text-center transition-all",
                          evo.id === data.id
                            ? "border-primary bg-primary/5 border shadow-sm"
                            : "bg-muted hover:bg-muted/80"
                        )}
                        initial={{scale: 0.8, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{duration: 0.5, delay: index * 0.2}}
                        whileHover={{scale: 1.05}}>
                        <div className="bg-background/50 relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full transition-transform">
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
                          #{formatPokemonId(evo.id)}
                        </div>
                      </motion.div>
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Moves Tab */}
        <TabsContent
          value="moves"
          className="mt-0">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Moves</CardTitle>
                <CardDescription>
                  Techniques {data.name} can learn through leveling up
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px] w-full rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-background/95 sticky top-0 z-10 backdrop-blur-sm">
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
                      {data.moves.map((move, index) => (
                        <motion.tr
                          key={move.name}
                          className="border-b transition-colors last:border-0 hover:bg-muted/50"
                          initial={{opacity: 0, y: 10}}
                          animate={{opacity: 1, y: 0}}
                          transition={{duration: 0.3, delay: index * 0.05}}>
                          <td className="px-3 py-1.5 capitalize">{move.name.replace("-", " ")}</td>
                          <td className="px-3 py-1.5">
                            <Badge
                              variant="outline"
                              className={cn(
                                "px-1.5 py-0.5 text-xs",
                                getPokemonTypeBgClass(move.type)
                              )}>
                              {move.type}
                            </Badge>
                          </td>
                          <td className="px-3 py-1.5">
                            <Badge
                              className={cn(
                                "px-1.5 py-0.5 text-xs text-white",
                                move.name === "physical"
                                  ? "bg-red-500"
                                  : move.name === "special"
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                              )}>
                              {move.name}
                            </Badge>
                          </td>
                          <td className="px-3 py-1.5 text-right">{move.power ?? "—"}</td>
                          <td className="px-3 py-1.5 text-right">{move.type ?? "—"}</td>
                          <td className="px-3 py-1.5 text-right">{move.pp ?? "—"}</td>
                          <td className="px-3 py-1.5 text-right">{move.level ?? "—"}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Detailed Abilities Tab */}
        <TabsContent
          value="abilities"
          className="mt-0">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">Detailed Abilities</CardTitle>
                <CardDescription>
                  Special traits and effects of {data.name}&apos;s abilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.abilities.map((ability, index) => (
                    <motion.div
                      key={ability.name}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{duration: 0.5, delay: index * 0.2}}>
                      <Card className="overflow-hidden rounded-xl">
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
                        {/* <CardContent className="px-4 py-0">
                          <p className="text-sm">{ability.description}</p>
                        </CardContent> */}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
