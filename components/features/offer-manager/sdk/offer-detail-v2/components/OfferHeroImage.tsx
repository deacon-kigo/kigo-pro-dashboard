"use client";

/**
 * OfferHeroImage - Hero banner with merchant logo overlay
 *
 * Ported from: kigo-web-sdks/packages/top-sdk/src/ui/components/features/offer/components/OfferHeroImage.tsx
 */

import { BaseHeroImage } from "../../common-ui";
import { usePreviewOffer } from "../PreviewOfferContext";

export const OfferHeroImage = () => {
  const offer = usePreviewOffer();

  return (
    <BaseHeroImage
      heroImageUrl={offer?.banner?.url || offer?.image?.url || ""}
      imageUrl={offer?.merchant?.image?.url ?? ""}
      imageDescription={offer?.merchant?.name ?? ""}
      // AddToWalletButtonIconButton is omitted for preview
    />
  );
};
