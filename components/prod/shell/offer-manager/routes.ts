const offerManagerApiRoutes = {
  delete: "/dashboard/offers/:offerId",
  // Promotion (verify service)
  edit: "/dashboard/offers/:offerId",
  externalReferences: "/dashboard/offers/external-references",
  get: "/dashboard/offers/:offerId",
  list: "/dashboard/offers",
  promotionCreate: "/dashboard/verify/promotions",
  promotionDelete: "/dashboard/verify/promotions/:promotionId",
  promotionEdit: "/dashboard/verify/promotions/:promotionId",
  promotionList: "/dashboard/verify/promotions",
  promotionRewardCreate: "/dashboard/verify/promotion-rewards",
  promotionRewardDelete: "/dashboard/verify/promotion-rewards/:rewardId",
  promotionRewardEdit: "/dashboard/verify/promotion-rewards/:rewardId",
  promotionRewardList: "/dashboard/verify/promotion-rewards",
  types: "/dashboard/offers/types",
  unified: "/dashboard/offers/unified",
  // Assets
  getAssets: "/dashboard/offers/:offerId/assets",
  // Code Display
  createCodeDisplay: "/dashboard/offers/uuid/:uniqueOfferId/code-display",
  getCodeDisplay: "/dashboard/offers/uuid/:uniqueOfferId/code-display",
  // Redemption Controls
  getRedemptionControls: "/dashboard/offers/:offerId/redemption-controls",
  // Savings
  getSavings: "/dashboard/offers/savings",
  // Unique Codes
  getUniqueCodes: "/dashboard/offers/:offerId/unique-codes",
  // Categories
  getCategories: "/dashboard/offers/:offerId/categories",
  // Commodities
  getCommodities: "/dashboard/offers/:offerId/commodities",
  // Descriptives
  getDescriptives: "/dashboard/offers/uuid/:uniqueOfferId/descriptive",
  // Locations
  getAvailableLocations: "/dashboard/offers/:offerId/locations",
} as const;

const offerManagerWebRoutes = {
  create: "/offer-manager/create-offer",
  edit: "/offer-manager/edit-offer/:offerId",
  list: "/offer-manager",
  view: "/offer-manager/view-offer/:offerId",
} as const;

export { offerManagerApiRoutes, offerManagerWebRoutes };
