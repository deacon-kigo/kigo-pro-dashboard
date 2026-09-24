const PAGE_SIZES = [5, 10, 20, 50] as const;

/** One of the sizes the page-size selector offers. */
type PageSize = (typeof PAGE_SIZES)[number];

export { PAGE_SIZES, type PageSize };
