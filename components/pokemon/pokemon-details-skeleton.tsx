import {Card, CardContent, CardFooter} from "../ui/card";
import {Skeleton} from "../ui/skeleton";

export const PokemonDetailsSkeleton = () => (
  <div className="container mx-auto max-w-5xl px-4 py-6">
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-muted/50 relative flex items-center justify-center p-6 md:w-1/3">
            <Skeleton className="h-56 w-56 rounded-full" />
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 px-6 py-3">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>

    <div className="space-y-2">
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
    </div>
  </div>
);
