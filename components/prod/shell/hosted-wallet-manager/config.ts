import type { ModuleConfig } from "../shared/types/module";

import { Cog6ToothIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/hosted-wallet-manager",
  group: "tools",
  icon: Cog6ToothIcon,
  id: "hosted-wallet-manager",
  navOrder: 11,
  navSection: "business",
  roles: ["admin"],
  title: "Hosted Settings Manager",
} satisfies ModuleConfig;

export { moduleConfig };
