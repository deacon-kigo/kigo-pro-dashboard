import { ROUTES } from "@/components/prod/constants/routes";

interface SegmentAlias {
  href?: string;
  label: string;
}

/*
 * Static label/href aliases for wrapper URL segments, keyed by the accumulated
 * path up to that segment. Used only for wrappers that should retarget to a
 * real sibling page rather than degrade to plain text — e.g. the singular `ad`
 * detail wrapper links to the plural `Ads` list.
 *
 * Keyed by the full accumulated path (not the bare segment) so a segment name
 * that appears in more than one module does not collide: `program` exists under
 * both `/ad-manager-v2/program/:id` and `/ui-manager/program/:id`, and only the
 * former should alias to the ad-manager-v2 programs list.
 *
 * This is deliberately narrow: navigability is owned by `isKnownWebRoute`, and
 * dynamic id -> name relabeling is owned by <BreadcrumbOverride>. Wrappers with
 * no sibling list to point at are not listed here — they correctly render as
 * non-navigable text.
 */
const SEGMENT_ALIASES: Record<string, SegmentAlias> = {
  "/ad-manager-v2/ad": { href: ROUTES.web.adManagerV2.ads, label: "Ads" },
  "/ad-manager-v2/ad-group": {
    href: ROUTES.web.adManagerV2.adGroups,
    label: "Ad Groups",
  },
  "/ad-manager-v2/program": {
    href: ROUTES.web.adManagerV2.list,
    label: "Programs",
  },
};

export { SEGMENT_ALIASES };
