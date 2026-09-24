import type { NavGroup } from "@/components/prod/shell/shared/types/module";

interface NavGroupConfig {
  defaultCollapsed: boolean;
  id: NavGroup;
  label: string;
}

const NAV_GROUPS: readonly NavGroupConfig[] = [
  { defaultCollapsed: false, id: "modules", label: "Modules" },
  { defaultCollapsed: true, id: "tools", label: "Tools" },
] as const;

export { NAV_GROUPS };
