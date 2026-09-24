import type { ModuleConfig } from "../shared/types/module";

import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/publisher-manager",
  group: "modules",
  icon: BuildingOffice2Icon,
  id: "publisher-manager",
  navOrder: 5,
  navSection: "business",
  roles: ["admin"],
  title: "Publisher Manager",
} satisfies ModuleConfig;

export { moduleConfig };
