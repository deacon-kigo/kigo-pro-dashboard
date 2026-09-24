const tmtApiRoutes = {
  // Campaigns
  create: "/dashboard/tmt-campaigns",
  delete: "/dashboard/tmt-campaigns/:campaignId",
  edit: "/dashboard/tmt-campaigns/:campaignId",
  get: "/dashboard/tmt-campaigns/:campaignId",
  list: "/dashboard/tmt-campaigns",
  // Codes
  codes: "/dashboard/tmt-campaigns/:campaignId/codes",
  codesCsv: "/dashboard/tmt-campaigns/:campaignId/codes/csv",
  codesTest: "/dashboard/tmt-campaigns/:campaignId/codes/test",
  codesUsedCount: "/dashboard/tmt-campaigns/:campaignId/codes/used-count",
} as const;

const tmtWebRoutes = {
  create: "/tmt/create-campaign",
  edit: "/tmt/edit-campaign/:campaignId",
  list: "/tmt",
} as const;

export { tmtApiRoutes, tmtWebRoutes };
