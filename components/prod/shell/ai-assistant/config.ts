import type { ModuleConfig } from "../shared/types/module";

import { SparklesIcon } from "@heroicons/react/24/outline";

const moduleConfig = {
  basePath: "/ai-assistant",
  enabled: !!(
    process.env.NEXT_PUBLIC_AI_ASSISTANT_SDK_URL &&
    process.env.NEXT_PUBLIC_AI_ASSISTANT_API_BASE_URL
  ),
  group: "tools",
  icon: SparklesIcon,
  id: "ai-assistant",
  navOrder: 5,
  navSection: "business",
  roles: ["admin"],
  title: "AI Assistant",
} satisfies ModuleConfig;

export { moduleConfig };
