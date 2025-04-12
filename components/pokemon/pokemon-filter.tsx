"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Info, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "@/components/shared/multi-select";
import { getTypeColor, POKEMON_BASE_STATS } from "@/constants";
import {
  usePokemonGenerations,
  usePokemonTypes,
  usePokemonAbilities,
} from "@/hooks/use-pokemon-queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface StatFilter {
  stat: string;
  min: number;
  max: number;
}

export interface FilterState {
  search: string;
  types: string[];
  abilities: string[];
  generation: string | null;
  stats: StatFilter[];
}

export interface PokemonFiltersProps {
  filterState: FilterState;
  setFilterState: (state: FilterState) => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  className?: string;
}

const DEFAULT_STATS: StatFilter[] = POKEMON_BASE_STATS.map(({ key }) => ({
  stat: key,
  min: 0,
  max: 255,
}));

const FilterSkeleton: React.FC<{ count?: number; height?: string }> = ({
  count = 1,
  height = "h-10",
}) => (
  <div className="space-y-2">
    {Array.from({ length: count }, (_, i) => (
      <Skeleton key={i} className={`${height} w-full`} />
    ))}
  </div>
);

export const PokemonFilters: React.FC<PokemonFiltersProps> = ({
  filterState,
  setFilterState,
  isLoading = false,
  className,
}) => {
  const [isResetting, setIsResetting] = useState(false);

  const defaultFilterState = useMemo(
    () => ({
      search: "",
      types: [],
      abilities: [],
      generation: null,
      stats: DEFAULT_STATS,
    }),
    []
  );

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilterState({ ...filterState, [key]: value });
    },
    [filterState, setFilterState]
  );

  const updateStatRange = useCallback(
    (stat: string, values: number[]) => {
      const [min, max] = values;
      setFilterState({
        ...filterState,
        stats: filterState.stats.map((s) =>
          s.stat === stat ? { ...s, min, max } : s
        ),
      });
    },
    [filterState, setFilterState]
  );

  const resetFilters = useCallback(() => {
    setIsResetting(true);
    setFilterState(defaultFilterState);

    // Small delay to show "Resetting..." state, then re-enable filters
    setTimeout(() => setIsResetting(false), 150);
  }, [setFilterState, defaultFilterState]);

  const GenerationFilter: React.FC = () => {
    const { data: generations, isLoading, isError } = usePokemonGenerations();
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Generation</Label>
        {isLoading ? (
          <FilterSkeleton />
        ) : isError ? (
          <p className="text-destructive text-sm">Error loading generations</p>
        ) : (
          <Select
            value={filterState.generation || ""}
            onValueChange={(value) => updateFilter("generation", value || null)}
            disabled={isLoading || isResetting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Generations" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="">All Generations</SelectItem> */}
              {generations?.map((gen) => (
                <SelectItem key={gen} value={gen}>
                  {gen.replace("-", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  const TypeFilter: React.FC = () => {
    const { data: types, isLoading, isError } = usePokemonTypes();
    const typeOptions = useMemo(
      () =>
        types?.map((type) => ({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: type,
        })) || [],
      [types]
    );
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Types</Label>
        {isLoading ? (
          <FilterSkeleton />
        ) : isError ? (
          <p className="text-destructive text-sm">Error loading types</p>
        ) : (
          <>
            <MultiSelect
              options={typeOptions}
              onValueChange={(values) => updateFilter("types", values)}
              defaultValue={filterState.types}
              placeholder="Select types..."
              disabled={isLoading || isResetting}
            />
            {filterState.types.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {filterState.types.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className={cn(getTypeColor(type), "text-xs")}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const AbilityFilter: React.FC = () => {
    const { data: abilities, isLoading, isError } = usePokemonAbilities();
    const abilityOptions = useMemo(
      () =>
        abilities?.map((ability) => ({
          label: ability
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          value: ability,
        })) || [],
      [abilities]
    );
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Abilities</Label>
        {isLoading ? (
          <FilterSkeleton />
        ) : isError ? (
          <p className="text-destructive text-sm">Error loading abilities</p>
        ) : (
          <>
            <MultiSelect
              options={abilityOptions}
              onValueChange={(values) => updateFilter("abilities", values)}
              defaultValue={filterState.abilities}
              placeholder="Select abilities..."
              disabled={isLoading || isResetting}
            />
            {filterState.abilities.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {filterState.abilities.map((ability) => (
                  <Badge key={ability} variant="secondary" className="text-xs">
                    {ability
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const StatFilter: React.FC = () => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Base Stats</Label>
      <Card className="border-0 p-0 shadow-none">
        <CardContent className="bg-muted/40 space-y-4 rounded-lg p-3">
          {POKEMON_BASE_STATS.map(({ key, label, icon: Icon, color }) => {
            const statFilter = filterState.stats.find((s) => s.stat === key);
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-xs capitalize">{label}</span>
                  </div>
                  <Badge variant="outline" className="h-5 font-mono text-xs">
                    {statFilter?.min ?? 0}-{statFilter?.max ?? 255}
                  </Badge>
                </div>
                <Slider
                  value={[statFilter?.min ?? 0]}
                  min={0}
                  max={255}
                  step={1}
                  onValueChange={(values) => updateStatRange(key, values)}
                  disabled={isLoading || isResetting}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Card className={cn("rounded-m w-full min-w-[22rem]", className)}>
      <CardHeader className="px-4 py-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="flex items-center justify-start gap-1.5 text-lg">
              <span>Pokemon Filters</span>

              {/* Tooltip  */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="text-muted-foreground mt-1 size-3.5 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      We currently only support filtering on desktop. Mobile
                      filtering coming soon!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Fine-tune your Pokemon search</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={isLoading || isResetting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1 text-xs"
          >
            <RefreshCw
              className={`size-3 ${isResetting ? "animate-spin" : "group-hover:rotate-90"}`}
            />
            {isResetting ? "Resetting..." : "Reset"}
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-4 py-0">
        <div className="space-y-2.5">
          <GenerationFilter />
          <TypeFilter />
          <AbilityFilter />
          <StatFilter />
        </div>
      </CardContent>
    </Card>
  );
};
