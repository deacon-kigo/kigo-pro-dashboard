import type { ModuleConfig } from "../shared/types/module";

import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/manual-review",
  group: "tools",
  icon: ClipboardDocumentCheckIcon,
  id: "manual-review",
  navOrder: 6,
  navSection: "business",
  roles: ["admin"],
  title: "Manual Review",
} satisfies ModuleConfig;

export { moduleConfig };
