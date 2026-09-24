type Value =
  | (boolean | number | string)[]
  | boolean
  | null
  | number
  | string
  | undefined;

/**
 * Merge a patch of params onto an existing query string and return the new
 * query string. Shared by `useGetUpdatedSearchParams` (href generation) and
 * `useUpdateSearchParams` (imperative navigation) so both apply identical
 * semantics:
 *
 *  - falsy scalar (`""`, `0`, `false`, `null`, `undefined`) → delete the key
 *  - empty array → delete the key
 *  - array → replace the key with one entry per value
 *  - scalar → set (overwrite) the key
 */
const mergeSearchParams = (
  base: string,
  patch: Record<string, Value>
): string => {
  const params = new URLSearchParams(base);

  Object.entries(patch).forEach(([key, value]: [string, Value]) => {
    if (!value) {
      params.delete(key);

      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        params.delete(key);

        return;
      }

      params.delete(key);

      value.forEach((entry) => {
        params.append(key, entry.toString());
      });

      return;
    }

    params.set(key, value.toString());
  });

  return params.toString();
};

export { mergeSearchParams };
export type { Value };
