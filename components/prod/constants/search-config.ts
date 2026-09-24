export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  /*
   * Upper bound on merchant search results loaded into the async dropdowns.
   * The dropdown has no scroll-to-load-more, so this caps what is reachable by
   * name. Kept high so common names (e.g. "Papa John's") surface every match
   * after merchant volume growth; exact lookups should use the `id:` prefix.
   */
  MERCHANT_RESULT_LIMIT: 100,
  MIN_LENGTH: 3,
} as const;
