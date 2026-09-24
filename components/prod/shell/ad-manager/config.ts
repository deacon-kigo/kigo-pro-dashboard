import type { ModuleConfig } from "../shared/types/module";

import { MegaphoneIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/ad-manager",
  group: "modules",
  icon: MegaphoneIcon,
  id: "ad-manager",
  navOrder: 2,
  navSection: "business",
  roles: ["admin"],
  title: "Ad Manager",
} satisfies ModuleConfig;

export { moduleConfig };
