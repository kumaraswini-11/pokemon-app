"use client";

import React, {useCallback, useState} from "react";

import {RefreshCw} from "lucide-react";
import {motion} from "motion/react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Slider} from "@/components/ui/slider";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {POKEMON_BASE_STATS, getPokemonTypeBgClass} from "@/constants";
import {
  usePokemonAbilities,
  usePokemonGenerations,
  usePokemonTypes,
} from "@/hooks/use-pokemon-queries";
import {cn} from "@/lib/utils";
import {usePokemonFilterStore} from "@/store/filters";
import {SelectOption} from "@/types/pokemon";

import {ComboboxWithOptionalMultiSelect} from "../shared/combobox-with-optional-multi-select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";

export const PokemonFilters: React.FC = () => {
  const {filters, setFilters, resetFilters} = usePokemonFilterStore();
  const [isResetting, setIsResetting] = useState(false);

  const {data: types, isLoading: typesLoading, isError: typesError} = usePokemonTypes();
  const {
    data: generations,
    isLoading: generationsLoading,
    isError: generationsError,
  } = usePokemonGenerations();
  const {
    data: abilities,
    isLoading: abilitiesLoading,
    isError: abilitiesError,
  } = usePokemonAbilities();

  const updateStatRange = useCallback(
    (stat: string, values: number[]) => {
      const [min] = values; // Slider provides single value for min (max is fixed at 255)
      setFilters({
        stats: filters.stats.map(s => (s.stat === stat ? {...s, min} : s)),
      });
    },
    [filters.stats, setFilters]
  );

  const resetFiltersWithDelay = useCallback(() => {
    setIsResetting(true);
    resetFilters();
    setTimeout(() => setIsResetting(false), 150);
  }, [resetFilters]);

  const generationOptions: SelectOption[] =
    generations?.map(gen => ({
      value: gen,
      label: gen.replace("-", " ").toUpperCase(),
    })) || [];

  const typeOptions: SelectOption[] =
    types?.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    })) || [];

  const abilityOptions: SelectOption[] =
    abilities?.map(ability => ({
      value: ability,
      label: ability
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    })) || [];

  const FilterSkeleton: React.FC = () => <Skeleton className="h-10 w-full" />;

  return (
    <Card className="w-full min-w-[22rem] rounded-xl py-4">
      <CardHeader className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-lg">Pokémon Filters</CardTitle>
            <CardDescription>Fine-tune your Pokémon search</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFiltersWithDelay}
            disabled={isResetting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1 text-xs">
            <RefreshCw className={cn("size-3", isResetting && "animate-spin")} />
            {isResetting ? "Resetting..." : "Reset"}
          </Button>
        </div>
      </CardHeader>

      <Separator />
      <CardContent className="px-4">
        <Tabs
          defaultValue="filters"
          className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="filters">Basic Filters</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Filters Tab */}
          <TabsContent value="filters">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className="space-y-4">
              {/* Generation Filter */}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Generation</Label>
                {generationsLoading ? (
                  <FilterSkeleton />
                ) : generationsError ? (
                  <p className="text-destructive text-sm">Error loading generations</p>
                ) : (
                  <ComboboxWithOptionalMultiSelect
                    options={generationOptions}
                    isMultiSelect={false}
                    selectedOptions={
                      filters.generation
                        ? generationOptions.filter(opt => opt.value === filters.generation)
                        : []
                    }
                    onChange={opts => setFilters({generation: opts[0]?.value || null})}
                    placeholder="Select generation..."
                    name="generation"
                    disabled={isResetting}
                    searchPlaceholder="Search generations..."
                  />
                )}
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Types</Label>
                {typesLoading ? (
                  <FilterSkeleton />
                ) : typesError ? (
                  <p className="text-destructive text-sm">Error loading types</p>
                ) : (
                  <>
                    <ComboboxWithOptionalMultiSelect
                      options={typeOptions}
                      isMultiSelect
                      selectedOptions={typeOptions.filter(opt => filters.types.includes(opt.value))}
                      onChange={opts => setFilters({types: opts.map(opt => opt.value)})}
                      placeholder="Select types..."
                      name="types"
                      disabled={isResetting}
                      searchPlaceholder="Search types..."
                    />
                    {filters.types.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {filters.types.map(type => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className={cn(getPokemonTypeBgClass(type), "text-xs capitalize")}>
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Ability Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Abilities</Label>
                {abilitiesLoading ? (
                  <FilterSkeleton />
                ) : abilitiesError ? (
                  <p className="text-destructive text-sm">Error loading abilities</p>
                ) : (
                  <>
                    <ComboboxWithOptionalMultiSelect
                      options={abilityOptions}
                      isMultiSelect
                      selectedOptions={abilityOptions.filter(opt =>
                        filters.abilities.includes(opt.value)
                      )}
                      onChange={opts => setFilters({abilities: opts.map(opt => opt.value)})}
                      placeholder="Select abilities..."
                      name="abilities"
                      disabled={isResetting}
                      searchPlaceholder="Search abilities..."
                    />
                    {filters.abilities.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {filters.abilities.map(ability => (
                          <Badge
                            key={ability}
                            variant="secondary"
                            className="text-xs capitalize">
                            {ability
                              .split("-")
                              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(" ")}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className="space-y-4">
              {/* Stat Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Base Stats</Label>
                <Card className="border-0 p-0 shadow-none">
                  <CardContent className="bg-muted/40 space-y-4 rounded-lg p-3">
                    {POKEMON_BASE_STATS.map(({key, label, icon: Icon, colorClass, description}) => {
                      const statFilter = filters.stats.find(s => s.stat === key);
                      return (
                        <div
                          key={key}
                          className="space-y-2">
                          <div className="flex items-center justify-between">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 cursor-help">
                                    <Icon className={cn("h-4 w-4", colorClass)} />
                                    <span className="text-xs capitalize">{label}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Badge
                              variant="outline"
                              className="h-5 font-mono text-xs">
                              {statFilter?.min ?? 0}-255
                            </Badge>
                          </div>
                          <Slider
                            value={[statFilter?.min ?? 0]}
                            min={0}
                            max={255}
                            step={1}
                            onValueChange={values => updateStatRange(key, values)}
                            disabled={isResetting}
                          />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
