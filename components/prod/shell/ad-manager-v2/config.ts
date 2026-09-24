import type { ModuleConfig } from "../shared/types/module";

import { MegaphoneIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/ad-manager-v2",
  group: "modules",
  icon: MegaphoneIcon,
  id: "ad-manager-v2",
  navOrder: 3,
  navSection: "business",
  roles: ["admin"],
  title: "Ad Manager v2",
} satisfies ModuleConfig;

export { moduleConfig };
