"use client";

/**
 * OfferHeader - Title, estimated savings, merchant info, description
 *
 * Ported from: kigo-web-sdks/packages/top-sdk/src/ui/components/features/offer/components/OfferHeader.tsx
 */

import { Box, Typography } from "@mui/material";
import { Grid, ReadMore, TokenMerchantBase } from "../../common-ui";
import { usePreviewOffer } from "../PreviewOfferContext";

export const OfferHeader = () => {
  const offer = usePreviewOffer();

  return (
    <Box
      sx={{
        // Add top padding to account for the logo overlapping the hero
        pt: 3,
      }}
      data-testid="offer-header-container"
    >
      <Grid
        container
        spacing={1}
        data-testid="offer-header-grid"
        id="offer-header-grid"
      >
        {/* Offer title - large bold */}
        <Grid size={12} data-testid="offer-header-grid-item">
          <Typography
            variant="titleMd"
            component="h1"
            sx={{
              fontSize: "24px",
              fontWeight: 800,
              lineHeight: "32px",
              color: "#000",
            }}
            data-testid="offer-header-title"
          >
            {offer?.description ?? "Offer title"}
          </Typography>
        </Grid>

        {/* Estimated savings - primary color */}
        {offer?.estimated_savings && (
          <Grid size={12} data-testid="offer-header-grid-item">
            <Typography
              sx={{
                color: "primary.main",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "24px",
              }}
              data-testid="offer-header-savings"
            >
              ${offer.estimated_savings} estimated savings
            </Typography>
          </Grid>
        )}

        {/* Merchant info - logo and name */}
        <Grid size={12} sx={{ mt: 1 }} data-testid="offer-header-grid-item">
          <TokenMerchantBase
            merchantName={offer?.merchant_name ?? ""}
            merchantImageUrl={offer?.merchant?.image?.url ?? ""}
          />
        </Grid>

        {/* Description with Read more */}
        {offer?.merchant?.stub_copy && (
          <Grid size={12} sx={{ mt: 1 }} data-testid="offer-header-grid-item">
            <ReadMore
              content={offer.merchant.stub_copy}
              truncateLengths={{ large: 120, medium: 80, small: 60 }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
