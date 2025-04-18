"use client";

import {useRouter} from "next/navigation";

import {LogOut, Send, Settings} from "lucide-react";
import {toast} from "sonner";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import {signOutAction} from "@/lib/actions/auth-actions";
import {cn, getInitials} from "@/lib/utils";
import {Icon, User} from "@/types";

interface UserAvatarProps extends User {
  className?: string;
}

interface UserMenuItem extends Icon {
  label: string;
  onClick?: () => void;
}

export const UserAvatarSkeleton: React.FC<{className?: string}> = ({className}) => {
  return <Skeleton className={cn("h-9 w-9 rounded-lg shadow-md", className)} />;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({user, className}) => {
  return (
    <Avatar className={cn("h-9 w-9 rounded-lg", className)}>
      <AvatarImage
        src={user.image}
        alt={user.name}
      />
      <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export const UserInfoDisplay: React.FC<User> = ({user}) => {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">{user.name}</span>
      <span className="text-muted-foreground truncate text-xs">{user.email}</span>
    </div>
  );
};

export const UserMenuItems: React.FC = () => {
  const userMenuItems: UserMenuItem[] = [
    {icon: Settings, label: "Settings"},
    {icon: Send, label: "Feedback"},
  ];

  const router = useRouter();

  const handleSignOut = async () => {
    const res = await signOutAction();

    if (res.success) {
      toast.success("Successfully signed out!", {
        description: new Date().toISOString(),
      });
      router.refresh(); // Refresh the current page to update UI
    } else {
      toast.error(res.error || "Failed to sign out");
    }
  };

  return (
    <>
      <DropdownMenuGroup>
        {userMenuItems.map(({icon: Icon, label}, index) => (
          <DropdownMenuItem
            key={index}
            className="flex items-center gap-2">
            {Icon && <Icon className="size-4" />}
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="flex items-center gap-2"
        onClick={handleSignOut}>
        <LogOut className="size-4" />
        <span>Sign out</span>
      </DropdownMenuItem>
    </>
  );
};
