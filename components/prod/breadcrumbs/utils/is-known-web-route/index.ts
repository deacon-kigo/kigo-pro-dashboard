import { ROUTES } from "@/components/prod/constants/routes";

/*
 * Navigability source of truth for breadcrumbs. A breadcrumb prefix should only
 * be a link if it resolves to a real page; otherwise it is a structural wrapper
 * segment (e.g. `edit-offer` in `/offer-manager/edit-offer/:id`) that has no
 * page and must not be linked.
 *
 * `ROUTES.web` (src/constants/routes.ts) already aggregates every module's web
 * routes, so we derive the set of navigable patterns from it rather than
 * hand-maintaining a list. Patterns keep their `:param` placeholders; matching
 * treats each `:param` as a single-segment wildcard. No catch-all (`:param*`)
 * web routes exist today — the matcher assumes one segment per placeholder.
 */
const collectRoutePatterns = (value: unknown): string[] => {
  if (typeof value === "string") {
    return [value];
  }

  if (value !== null && typeof value === "object") {
    return Object.values(value).flatMap(collectRoutePatterns);
  }

  return [];
};

const WEB_ROUTE_PATTERNS = collectRoutePatterns(ROUTES.web);

const matchesPattern = (pattern: string, path: string): boolean => {
  const patternSegments = pattern.split("/");
  const pathSegments = path.split("/");

  if (patternSegments.length !== pathSegments.length) {
    return false;
  }

  return patternSegments.every(
    (segment, index) =>
      segment.startsWith(":") || segment === pathSegments[index]
  );
};

const isKnownWebRoute = (path: string): boolean =>
  WEB_ROUTE_PATTERNS.some((pattern) => matchesPattern(pattern, path));

export { isKnownWebRoute };
