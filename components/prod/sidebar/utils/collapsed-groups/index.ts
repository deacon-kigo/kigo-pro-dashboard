import type { NavGroup } from "@/components/prod/shell/shared/types/module";

import { NAV_GROUPS } from "../../constants";

const GROUP_IDS = NAV_GROUPS.map(({ id }) => id);

const DEFAULT_COLLAPSED_GROUPS = NAV_GROUPS.filter(
  ({ defaultCollapsed }) => defaultCollapsed
).map(({ id }) => id);

const isNavGroup = (value: string): value is NavGroup =>
  GROUP_IDS.includes(value as NavGroup);

/*
 * An absent cookie means the user hasn't toggled anything yet, so fall back to
 * the per-group defaults. A present (even empty) value is an explicit choice.
 */
const parseCollapsedGroups = (value: string | undefined): NavGroup[] => {
  if (value === undefined) {
    return DEFAULT_COLLAPSED_GROUPS;
  }

  return value.split(",").filter(isNavGroup);
};

const serializeCollapsedGroups = (groups: NavGroup[]): string =>
  groups.join(",");

export { parseCollapsedGroups, serializeCollapsedGroups };
