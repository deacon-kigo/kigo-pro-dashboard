const catalogFiltersApiRoutes = {
  bulkAssign: "/dashboard/program-campaigns/bulk",
  delete: "/dashboard/catalog-filters/delete",
  diagnose: "/dashboard/catalog-filters/:filterId/diagnose",
  downloadOffers: "/dashboard/catalog-filters/:filterId/offers/csv",
  edit: "/dashboard/catalog-filters/:filterId",
  get: "/dashboard/catalog-filters/:filterId",
  list: "/dashboard/catalog-filters",
} as const;

const catalogFiltersWebRoutes = {
  create: "/catalog-filters/create-catalog-filter",
  edit: "/catalog-filters/edit-catalog-filter/:filterId",
  list: "/catalog-filters",
} as const;

export { catalogFiltersApiRoutes, catalogFiltersWebRoutes };
