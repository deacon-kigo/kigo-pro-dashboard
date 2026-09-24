const SORT_DIRECTIONS = {
  asc: "asc",
  desc: "desc",
} as const;

/*
 * * We need to use type here because we use it as a generic type
 * * reason: https://github.com/microsoft/TypeScript/issues/15300#issuecomment-332366024
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type BaseSearchParams<T extends readonly string[] | string[] = []> = {
  orderBy?: T[number];
  orderDirection?: SortDirection;
  page?: number | string | undefined;
  pageSize?: number | string | undefined;
  searchQuery?: string | undefined;
};

type SortDirection = (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

export { type BaseSearchParams, SORT_DIRECTIONS, type SortDirection };
