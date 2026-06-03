import type { Merchant, Offer } from "./types";

/**
 * Maps a merchant Offer (this module's shape) into the localStorage payload
 * that `OfferManagerViewP0_5Carousel` reads on mount when in edit mode.
 *
 * The carousel doesn't look up offers from `MOCK_OFFERS` by id — it hydrates
 * from `localStorage.getItem("editOffer")`. So to make timeline rows open a
 * real offer page with real data, the caller writes this payload to
 * localStorage right before navigating to `/offer-manager?version=p1.1&edit=…`.
 */

// Merchant `offerType` is a free-text label (e.g. "Percentage Off"). The
// carousel expects the production OfferType key (e.g. "percentage_savings").
const OFFER_TYPE_LABEL_TO_KEY: Record<string, string> = {
  "Percentage Off": "percentage_savings",
  "Percent Off": "percentage_savings",
  "Money Off": "dollars_off",
  "Dollar Off": "dollars_off",
  "Cash Back": "cashback",
  Cashback: "cashback",
  "Buy One Get One": "bogo",
  BOGO: "bogo",
  "Free Product": "free_with_purchase",
  "Free With Purchase": "free_with_purchase",
  "Fixed Price": "price_point",
  "Special Price": "price_point",
  ClickThru: "clickthrough",
  Clickthrough: "clickthrough",
  "Spend and Get": "spend_and_get",
  "Spend & Get": "spend_and_get",
};

function toIsoDate(s: string): string {
  const t = Date.parse(s);
  if (isNaN(t)) return s;
  return new Date(t).toISOString().slice(0, 10);
}

export interface OfferEditPayload {
  id: string;
  offerName: string;
  description: string;
  offerType: string;
  offerStatus: string;
  merchantId: string;
  merchantName: string;
  endDate: string;
  estimatedSavings: string;
  externalUrl: string;
  promoCode: string;
  termsAndConditions: string;
}

export function buildOfferEditPayload(
  offer: Offer,
  merchant: Pick<Merchant, "id" | "name" | "website">
): OfferEditPayload {
  return {
    id: offer.id,
    offerName: offer.name,
    description: `${offer.offerType} offer from ${merchant.name}, distributed via ${offer.channel}${offer.publisher ? ` (${offer.publisher})` : ""}.`,
    offerType: OFFER_TYPE_LABEL_TO_KEY[offer.offerType] ?? "clickthrough",
    offerStatus: offer.status,
    merchantId: merchant.id,
    merchantName: merchant.name,
    endDate: toIsoDate(offer.end),
    estimatedSavings: "",
    externalUrl: merchant.website ? `https://${merchant.website}` : "",
    promoCode: "",
    termsAndConditions: "",
  };
}

/** Writes the payload to the localStorage key the carousel reads on mount. */
export function stashOfferForEdit(payload: OfferEditPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("editOffer", JSON.stringify(payload));
  } catch {
    // localStorage may be disabled (private browsing) — gracefully skip.
  }
}
