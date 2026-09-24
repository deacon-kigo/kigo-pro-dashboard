import type { ModuleConfig } from "../shared/types/module";

import { TicketIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/sweepstakes",
  group: "tools",
  icon: TicketIcon,
  id: "sweepstakes",
  navOrder: 13,
  navSection: "business",
  roles: ["admin"],
  title: "Sweepstakes",
} satisfies ModuleConfig;

export { moduleConfig };
