const merchantManagerApiRoutes = {
  list: "/dashboard/merchants",
} as const;

const merchantManagerWebRoutes = {
  create: "/merchant-manager/create-merchant",
  edit: "/merchant-manager/edit-merchant/:merchantId",
  list: "/merchant-manager",
  view: "/merchant-manager/view-merchant/:merchantId",
} as const;

export { merchantManagerApiRoutes, merchantManagerWebRoutes };
