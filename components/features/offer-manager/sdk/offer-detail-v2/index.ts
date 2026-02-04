/**
 * Offer Detail V2 - SDK-accurate offer detail preview
 */

export { OfferDetailPreviewV2 } from "./OfferDetailPreviewV2";
export type { OfferDetailPreviewV2Props } from "./OfferDetailPreviewV2";

export {
  mapFormDataToOffer,
  getRedemptionMethodText,
  getCtaButtonText,
} from "./mapFormDataToOffer";
export type { OfferFormData } from "./mapFormDataToOffer";

export { PreviewOfferProvider, usePreviewOffer } from "./PreviewOfferContext";
export type { PreviewOffer } from "./PreviewOfferContext";
