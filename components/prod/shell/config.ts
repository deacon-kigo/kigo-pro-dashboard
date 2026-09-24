import type { ModuleConfig } from "./shared/types/module";

import { HomeIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/",
  group: "modules",
  icon: HomeIcon,
  id: "dashboard",
  navOrder: 1,
  navSection: "business",
  roles: ["admin"],
  title: "Dashboard",
} satisfies ModuleConfig;

export { moduleConfig };
