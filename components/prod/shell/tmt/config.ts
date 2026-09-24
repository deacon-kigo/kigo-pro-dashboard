import type { ModuleConfig } from "../shared/types/module";

import { QrCodeIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/tmt",
  /*
   * KD-10356: TMT Manager is hidden until we begin using it. `enabled: false`
   * removes it from the sidebar (see get-navigation-items) and, together with
   * the guard in layout.tsx, 404s its routes. To re-enable: delete this flag
   * and revert the disabled-state assertions in config.test.ts.
   */
  enabled: false,
  group: "tools",
  icon: QrCodeIcon,
  id: "tmt",
  navOrder: 8,
  navSection: "business",
  roles: ["admin"],
  title: "TMT Manager",
} satisfies ModuleConfig;

export { moduleConfig };
