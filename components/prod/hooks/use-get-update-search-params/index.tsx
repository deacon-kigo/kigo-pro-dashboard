"use client";

import type { Value } from "@/components/prod/utils/merge-search-params";

import { useSearchParams } from "@/components/prod/_runtime/navigation";

import { mergeSearchParams } from "@/components/prod/utils/merge-search-params";

/**
 * Returns a function that builds a new query string by merging a patch onto the
 * current URL's params — used for generating `<a href>` strings (e.g. pagination
 * links) that are regenerated on every render.
 *
 * For imperative navigation from event handlers, prefer `useUpdateSearchParams`,
 * which reads the *live* URL at write time instead of a render-time snapshot.
 */
const useGetUpdatedSearchParams = <T extends Record<string, Value>>() => {
  const searchParams = useSearchParams();

  return (searchParam: Partial<T>) =>
    mergeSearchParams(searchParams.toString(), searchParam);
};

export { useGetUpdatedSearchParams };
