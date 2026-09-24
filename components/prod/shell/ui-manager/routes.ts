const uiManagerWebRoutes = {
  partnerPageEditor: "/ui-manager/partner/:partnerId/pages/:pageId",
  partnerSavedQueryEditor:
    "/ui-manager/partner/:partnerId/saved-queries/:queryName",
  partnerSavedQueryNew: "/ui-manager/partner/:partnerId/saved-queries/new",
  partnerWorkspace: "/ui-manager/partner/:partnerId",
  programPageEditor: "/ui-manager/program/:programId/pages/:pageId",
  programSavedQueryEditor:
    "/ui-manager/program/:programId/saved-queries/:queryName",
  programSavedQueryNew: "/ui-manager/program/:programId/saved-queries/new",
  programWorkspace: "/ui-manager/program/:programId",
  view: "/ui-manager",
} as const;

export { uiManagerWebRoutes };
