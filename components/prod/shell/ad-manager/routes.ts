const adManagerApiRoutes = {
  ad: {
    delete: "/dashboard/advertisements/:advertisementId",
    edit: "/dashboard/advertisements/:advertisementId",
    get: "/dashboard/advertisements/:advertisementId",
    list: "/dashboard/advertisements",
  },
  adGroups: {
    adsAssign:
      "/dashboard/advertisements/groups/:advertisementGroupId/relations",
    delete: "/dashboard/advertisements/groups/delete",
    edit: "/dashboard/advertisements/groups/:advertisementGroupId",
    editAdsRelation:
      "/dashboard/advertisements/groups/:advertisementGroupId/relations",
    editPromotedCampaignsRelation:
      "/dashboard/advertisements/groups/:advertisementGroupId/program-campaigns",
    get: "/dashboard/advertisements/groups/:advertisementGroupId",
    list: "/dashboard/advertisements/groups",
    promotedCampaignsAssign:
      "/dashboard/advertisements/groups/:advertisementGroupId/program-campaigns",
  },
} as const;

const adManagerWebRoutes = {
  ad: {
    create: "/ad-manager/create-ad",
    edit: "/ad-manager/edit-ad/:advertisementId",
  },
  adGroups: {
    create: "/ad-manager/create-ad-group",
    edit: "/ad-manager/edit-ad-group/:advertisementGroupId",
  },
  list: "/ad-manager",
} as const;

export { adManagerApiRoutes, adManagerWebRoutes };
