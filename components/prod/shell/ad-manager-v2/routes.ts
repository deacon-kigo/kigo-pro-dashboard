const adManagerV2ApiRoutes = {
  ad: {
    delete: "/dashboard/advertisements/:advertisementId",
    edit: "/dashboard/advertisements/:advertisementId",
    get: "/dashboard/advertisements/:advertisementId",
    list: "/dashboard/advertisements",
    withPlacements: "/dashboard/advertisements/with-placements",
  },
  adGroupPlacementOverrides: {
    delete: "/dashboard/advertisements/ad-group-placement-overrides/:id",
    edit: "/dashboard/advertisements/ad-group-placement-overrides/:id",
    get: "/dashboard/advertisements/ad-group-placement-overrides/:id",
    list: "/dashboard/advertisements/ad-group-placement-overrides",
  },
  adGroups: {
    create: "/dashboard/advertisements/groups",
    delete: "/dashboard/advertisements/groups/delete",
    edit: "/dashboard/advertisements/groups/:advertisementGroupId",
    editAdsRelation:
      "/dashboard/advertisements/groups/:advertisementGroupId/relations",
    get: "/dashboard/advertisements/groups/:advertisementGroupId",
    linkProgramCampaigns:
      "/dashboard/advertisements/groups/:advertisementGroupId/program-campaigns",
    list: "/dashboard/advertisements/groups",
  },
  adGroupSponsoredMerchantOverrides: {
    delete:
      "/dashboard/advertisements/ad-group-sponsored-merchant-overrides/:id",
    edit: "/dashboard/advertisements/ad-group-sponsored-merchant-overrides/:id",
    get: "/dashboard/advertisements/ad-group-sponsored-merchant-overrides/:id",
    list: "/dashboard/advertisements/ad-group-sponsored-merchant-overrides",
  },
  adPlacements: {
    get: "/dashboard/advertisements/placements/:id",
    list: "/dashboard/advertisements/placements",
  },
  placementAssignments: {
    delete: "/dashboard/advertisements/advertisement-placement-assignments/:id",
    edit: "/dashboard/advertisements/advertisement-placement-assignments/:id",
    get: "/dashboard/advertisements/advertisement-placement-assignments/:id",
    list: "/dashboard/advertisements/advertisement-placement-assignments",
  },
  programCampaigns: {
    create: "/dashboard/program-campaigns",
    edit: "/dashboard/program-campaigns/:id",
  },
  programs: {
    list: "/dashboard/programs",
  },
  sponsoredMerchants: {
    delete: "/dashboard/advertisements/sponsored-merchants/:id",
    edit: "/dashboard/advertisements/sponsored-merchants/:id",
    get: "/dashboard/advertisements/sponsored-merchants/:id",
    list: "/dashboard/advertisements/sponsored-merchants",
  },
} as const;

const adManagerV2WebRoutes = {
  ad: {
    create: "/ad-manager-v2/create-ad",
    detail: "/ad-manager-v2/ad/:advertisementId",
  },
  adGroup: {
    create: "/ad-manager-v2/create-ad-group",
    edit: "/ad-manager-v2/ad-group/:advertisementGroupId",
  },
  adGroups: "/ad-manager-v2/ad-groups",
  ads: "/ad-manager-v2/ads",
  diagnose: "/ad-manager-v2/diagnose",
  list: "/ad-manager-v2",
  program: {
    dashboard: "/ad-manager-v2/program/:programId",
    setup: "/ad-manager-v2/program/:programId/setup",
  },
  sponsoredMerchants: "/ad-manager-v2/sponsored-merchants",
} as const;

export { adManagerV2ApiRoutes, adManagerV2WebRoutes };
