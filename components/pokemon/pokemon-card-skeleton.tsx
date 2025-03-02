import { Skeleton } from "../ui/skeleton";

export const PokemonCardSkeleton: React.FC = () => (
  <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div className="p-4 text-center">
      <Skeleton className="mx-auto h-32 w-32 rounded-full" />
      <div className="mt-4 flex items-center justify-center gap-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="mt-2 flex justify-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
    <div className="p-4 pt-0">
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
