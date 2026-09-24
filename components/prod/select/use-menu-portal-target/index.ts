"use client";

import { useSyncExternalStore } from "react";

import { noop } from "@/components/prod/utils/no-op";

const subscribe = () => noop;
const getSnapshot = () => document.body;
const getServerSnapshot = () => null;

/**
 * Returns the provided `menuPortalTarget` if explicitly given (including `null`),
 * otherwise falls back to `document.body` on the client or `null` during SSR.
 * Uses `useSyncExternalStore` to safely handle the server/client difference
 * without causing hydration mismatches.
 *
 * Note: `null` is preserved as-is so callers like `menuPortalTarget={ref.current}`
 * work correctly before the ref is attached (react-select renders the menu inline
 * when `menuPortalTarget` is `null` and `menuPosition` is `"fixed"`).
 */
const useMenuPortalTarget = (menuPortalTarget?: HTMLElement | null) => {
  const fallback = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return menuPortalTarget === undefined ? fallback : menuPortalTarget;
};

export { useMenuPortalTarget };
