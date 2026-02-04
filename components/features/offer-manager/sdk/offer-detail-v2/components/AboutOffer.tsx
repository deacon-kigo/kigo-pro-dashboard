"use client";

/**
 * AboutOffer - Max discount display section
 *
 * Ported from: kigo-web-sdks/packages/top-sdk/src/ui/components/features/offer/components/AboutOffer.tsx
 */

import { Typography } from "@mui/material";
import { Grid } from "../../common-ui";
import { usePreviewOffer } from "../PreviewOfferContext";

const convertToCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const AboutOffer = () => {
  const offer = usePreviewOffer();

  // Only show if there's a max discount
  if (!offer.max_discount || offer.max_discount === 0) {
    return null;
  }

  return (
    <Grid container spacing={1} sx={{ mt: 2 }} data-testid="about-offer-grid">
      <Grid size={12} data-testid="about-offer-grid-item">
        <Typography
          variant="bodyMdBold"
          sx={{ color: (theme) => theme.palette.kigo?.charcoal || "#5A5858" }}
          data-testid="about-offer-title"
        >
          About
        </Typography>
      </Grid>
      <Grid size={12} data-testid="about-offer-grid-item">
        <Typography
          component="div"
          variant="bodyMd"
          sx={{ color: (theme) => theme.palette.kigo?.black || "#000" }}
          data-testid="about-offer-max-discount"
        >
          Maximum Discount {convertToCurrency(offer.max_discount)}
        </Typography>
      </Grid>
    </Grid>
  );
};
