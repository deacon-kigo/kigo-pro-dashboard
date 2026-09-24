import type { NavGroup } from "@/components/prod/shell/shared/types/module";
import type { Role } from "@/components/prod/utils/session/store/types";

import { modules } from "@/components/prod/shell/modules";

type NavigationItemsByGroup = Record<
  NavGroup,
  {
    href: string;
    icon: (typeof modules)[number]["icon"];
    title: string;
  }[]
>;

const getNavigationItems = (role: Role): NavigationItemsByGroup => {
  const enabledModules = modules
    .filter((module) => module.roles.includes(role) && module.enabled !== false)
    .sort((moduleA, moduleB) => moduleA.navOrder - moduleB.navOrder);

  return enabledModules.reduce<NavigationItemsByGroup>(
    (acc, { basePath, group, icon, title }) => {
      acc[group].push({ href: basePath, icon, title });

      return acc;
    },
    { modules: [], tools: [] }
  );
};

export { getNavigationItems };
