const webBuilderApiRoutes = {
  partnerAppConfig: {
    create: "/dashboard/config/uiux/partner-app-configurations",
    delete: "/dashboard/config/uiux/partner-app-configurations/:partnerId",
    edit: "/dashboard/config/uiux/partner-app-configurations/:partnerId",
    get: "/dashboard/config/uiux/partner-app-configurations/:partnerId",
  },
  partnerCategoryGridItem: {
    create:
      "/dashboard/config/uiux/category-grid-item/:partnerAppConfigurationId/:partnerCategoryGridId",
    delete:
      "/dashboard/config/uiux/category-grid-items/:partnerAppConfigurationId/:categoryGridId/:categoryGridItemMetadataId",
    edit: "/dashboard/config/uiux/category-grid-items/:partnerAppConfigurationId/:categoryGridId/:categoryGridItemMetadataId",
    list: "/dashboard/config/uiux/category-grid-item/:partnerAppConfigurationId/:partnerCategoryGridId",
  },
  partnerCategoryGrids: {
    create: "/dashboard/config/uiux/category-grids/:appConfigurationId",
    delete:
      "/dashboard/config/uiux/category-grids/:appConfigurationId/:categoryGridId",
    edit: "/dashboard/config/uiux/category-grids/:appConfigurationId/:categoryGridId",
    list: "/dashboard/config/uiux/category-grids/:appConfigurationId",
  },
  partnerChipFilters: {
    create:
      "/dashboard/config/uiux/chip-filter-configurations/chips/partner/:partnerAppConfigurationId",
    delete:
      "/dashboard/config/uiux/chip-filter-configurations/chips/partner/:partnerAppConfigurationId/:chipName",
    edit: "/dashboard/config/uiux/chip-filter-configurations/chips/partner/:partnerAppConfigurationId/:chipName",
    list: "/dashboard/config/uiux/chip-filter-configurations/chips/partner/:partnerAppConfigurationId",
  },
  partnerOfferCarousels: {
    create: "/dashboard/config/uiux/offer-carousels/:partnerAppConfigurationId",
    delete:
      "/dashboard/config/uiux/offer-carousels/:partnerAppConfigurationId/:carouselId",
    edit: "/dashboard/config/uiux/offer-carousels/:partnerAppConfigurationId/:carouselId",
    list: "/dashboard/config/uiux/offer-carousels/:partnerAppConfigurationId",
  },
  partnerPageComponentConfigurations: {
    create:
      "/dashboard/config/uiux/page-components-configurations/partner/:partnerAppConfigurationId/:partnerPageConfigurationId",
    delete:
      "/dashboard/config/uiux/page-components-configurations/partner/:partnerAppConfigurationId/:partnerPageConfigurationId/:partnerPageComponentConfigurationId",
    edit: "/dashboard/config/uiux/page-components-configurations/partner/:partnerAppConfigurationId/:partnerPageConfigurationId/:partnerPageComponentConfigurationId",
    list: "/dashboard/config/uiux/page-components-configurations/partner/:partnerAppConfigurationId/:partnerPageConfigurationId",
    reorder:
      "/dashboard/config/uiux/page-components-configurations/:partnerPageConfigurationId/reorder",
  },
  partnerPageConfigurations: {
    create: "/dashboard/config/uiux/page-configurations/partner",
    delete:
      "/dashboard/config/uiux/page-configurations/partner/:partnerAppConfigurationId/:configurationId",
    edit: "/dashboard/config/uiux/page-configurations/partner/:partnerAppConfigurationId/:configurationId",
    list: "/dashboard/config/uiux/page-configurations/partner/:partnerAppConfigurationId",
  },
  partnerSavedQueries: {
    create: "/dashboard/config/uiux/saved-queries/:appConfigurationId",
    delete:
      "/dashboard/config/uiux/saved-queries/:appConfigurationId/:queryName",
    edit: "/dashboard/config/uiux/saved-queries/:appConfigurationId/:queryName",
    list: "/dashboard/config/uiux/saved-queries/:appConfigurationId",
    test: "/dashboard/config/uiux/saved-queries/:appConfigurationId/:queryName/test",
  },
  programAppConfig: {
    create: "/dashboard/config/uiux/app-configurations",
    delete: "/dashboard/config/uiux/app-configurations/:programId",
    edit: "/dashboard/config/uiux/app-configurations/:programId",
    get: "/dashboard/config/uiux/app-configurations/:programId",
  },
  programCategoryGridItem: {
    create:
      "/dashboard/config/uiux/category-grid-item/:programAppConfigurationId/:programCategoryGridId",
    delete:
      "/dashboard/config/uiux/category-grid-items/:programAppConfigurationId/:categoryGridId/:categoryGridItemMetadataId",
    edit: "/dashboard/config/uiux/category-grid-items/:programAppConfigurationId/:categoryGridId/:categoryGridItemMetadataId",
    list: "/dashboard/config/uiux/category-grid-item/:programAppConfigurationId/:programCategoryGridId",
  },
  programCategoryGrids: {
    create: "/dashboard/config/uiux/category-grids/:appConfigurationId",
    delete:
      "/dashboard/config/uiux/category-grids/:appConfigurationId/:categoryGridId",
    edit: "/dashboard/config/uiux/category-grids/:appConfigurationId/:categoryGridId",
    list: "/dashboard/config/uiux/category-grids/:appConfigurationId",
  },
  programChipFilters: {
    create:
      "/dashboard/config/uiux/chip-filter-configurations/chips/program/:programAppConfigurationId",
    delete:
      "/dashboard/config/uiux/chip-filter-configurations/chips/program/:programAppConfigurationId/:chipName",
    edit: "/dashboard/config/uiux/chip-filter-configurations/chips/program/:programAppConfigurationId/:chipName",
    list: "/dashboard/config/uiux/chip-filter-configurations/chips/program/:programAppConfigurationId",
  },
  programOfferCarousels: {
    create: "/dashboard/config/uiux/offer-carousels/:programAppConfigurationId",
    delete:
      "/dashboard/config/uiux/offer-carousels/:programAppConfigurationId/:carouselId",
    edit: "/dashboard/config/uiux/offer-carousels/:programAppConfigurationId/:carouselId",
    list: "/dashboard/config/uiux/offer-carousels/:programAppConfigurationId",
  },
  programPageComponentConfigurations: {
    create:
      "/dashboard/config/uiux/page-components-configurations/program/:programAppConfigurationId/:programPageConfigurationId",
    delete:
      "/dashboard/config/uiux/page-components-configurations/program/:programAppConfigurationId/:programPageConfigurationId/:programPageComponentConfigurationId",
    edit: "/dashboard/config/uiux/page-components-configurations/program/:programAppConfigurationId/:programPageConfigurationId/:programPageComponentConfigurationId",
    list: "/dashboard/config/uiux/page-components-configurations/program/:programAppConfigurationId/:programPageConfigurationId",
    reorder:
      "/dashboard/config/uiux/page-components-configurations/:programPageConfigurationId/reorder",
  },
  programPageConfigurations: {
    create: "/dashboard/config/uiux/page-configurations/program",
    delete:
      "/dashboard/config/uiux/page-configurations/program/:programAppConfigurationId/:configurationId",
    edit: "/dashboard/config/uiux/page-configurations/program/:programAppConfigurationId/:configurationId",
    list: "/dashboard/config/uiux/page-configurations/program/:programAppConfigurationId",
  },
  programSavedQueries: {
    create: "/dashboard/config/uiux/saved-queries/:appConfigurationId",
    delete:
      "/dashboard/config/uiux/saved-queries/:appConfigurationId/:queryName",
    edit: "/dashboard/config/uiux/saved-queries/:appConfigurationId/:queryName",
    list: "/dashboard/config/uiux/saved-queries/:appConfigurationId",
    test: "/dashboard/config/uiux/saved-queries/:appConfigurationId/:queryName/test",
  },
  /**
   * Welcome-modal config is owned by exactly one of a program or a partner,
   * passed as a `program_id` / `partner_id` query param (never both). The
   * consolidated endpoint has no config-id path segment — create, read,
   * update, and delete all target this same owner-scoped URL.
   */
  welcomeModal: (owner: WelcomeModalOwner) => {
    const params = new URLSearchParams();

    if ("programId" in owner) {
      params.set("program_id", owner.programId);
    } else {
      params.set("partner_id", owner.partnerId);
    }

    return `/dashboard/config/uiux/component/welcome-modal?${params.toString()}`;
  },
} as const;

/**
 * Owner discriminator for the welcome-modal endpoint: exactly one of a program
 * or a partner owns the config.
 */
type WelcomeModalOwner =
  | { partnerId: string; programId?: never }
  | { partnerId?: never; programId: string };

export { webBuilderApiRoutes, type WelcomeModalOwner };
