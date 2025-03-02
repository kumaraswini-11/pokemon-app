"use client";

import React, { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  usePokemonList,
  usePokemonDetails,
  usePokemonTypeEffectiveness,
} from "@/hooks/use-pokemon-queries";
import Image from "next/image";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { PokemonData } from "@/types";
import { getTypeColor, POKEMON_IMAGE_BASE_URL } from "@/constants";
import { cn } from "@/lib/utils";

// Types
interface ComparisonPokemon {
  id: string;
  name: string | null;
}

// Chart Config
const chartConfig = {
  left: { label: "Left Pokemon", color: "hsl(var(--chart-1))" },
  right: { label: "Right Pokemon", color: "hsl(var(--chart-2))" },
} satisfies Record<string, { label: string; color: string }>;

// Utility Components
const PokemonSelector = ({
  side,
  value,
  onChange,
  options,
}: {
  side: "left" | "right";
  value: string;
  onChange: (side: "left" | "right", value: string) => void;
  options: { id: number; name: string }[];
}) => (
  <Select value={value} onValueChange={(val) => onChange(side, val)}>
    <SelectTrigger className="w-40 text-sm">
      <SelectValue
        placeholder={`${side === "left" ? "Left" : "Right"} Pokemon`}
      />
    </SelectTrigger>
    <SelectContent>
      {options.map((pokemon) => (
        <SelectItem key={pokemon.id} value={pokemon.id.toString()}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const AbilitiesDisplay = ({
  abilities,
}: {
  abilities: PokemonData["abilities"];
}) => (
  <div className="text-xs text-gray-600">
    {abilities.map((ability) => (
      <p key={ability.name}>
        {ability.name.charAt(0).toUpperCase() + ability.name.slice(1)}
        {ability.hidden && <span className="ml-1 text-gray-400">(Hidden)</span>}
      </p>
    ))}
  </div>
);

const PokemonPreview = ({
  data,
  isLoading,
  error,
}: {
  data?: PokemonData;
  isLoading: boolean;
  error: any;
}) => (
  <Card className="bg-gray-50 p-4 transition-shadow hover:shadow-md">
    {isLoading ? (
      <div className="flex h-40 items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    ) : error ? (
      <div className="flex h-40 items-center justify-center text-sm text-red-500">
        Error loading Pokemon
      </div>
    ) : data ? (
      <div className="space-y-2 text-center">
        <Image
          src={`${POKEMON_IMAGE_BASE_URL}/${data.id}.png`}
          alt={data.name}
          width={80}
          height={80}
          className="mx-auto"
        />
        <h2 className="text-sm font-semibold text-gray-800">
          {data.name.charAt(0).toUpperCase() + data.name.slice(1)} #{data.id}
        </h2>
        <div className="flex justify-center gap-1">
          {data.types.map((type) => (
            <Badge
              key={type}
              className={cn(getTypeColor(type), "text-xs text-white")}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ))}
        </div>
        <div className="text-xs text-gray-600">
          <p>
            Height: {data.height}m | Weight: {data.weight}kg
          </p>
          <p className="italic">{data.description}</p>
        </div>
        <AbilitiesDisplay abilities={data.abilities} />
      </div>
    ) : (
      <div className="flex h-40 items-center justify-center text-sm text-gray-500">
        Select a Pokemon
      </div>
    )}
  </Card>
);

const StatComparison = ({
  left,
  right,
}: {
  left: PokemonData;
  right: PokemonData;
}) => {
  const data = [
    {
      name: "HP",
      left: left.stats.find((s) => s.stat === "hp")?.value || 0,
      right: right.stats.find((s) => s.stat === "hp")?.value || 0,
    },
    {
      name: "Attack",
      left: left.stats.find((s) => s.stat === "attack")?.value || 0,
      right: right.stats.find((s) => s.stat === "attack")?.value || 0,
    },
    {
      name: "Defense",
      left: left.stats.find((s) => s.stat === "defense")?.value || 0,
      right: right.stats.find((s) => s.stat === "defense")?.value || 0,
    },
    {
      name: "Sp. Atk",
      left: left.stats.find((s) => s.stat === "special-attack")?.value || 0,
      right: right.stats.find((s) => s.stat === "special-attack")?.value || 0,
    },
    {
      name: "Sp. Def",
      left: left.stats.find((s) => s.stat === "special-defense")?.value || 0,
      right: right.stats.find((s) => s.stat === "special-defense")?.value || 0,
    },
    {
      name: "Speed",
      left: left.stats.find((s) => s.stat === "speed")?.value || 0,
      right: right.stats.find((s) => s.stat === "speed")?.value || 0,
    },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 255]} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
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
  typeError,
}: {
  left: PokemonData;
  right: PokemonData;
  typeEffectiveness?: Record<string, any>;
  isTypeLoading: boolean;
  typeError: any;
}) => {
  const calculateEffectiveness = (
    attackerTypes: string[],
    defenderTypes: string[]
  ): number => {
    if (!typeEffectiveness) return 1;
    let total = 1;
    attackerTypes.forEach((atkType) => {
      const typeData = typeEffectiveness[atkType];
      if (!typeData) return;
      defenderTypes.forEach((defType) => {
        if (typeData.double_damage_to.includes(defType)) total *= 2;
        else if (typeData.half_damage_to.includes(defType)) total *= 0.5;
        else if (typeData.no_damage_to.includes(defType)) total *= 0;
      });
    });
    return total;
  };

  if (isTypeLoading)
    return (
      <div className="text-center text-gray-500">Loading type data...</div>
    );
  if (typeError)
    return (
      <div className="text-center text-red-500">Error loading type data</div>
    );

  const leftVsRight = calculateEffectiveness(left.types, right.types);
  const rightVsLeft = calculateEffectiveness(right.types, left.types);
  const effectivenessColor = (value: number) =>
    value > 1 ? "text-green-600" : value < 1 ? "text-red-600" : "text-gray-600";

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">
          {left.name} vs {right.name}
        </h3>
        <p className={cn("text-lg font-bold", effectivenessColor(leftVsRight))}>
          {leftVsRight}x
        </p>
        <div className="flex flex-wrap gap-2">
          {left.types.map((type) => (
            <Badge
              key={type}
              className={cn(getTypeColor(type), "text-xs text-white")}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">
          {right.name} vs {left.name}
        </h3>
        <p className={cn("text-lg font-bold", effectivenessColor(rightVsLeft))}>
          {rightVsLeft}x
        </p>
        <div className="flex flex-wrap gap-2">
          {right.types.map((type) => (
            <Badge
              key={type}
              className={cn(getTypeColor(type), "text-xs text-white")}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

const MovePoolAnalysis = ({
  left,
  right,
}: {
  left: PokemonData;
  right: PokemonData;
}) => (
  <div className="grid grid-cols-2 gap-4">
    {[left, right].map((pokemon) => (
      <div key={pokemon.id} className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>
        <div className="max-h-48 space-y-2 overflow-y-auto px-2">
          {pokemon.moves.map((move) => (
            <Card key={move.name} className="p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  {move.name.charAt(0).toUpperCase() + move.name.slice(1)}
                </span>
                <Badge
                  className={cn(getTypeColor(move.type), "text-xs text-white")}
                >
                  {move.type.charAt(0).toUpperCase() + move.type.slice(1)}
                </Badge>
              </div>
              <div className="text-xs text-gray-600">
                Power: {move.power || "-"} | PP: {move.pp || "-"}
              </div>
            </Card>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Main Component
const PokemonComparison = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<{
    left: ComparisonPokemon;
    right: ComparisonPokemon;
  }>({
    left: { id: "", name: null },
    right: { id: "", name: null },
  });
  const [activeTab, setActiveTab] = useState<"stats" | "types" | "moves">(
    "stats"
  );

  const { data: pokemonListData, isLoading: isListLoading } = usePokemonList({
    limit: 50,
  });
  const {
    data: leftPokemonData,
    isLoading: isLeftLoading,
    error: leftError,
  } = usePokemonDetails(selectedPokemon.left.name || "");
  const {
    data: rightPokemonData,
    isLoading: isRightLoading,
    error: rightError,
  } = usePokemonDetails(selectedPokemon.right.name || "");
  const {
    data: typeEffectiveness,
    isLoading: isTypeLoading,
    error: typeError,
  } = usePokemonTypeEffectiveness();

  const pokemonList =
    pokemonListData?.pages.flatMap((page) => page.results) || [];

  const handlePokemonChange = (side: "left" | "right", pokemonId: string) => {
    const selected = pokemonList.find((p) => p.id.toString() === pokemonId);
    setSelectedPokemon((prev) => ({
      ...prev,
      [side]: { id: pokemonId, name: selected?.name || null },
    }));
  };

  const handleSwapPositions = () => {
    setSelectedPokemon({
      left: selectedPokemon.right,
      right: selectedPokemon.left,
    });
  };

  if (isListLoading)
    return (
      <div className="text-center text-gray-500">Loading Pokemon list...</div>
    );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Pokemon Comparison
      </h1>

      {/* Selection Controls */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <PokemonSelector
          side="left"
          value={selectedPokemon.left.id}
          onChange={handlePokemonChange}
          options={pokemonList}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleSwapPositions}
          aria-label="Swap Pokemon positions"
          className="rounded-full"
        >
          <ArrowLeftRight size={16} />
        </Button>
        <PokemonSelector
          side="right"
          value={selectedPokemon.right.id}
          onChange={handlePokemonChange}
          options={pokemonList}
        />
      </div>

      {/* Pokemon Previews */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PokemonPreview
          data={leftPokemonData}
          isLoading={isLeftLoading}
          error={leftError}
        />
        <PokemonPreview
          data={rightPokemonData}
          isLoading={isRightLoading}
          error={rightError}
        />
      </div>

      {/* Comparison Tabs */}
      {selectedPokemon.left.name &&
        selectedPokemon.right.name &&
        leftPokemonData &&
        rightPokemonData && (
          <Card className="p-4">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as typeof activeTab)}
            >
              <TabsList className="mb-4 grid w-full grid-cols-3">
                <TabsTrigger value="stats" className="text-sm">
                  Stats
                </TabsTrigger>
                <TabsTrigger value="types" className="text-sm">
                  Types
                </TabsTrigger>
                <TabsTrigger value="moves" className="text-sm">
                  Moves
                </TabsTrigger>
              </TabsList>
              <TabsContent value="stats">
                <StatComparison
                  left={leftPokemonData}
                  right={rightPokemonData}
                />
              </TabsContent>
              <TabsContent value="types">
                <TypeEffectivenessComparison
                  left={leftPokemonData}
                  right={rightPokemonData}
                  typeEffectiveness={typeEffectiveness}
                  isTypeLoading={isTypeLoading}
                  typeError={typeError}
                />
              </TabsContent>
              <TabsContent value="moves">
                <MovePoolAnalysis
                  left={leftPokemonData}
                  right={rightPokemonData}
                />
              </TabsContent>
            </Tabs>
          </Card>
        )}
    </div>
  );
};

export default PokemonComparison;
