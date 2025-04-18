import {SiteBranding} from "../shared/site-branding";
import {ThemeSwitcher} from "../theme-switcher";
import {NavMain} from "./nav-main";
import {NavUser} from "./nav-user";

export const Header: React.FC = async () => {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <SiteBranding />

        {/* Right Side */}
        <div className="flex items-center justify-end gap-1">
          <NavMain />
          <ThemeSwitcher />
          <NavUser />
        </div>
      </div>
    </header>
  );
};
