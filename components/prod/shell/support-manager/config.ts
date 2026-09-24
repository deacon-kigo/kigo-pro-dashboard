import type { ModuleConfig } from "../shared/types/module";

import { LifebuoyIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/support-manager",
  group: "tools",
  icon: LifebuoyIcon,
  id: "support-manager",
  navOrder: 6,
  navSection: "business",
  roles: ["admin"],
  title: "Support Manager",
} satisfies ModuleConfig;

export { moduleConfig };
