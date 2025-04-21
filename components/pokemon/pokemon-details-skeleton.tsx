"use client";

import React from "react";

import {motion} from "framer-motion";

import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export const PokemonDetailsSkeleton: React.FC = () => {
  return (
    <motion.div
      className="container mx-auto max-w-5xl px-2 py-4"
      initial={{opacity: 0.5}}
      animate={{opacity: 1}}
      transition={{duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut"}}
      aria-hidden="true">
      {/* Header Section */}
      <Card className="mb-6 overflow-hidden rounded-xl shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image column */}
            <div className="bg-muted/50 relative flex items-center justify-center p-6 md:w-1/3">
              <div className="relative h-56 w-56 overflow-hidden rounded-full">
                <Skeleton className="h-full w-full" />
              </div>
              <Badge
                variant="outline"
                className="bg-background/70 absolute top-4 right-4 text-xs capitalize">
                <Skeleton className="h-4 w-20" />
              </Badge>
            </div>

            {/* Info column */}
            <div className="flex-1 p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="px-3 py-1">
                      <Skeleton className="h-4 w-12" />
                    </Badge>
                    <Badge
                      variant="outline"
                      className="px-3 py-1">
                      <Skeleton className="h-4 w-12" />
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-3/4" />
              <div className="my-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Separator className="my-4" />
              <div>
                <Skeleton className="mb-2 h-4 w-24" />
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="px-3 py-1">
                    <Skeleton className="h-4 w-16" />
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-3 py-1">
                    <Skeleton className="h-4 w-16" />
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs
        defaultValue="stats"
        className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 rounded-xl bg-muted/40 p-1 md:grid-cols-4">
          {["stats", "evolution", "moves", "abilities"].map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-lg text-sm capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm"
              disabled>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Stats Tab */}
        <TabsContent
          value="stats"
          className="mt-0">
          <Card className="rounded-xl shadow-md">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({length: 6}).map((_, index) => (
                  <div
                    key={index}
                    className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Progress
                      value={0}
                      className="h-2"
                    />
                  </div>
                ))}
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evolution Tab */}
        <TabsContent
          value="evolution"
          className="mt-0">
          <Card className="rounded-xl shadow-md">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                {Array.from({length: 3}).map((_, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <div className="flex flex-col items-center py-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="mt-1 h-3 w-16" />
                      </div>
                    )}
                    <div className="flex-1 rounded-lg bg-muted p-3 text-center">
                      <div className="relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full">
                        <Skeleton className="h-full w-full" />
                      </div>
                      <Skeleton className="mx-auto h-4 w-1/2" />
                      <Skeleton className="mx-auto mt-1 h-3 w-12" />
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
          <Card className="rounded-xl shadow-md">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px] w-full rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-background/95 sticky top-0 z-10 backdrop-blur-sm">
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="px-3 py-2 text-left">
                        <Skeleton className="h-4 w-12" />
                      </th>
                      <th className="px-3 py-2 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="px-3 py-2 text-right">
                        <Skeleton className="h-4 w-12" />
                      </th>
                      <th className="px-3 py-2 text-right">
                        <Skeleton className="h-4 w-12" />
                      </th>
                      <th className="px-3 py-2 text-right">
                        <Skeleton className="h-4 w-12" />
                      </th>
                      <th className="px-3 py-2 text-right">
                        <Skeleton className="h-4 w-12" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({length: 10}).map((_, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-0">
                        <td className="px-3 py-1.5">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-3 py-1.5">
                          <Skeleton className="h-4 w-12" />
                        </td>
                        <td className="px-3 py-1.5">
                          <Skeleton className="h-4 w-16" />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <Skeleton className="ml-auto h-4 w-8" />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <Skeleton className="ml-auto h-4 w-8" />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <Skeleton className="ml-auto h-4 w-8" />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <Skeleton className="ml-auto h-4 w-8" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Abilities Tab */}
        <TabsContent
          value="abilities"
          className="mt-0">
          <Card className="rounded-xl shadow-md">
            <CardHeader className="pb-0">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({length: 3}).map((_, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden rounded-xl">
                    <CardHeader className="bg-muted/30 px-4 py-2 pt-0">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 py-0">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="mt-1 h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
