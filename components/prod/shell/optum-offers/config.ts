import type { ModuleConfig } from "../shared/types/module";

import { BeakerIcon } from "@heroicons/react/24/outline";

import { optumOffersWebRoutes } from "./routes";

/**
 * Temporary access to the Optum offer flow.
 *
 * The forms add no route: create and edit are Offer Manager's own, rendering a
 * different profile. Only the list is here, because Offer Manager's list shows
 * every offer and an Optum content manager should see only their own.
 *
 * In the end state none of this exists. The content manager's partner context
 * scopes Offer Manager to their offers and selects their form, so they open
 * Offer Manager and see exactly this. That context is slated with the Optum
 * tenant work; until it lands, this module stands in for it.
 *
 * To remove: delete this folder, drop it from `modules.ts`, and delete the
 * search-parameter branch in `resolve-profile`. Nothing else moves.
 */

const moduleConfig = {
  basePath: optumOffersWebRoutes.list,
  group: "tools",
  icon: BeakerIcon,
  id: "optum-offers",
  navOrder: 9,
  navSection: "business",
  roles: ["admin"],
  title: "Optum Offers (preview)",
} satisfies ModuleConfig;

export { moduleConfig };
