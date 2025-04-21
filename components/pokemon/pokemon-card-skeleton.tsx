"use client";

import React from "react";

import {motion} from "framer-motion";

import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

export const PokemonCardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{opacity: 0.5}}
      animate={{opacity: 1}}
      transition={{duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut"}}
      aria-hidden="true">
      <Card className="h-full rounded-xl shadow-md">
        <CardContent className="p-4">
          {/* Image */}
          <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Name and ID */}
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-12" />
          </div>

          {/* Types */}
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

          {/* Team Button */}
          <div className="flex justify-end">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
