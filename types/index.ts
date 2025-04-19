import {type LucideIcon} from "lucide-react";

export interface User {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

export interface Icon {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
}

export interface NavItem extends Icon {
  title: string;
  url: string;
}
