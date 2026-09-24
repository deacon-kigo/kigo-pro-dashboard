/*
 * Only the workspace is registered. `/publisher-manager` renders no page of its
 * own — it resolves the first selectable publisher and redirects — and
 * `isKnownWebRoute` derives breadcrumb links from this object, so registering
 * it would turn the "Publisher Manager" crumb into a link that silently moves
 * the admin to a different publisher than the one they were looking at.
 *
 * The sidebar is unaffected: it links `moduleConfig.basePath`.
 */
const publisherManagerWebRoutes = {
  view: "/publisher-manager/:publisherId",
} as const;

export { publisherManagerWebRoutes };
