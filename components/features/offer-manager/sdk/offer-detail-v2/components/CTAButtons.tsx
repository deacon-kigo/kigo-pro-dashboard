"use client";

/**
 * CTAButtons - Sticky bottom CTA on mobile (visual only for preview)
 *
 * Ported from: kigo-web-sdks/packages/top-sdk/src/ui/components/features/offer/components/CTAButtons.tsx
 *
 * This is a visual-only preview version - clicking does nothing.
 * The actual SDK version has redemption logic and modals.
 */

import { Grid, Button } from "../../common-ui";
import { usePreviewOffer } from "../PreviewOfferContext";
import { getCtaButtonText } from "../mapFormDataToOffer";

export const CTAButtons = () => {
  const offer = usePreviewOffer();
  const buttonText = getCtaButtonText(offer.redemption_methods);

  // Mobile CTA style matching SDK
  return (
    <Grid
      container
      data-testid="cta-buttons-grid"
      spacing={1}
      sx={{
        backgroundColor: "white",
        px: 2,
        pt: 2,
        pb: 3,
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        boxShadow: "0px -10px 20px 0px #0000000A",
      }}
      id="cta-buttons-grid-mobile"
    >
      <Grid size={12}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "default", // Visual only preview
            "&:hover": {
              // Disable hover effect for preview
              backgroundColor: (theme) => theme.palette.primary.main,
            },
          }}
        >
          {buttonText}
        </Button>
      </Grid>
    </Grid>
  );
};
