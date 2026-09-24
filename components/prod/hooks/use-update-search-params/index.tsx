"use client";

import type { Value } from "@/components/prod/utils/merge-search-params";

import { useCallback, useRef } from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@/components/prod/_runtime/navigation";

import { mergeSearchParams } from "@/components/prod/utils/merge-search-params";

interface SetParamsOptions {
  /**
   * `"replace"` (default) refines the current view without stacking history —
   * use for search, filters, and sort. `"push"` adds a history entry so Back
   * returns to the previous state — use for pagination.
   */
  mode?: "push" | "replace";
}

/**
 * Single entry point for imperative URL-param writes (search, filters, sort,
 * pagination) on list views.
 *
 * The patch is merged onto the URL read at *write* time via a ref,
 * not a render-time snapshot. Two writes fired before
 * the first navigation commits therefore both build on the freshest URL instead
 * of clobbering each other (last-writer-wins).
 *
 * Note: navigation is issued directly. If real-environment instrumentation ever
 * confirms that competing discrete updates preempt the navigation transition,
 * defer the `router` call to a microtask/rAF here — do not add that speculatively.
 */
const useUpdateSearchParams = <T extends Record<string, Value>>() => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Always holds the latest params so `setParams` never reads a stale snapshot.
  const latestParams = useRef(searchParams);

  latestParams.current = searchParams;

  const setParams = useCallback(
    (patch: Partial<T>, { mode = "replace" }: SetParamsOptions = {}) => {
      const query = mergeSearchParams(latestParams.current.toString(), patch);
      const url = query ? `${pathname}?${query}` : pathname;

      if (mode === "push") {
        router.push(url);
      } else {
        router.replace(url);
      }
    },
    [pathname, router]
  );

  return { setParams };
};

export { useUpdateSearchParams };
export type { SetParamsOptions };
