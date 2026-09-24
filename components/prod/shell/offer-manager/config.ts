import type { ModuleConfig } from "../shared/types/module";

import { GiftIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/offer-manager",
  group: "modules",
  icon: GiftIcon,
  id: "offer-manager",
  navOrder: 3,
  navSection: "business",
  roles: ["admin"],
  title: "Offer Manager",
} satisfies ModuleConfig;

export { moduleConfig };
