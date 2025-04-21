"use client";

import Image from "next/image";
import {useCallback, useMemo, useState} from "react";

import {AnimatePresence, motion} from "framer-motion";
import {ArrowLeftRight, BarChart2, Check, ChevronsUpDown, Shield, Swords, X} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ChartContainer} from "@/components/ui/chart";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Skeleton} from "@/components/ui/skeleton";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {POKEMON_IMAGE_BASE_URL, getPokemonTypeBgClass} from "@/constants";
import {usePokemonDetails, usePokemonTypeEffectiveness} from "@/hooks/use-pokemon-queries";
import {cn} from "@/lib/utils";
import type {PokemonData, PokemonListItem, TypeEffectivenessData} from "@/types/pokemon";

interface PokemonComparisonProps {
  pokemonList: Pick<PokemonListItem, "id" | "name" | "generation">[];
}

type ComparisonTab = "stats" | "types" | "moves";

const PokemonSelector = ({
  side,
  value,
  onChange,
  options,
  isLoading,
}: {
  side: "left" | "right";
  value: string;
  onChange: (side: "left" | "right", value: string) => void;
  options: Pick<PokemonListItem, "id" | "name" | "generation">[];
  isLoading: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pre-process options for better performance
  const processedOptions = useMemo(() => {
    return options.map(pokemon => ({
      value: pokemon.id.toString(),
      label: pokemon.name,
    }));
  }, [options]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return processedOptions;
    return processedOptions.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [processedOptions, searchQuery]);

  // Find the selected option
  const selectedOption = useMemo(() => {
    return processedOptions.find(option => option.value === value);
  }, [processedOptions, value]);

  return (
    <div className="w-64">
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Popover
          open={open}
          onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              onClick={() => setOpen(!open)}>
              {selectedOption ? (
                <span className="capitalize">{selectedOption.label}</span>
              ) : (
                <span className="text-muted-foreground">
                  Select {side === "left" ? "Left" : "Right"} Pokemon
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-0"
            align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search Pokemon..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-9"
              />
              <CommandList className="max-h-[300px] overflow-auto">
                <CommandEmpty>No Pokemon found.</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.slice(0, 100).map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={currentValue => {
                        onChange(side, currentValue);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className="capitalize">
                      {option.label}
                      {value === option.value && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                  {filteredOptions.length > 100 && (
                    <div className="py-2 px-2 text-xs text-muted-foreground text-center">
                      Showing 100 of {filteredOptions.length} results. Refine your search to see
                      more.
                    </div>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

const PokemonPreview = ({
  pokemon,
  isLoading,
  error,
  side,
  onClear,
}: {
  pokemon?: PokemonData;
  isLoading: boolean;
  error: unknown;
  side: "left" | "right";
  onClear: () => void;
}) => (
  <Card className="bg-muted/40 overflow-hidden py-0 transition-shadow hover:shadow-md rounded-xl">
    <CardHeader className={cn("p-2", getPokemonTypeBgClass(pokemon?.types[0] || "normal"))}>
      <div className="flex items-center justify-between">
        {isLoading ? (
          <Skeleton className="h-6 w-3/4" />
        ) : (
          <h2 className="text-sm font-semibold text-white capitalize">
            {pokemon
              ? `${pokemon.name} #${String(pokemon.id).padStart(3, "0")}`
              : "No Pokemon Selected"}
          </h2>
        )}
        {pokemon && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-white hover:text-white/80 hover:bg-white/10"
            aria-label={`Clear ${side} Pokemon selection`}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-4 text-center">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-20 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      ) : error ? (
        <div className="flex h-32 items-center justify-center text-xs text-destructive">
          Error loading Pokemon
        </div>
      ) : pokemon ? (
        <div className="space-y-2">
          <div className="relative h-20 w-20 mx-auto">
            <Image
              src={`${POKEMON_IMAGE_BASE_URL}/${pokemon.id}.png`}
              alt={pokemon.name}
              fill
              sizes="80px"
              className="object-contain"
              onError={e => {
                // Fallback for missing images
                (e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80";
              }}
            />
          </div>
          <div className="flex justify-center gap-1">
            {pokemon.types.map(type => (
              <Badge
                key={type}
                className={cn(getPokemonTypeBgClass(type), "text-white text-xs capitalize")}>
                {type}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            <p>
              Height: {pokemon.height}m | Weight: {pokemon.weight}kg
            </p>
            {pokemon.abilities.map(ability => (
              <p
                key={ability.name}
                className="capitalize">
                {ability.name}
                {ability.hidden && <span className="ml-1 text-muted-foreground">(Hidden)</span>}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
          Select a Pokemon
        </div>
      )}
    </CardContent>
  </Card>
);

const StatComparison = ({left, right}: {left: PokemonData; right: PokemonData}) => {
  const data = useMemo(
    () => [
      {
        name: "HP",
        left: left.stats.find(s => s.stat === "hp")?.value || 0,
        right: right.stats.find(s => s.stat === "hp")?.value || 0,
      },
      {
        name: "Attack",
        left: left.stats.find(s => s.stat === "attack")?.value || 0,
        right: right.stats.find(s => s.stat === "attack")?.value || 0,
      },
      {
        name: "Defense",
        left: left.stats.find(s => s.stat === "defense")?.value || 0,
        right: right.stats.find(s => s.stat === "defense")?.value || 0,
      },
      {
        name: "Sp. Atk",
        left: left.stats.find(s => s.stat === "special-attack")?.value || 0,
        right: right.stats.find(s => s.stat === "special-attack")?.value || 0,
      },
      {
        name: "Sp. Def",
        left: left.stats.find(s => s.stat === "special-defense")?.value || 0,
        right: right.stats.find(s => s.stat === "special-defense")?.value || 0,
      },
      {
        name: "Speed",
        left: left.stats.find(s => s.stat === "speed")?.value || 0,
        right: right.stats.find(s => s.stat === "speed")?.value || 0,
      },
    ],
    [left, right]
  );

  const config = {
    left: {label: left.name, color: "hsl(var(--chart-1))"},
    right: {label: right.name, color: "hsl(var(--chart-2))"},
  };

  return (
    <ChartContainer
      config={config}
      className="h-[300px]">
      <BarChart
        data={data}
        margin={{top: 10, right: 10, left: 0, bottom: 0}}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="name"
          tick={{fontSize: 12}}
        />
        <YAxis
          domain={[0, 255]}
          tick={{fontSize: 12}}
        />
        <RechartsTooltip contentStyle={{fontSize: "12px"}} />
        <Legend wrapperStyle={{fontSize: "12px"}} />
        <Bar
          dataKey="left"
          name={left.name}
          fill="var(--color-left)"
          barSize={20}
        />
        <Bar
          dataKey="right"
          name={right.name}
          fill="var(--color-right)"
          barSize={20}
        />
      </BarChart>
    </ChartContainer>
  );
};

const TypeEffectivenessComparison = ({
  left,
  right,
  typeEffectiveness,
  isTypeLoading,
  error,
}: {
  left: PokemonData;
  right: PokemonData;
  typeEffectiveness?: TypeEffectivenessData;
  isTypeLoading: boolean;
  error: unknown;
}) => {
  const calculateEffectiveness = useCallback(
    (attackerTypes: string[], defenderTypes: string[]): number => {
      if (!typeEffectiveness) return 1;
      let total = 1;
      attackerTypes.forEach(atkType => {
        const typeData = typeEffectiveness[atkType];
        if (!typeData) return;
        defenderTypes.forEach(defType => {
          if (typeData.double_damage_to.includes(defType)) total *= 2;
          else if (typeData.half_damage_to.includes(defType)) total *= 0.5;
          else if (typeData.no_damage_to.includes(defType)) total *= 0;
        });
      });
      return total;
    },
    [typeEffectiveness]
  );

  const getEffectivenessLabel = (value: number): string => {
    if (value >= 2) return "Super Effective!";
    if (value === 1) return "Normal";
    if (value < 1 && value > 0) return "Resisted";
    return "No Effect";
  };

  const effectivenessColor = (value: number): string =>
    value > 1 ? "text-green-600" : value < 1 ? "text-red-600" : "text-muted-foreground";

  if (isTypeLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive text-xs">Error loading type data</div>;
  }

  const leftVsRight = calculateEffectiveness(left.types, right.types);
  const rightVsLeft = calculateEffectiveness(right.types, left.types);

  return (
    <Card className="bg-muted/40 rounded-xl">
      <CardHeader className="p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Type Effectiveness</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Type effectiveness info">
                  <Shield className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                <p>
                  Damage multipliers stack based on types:
                  <ul className="mt-1 list-disc pl-4">
                    <li>
                      <span className="font-bold text-green-600">2x</span>: Super effective
                    </li>
                    <li>
                      <span className="font-bold text-muted-foreground">1x</span>: Normal
                    </li>
                    <li>
                      <span className="font-bold text-red-600">0.5x</span>: Resisted
                    </li>
                    <li>
                      <span className="font-bold text-muted-foreground">0x</span>: No effect
                    </li>
                  </ul>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-xs font-semibold capitalize">{left.name}</h3>
            <div className="flex gap-1">
              {left.types.map(type => (
                <Badge
                  key={type}
                  className={cn(getPokemonTypeBgClass(type), "text-white text-xs capitalize")}>
                  {type}
                </Badge>
              ))}
            </div>
            <p className={cn("text-sm font-bold", effectivenessColor(leftVsRight))}>
              {leftVsRight}x - {getEffectivenessLabel(leftVsRight)}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-xs font-semibold capitalize">{right.name}</h3>
            <div className="flex gap-1">
              {right.types.map(type => (
                <Badge
                  key={type}
                  className={cn(getPokemonTypeBgClass(type), "text-white text-xs capitalize")}>
                  {type}
                </Badge>
              ))}
            </div>
            <p className={cn("text-sm font-bold", effectivenessColor(rightVsLeft))}>
              {rightVsLeft}x - {getEffectivenessLabel(rightVsLeft)}
            </p>
          </div>
        </div>
        <div className="text-center">
          {leftVsRight > rightVsLeft ? (
            <p className="text-sm font-semibold text-green-600 capitalize">
              {left.name} has the advantage!
            </p>
          ) : rightVsLeft > leftVsRight ? (
            <p className="text-sm font-semibold text-green-600 capitalize">
              {right.name} has the advantage!
            </p>
          ) : (
            <p className="text-sm font-semibold text-muted-foreground">Even matchup!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MovePoolAnalysis = ({left, right}: {left: PokemonData; right: PokemonData}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {[left, right].map(pokemon => (
      <Card
        key={pokemon.id}
        className="bg-muted/40 rounded-xl">
        <CardHeader className="p-2">
          <h3 className="text-xs font-semibold capitalize">{pokemon.name}</h3>
        </CardHeader>
        <CardContent className="max-h-48 overflow-y-auto p-2">
          <div className="space-y-2">
            {pokemon.moves.length > 0 ? (
              pokemon.moves.map(move => (
                <div
                  key={move.name}
                  className="flex items-center justify-between rounded-md border p-2">
                  <span className="text-xs font-medium capitalize">{move.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        getPokemonTypeBgClass(move.type),
                        "text-white text-xs capitalize"
                      )}>
                      {move.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {move.power ?? "-"}/{move.pp ?? "-"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No moves available</p>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export function PokemonComparisonClient({pokemonList}: PokemonComparisonProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<[string, string]>(["", ""]);
  const [activeTab, setActiveTab] = useState<ComparisonTab>("stats");

  const [leftPokemonId, rightPokemonId] = selectedPokemon;

  // Get the Pokemon name from the ID
  const leftPokemonName = useMemo(
    () =>
      leftPokemonId ? pokemonList.find(p => p.id.toString() === leftPokemonId)?.name || "" : "",
    [leftPokemonId, pokemonList]
  );

  const rightPokemonName = useMemo(
    () =>
      rightPokemonId ? pokemonList.find(p => p.id.toString() === rightPokemonId)?.name || "" : "",
    [rightPokemonId, pokemonList]
  );

  // Fetch Pokemon details
  const {
    data: leftPokemonData,
    isLoading: isLeftLoading,
    error: leftError,
  } = usePokemonDetails(leftPokemonName, !!leftPokemonId);

  const {
    data: rightPokemonData,
    isLoading: isRightLoading,
    error: rightError,
  } = usePokemonDetails(rightPokemonName, !!rightPokemonId);

  // Fetch type effectiveness data
  const {
    data: typeEffectiveness,
    isLoading: isTypeLoading,
    error: typeError,
  } = usePokemonTypeEffectiveness();

  // Handlers
  const handlePokemonChange = useCallback((side: "left" | "right", pokemonId: string) => {
    setSelectedPokemon(prev => {
      const newSelection = [...prev] as [string, string];
      newSelection[side === "left" ? 0 : 1] = pokemonId;
      return newSelection;
    });
  }, []);

  const handleSwapPositions = useCallback(() => {
    setSelectedPokemon([selectedPokemon[1], selectedPokemon[0]]);
  }, [selectedPokemon]);

  const handleClearSelection = useCallback((side: "left" | "right") => {
    setSelectedPokemon(prev => {
      const newSelection = [...prev] as [string, string];
      newSelection[side === "left" ? 0 : 1] = "";
      return newSelection;
    });
  }, []);

  const bothPokemonSelected = leftPokemonData && rightPokemonData;

  return (
    <motion.div
      className="container mx-auto max-w-4xl px-4 py-6"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
      aria-live="polite">
      <h1 className="mb-6 text-center text-xl font-bold text-foreground">Pokemon Comparison</h1>

      {/* Selection Controls */}
      <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <PokemonSelector
          side="left"
          value={leftPokemonId}
          onChange={handlePokemonChange}
          options={pokemonList}
          isLoading={false}
        />
        <motion.div
          whileHover={{rotate: 180}}
          transition={{duration: 0.3}}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapPositions}
                  disabled={!leftPokemonId && !rightPokemonId}
                  aria-label="Swap Pokemon positions"
                  className="rounded-full">
                  <ArrowLeftRight size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Swap Pokemon</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
        <PokemonSelector
          side="right"
          value={rightPokemonId}
          onChange={handlePokemonChange}
          options={pokemonList}
          isLoading={false}
        />
      </div>

      {/* Pokemon Previews */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PokemonPreview
          pokemon={leftPokemonData}
          isLoading={isLeftLoading}
          error={leftError}
          side="left"
          onClear={() => handleClearSelection("left")}
        />
        <PokemonPreview
          pokemon={rightPokemonData}
          isLoading={isRightLoading}
          error={rightError}
          side="right"
          onClear={() => handleClearSelection("right")}
        />
      </div>

      {/* Comparison Tabs */}
      {(leftPokemonData || rightPokemonData) && (
        <Card className="rounded-xl shadow-md">
          <Tabs
            value={activeTab}
            onValueChange={val => setActiveTab(val as ComparisonTab)}
            className="p-4">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger
                value="stats"
                className="text-xs"
                aria-label="Compare stats">
                <BarChart2 className="mr-1 size-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger
                value="types"
                className="text-xs"
                aria-label="Compare types">
                <Shield className="mr-1 size-4" />
                Types
              </TabsTrigger>
              <TabsTrigger
                value="moves"
                className="text-xs"
                aria-label="Compare moves">
                <Swords className="mr-1 size-4" />
                Moves
              </TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -20}}
                transition={{duration: 0.3}}>
                <TabsContent value="stats">
                  {bothPokemonSelected ? (
                    <StatComparison
                      left={leftPokemonData}
                      right={rightPokemonData}
                    />
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Select both Pokemon to compare stats
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="types">
                  {bothPokemonSelected ? (
                    <TypeEffectivenessComparison
                      left={leftPokemonData}
                      right={rightPokemonData}
                      typeEffectiveness={typeEffectiveness}
                      isTypeLoading={isTypeLoading}
                      error={typeError}
                    />
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Select both Pokemon to compare types
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="moves">
                  {bothPokemonSelected ? (
                    <MovePoolAnalysis
                      left={leftPokemonData}
                      right={rightPokemonData}
                    />
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Select both Pokemon to compare moves
                    </div>
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </Card>
      )}
    </motion.div>
  );
}
