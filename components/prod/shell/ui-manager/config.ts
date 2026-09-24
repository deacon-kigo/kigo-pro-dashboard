import type { ModuleConfig } from "../shared/types/module";

import { PaintBrushIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/ui-manager",
  group: "tools",
  icon: PaintBrushIcon,
  id: "ui-manager",
  navOrder: 9,
  navSection: "business",
  roles: ["admin"],
  title: "UI Manager",
} satisfies ModuleConfig;

export { moduleConfig };
