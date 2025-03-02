import React, { useCallback, useMemo } from "react";
import { RefreshCw } from "lucide-react";

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
import { MultiSelect } from "@/components/multi-select";
import { POKEMON_BASE_STATS } from "@/constants";
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

export interface StatFilter {
  stat: string;
  min?: number;
  max?: number;
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
  setIsLoading = () => {},
}) => {
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

  const resetFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setFilterState({
        search: "",
        types: [],
        abilities: [],
        generation: null,
        stats: DEFAULT_STATS,
      });
      setIsLoading(false);
    }, 300);
  };

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
            disabled={isLoading}
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
              id="multi-select-types"
              options={typeOptions}
              onValueChange={(values) => updateFilter("types", values)}
              value={filterState.types}
              placeholder="Select types..."
              animation={0.5}
              maxCount={3}
              disabled={isLoading}
            />
            {filterState.types.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {filterState.types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
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
              id="multi-select-abilities"
              options={abilityOptions}
              onValueChange={(values) => updateFilter("abilities", values)}
              value={filterState.abilities}
              placeholder="Select abilities..."
              animation={0.5}
              maxCount={3}
              disabled={isLoading}
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
            const statFilter = filterState?.stats?.find((s) => s.stat === key);
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
                  disabled={isLoading}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="px-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Pokemon Filters</CardTitle>
            <CardDescription>Fine-tune your Pokemon search</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={isLoading}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1 text-xs"
          >
            <RefreshCw
              className={`size-3 ${
                isLoading ? "animate-spin" : "group-hover:rotate-90"
              }`}
            />
            {isLoading ? "Resetting..." : "Reset"}
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-4 pt-0">
        <div className="space-y-4">
          <GenerationFilter />
          <TypeFilter />
          <AbilityFilter />
          <StatFilter />
        </div>
      </CardContent>
    </Card>
  );
};
