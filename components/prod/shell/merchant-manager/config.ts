import type { ModuleConfig } from "../shared/types/module";

import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/merchant-manager",
  group: "modules",
  icon: BuildingStorefrontIcon,
  id: "merchant-manager",
  navOrder: 4,
  navSection: "business",
  roles: ["admin"],
  title: "Merchant Manager",
} satisfies ModuleConfig;

export { moduleConfig };
