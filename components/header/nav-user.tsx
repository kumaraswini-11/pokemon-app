import { LogIn } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar, UserInfoDisplay, UserMenuItems } from "./user-details";
import { auth } from "@/auth";

export const NavUser: React.FC = async () => {
  const session = await auth();
  const user = session?.user;
  const isUserSignedIn = user && Object.keys(user).length > 0;

  return isUserSignedIn ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 w-9 rounded-lg p-0">
          <UserAvatar user={user} className="cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 p-1">
            <UserAvatar user={user} className="cursor-pointer" />
            <UserInfoDisplay user={user} />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button asChild variant="secondary">
      <Link href="/sign-in">
        <LogIn className="size-4" />
        Sign in
      </Link>
    </Button>
  );
};
