"use client";

import {PokemonFilters} from "@/components/pokemon/pokemon-filter";
import {PokemonGrid} from "@/components/pokemon/pokemon-grid";
import {SearchInput} from "@/components/pokemon/pokemon-search-input";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function HomePage() {
  return (
    <div className="flex h-screen w-full flex-col gap-2 overflow-hidden px-2 py-1">
      {/* Top search bar with mobile filter button - fixed */}
      <div className="flex items-center gap-2">
        <SearchInput />
        {/* Mobile filter button - only visible on small screens */}
        {/* <MobileViewFilters /> */}
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Desktop filters - hidden on mobile - fixed */}
        <ScrollArea className="hidden w-auto md:block">
          <PokemonFilters />
        </ScrollArea>

        {/* Pokemon grid - scrollable */}
        <ScrollArea className="w-full">
          <PokemonGrid />
        </ScrollArea>
      </div>
    </div>
  );
}

// export const MobileViewFilters = () => {
//   const [isSheetOpen, setIsSheetOpen] = useState(false);

//   return (
//     <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
//       <SheetTrigger asChild>
//         <Button variant="outline" size="icon" className="md:hidden">
//           <FilterIcon className="size-4" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-[24rem] p-0 sm:w-[350px]">
//         <SheetHeader className="px-4 pt-4">
//           <SheetTitle>Pokemon Filters</SheetTitle>
//           <SheetDescription>Fine-tune your Pokemon search</SheetDescription>
//         </SheetHeader>
//       </SheetContent>
//     </Sheet>
//   );
// };
