import type { ModuleConfig } from "../shared/types/module";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/catalog-filters",
  group: "tools",
  icon: AdjustmentsHorizontalIcon,
  id: "catalog-filters",
  navOrder: 4,
  navSection: "business",
  roles: ["admin"],
  title: "Catalog Filters",
} satisfies ModuleConfig;

export { moduleConfig };
