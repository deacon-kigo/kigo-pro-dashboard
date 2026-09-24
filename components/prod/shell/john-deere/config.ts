import type { ModuleConfig } from "../shared/types/module";

import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/john-deere",
  group: "tools",
  icon: WrenchScrewdriverIcon,
  id: "john-deere",
  navOrder: 7,
  navSection: "business",
  roles: ["admin"],
  title: "John Deere",
} satisfies ModuleConfig;

export { moduleConfig };
