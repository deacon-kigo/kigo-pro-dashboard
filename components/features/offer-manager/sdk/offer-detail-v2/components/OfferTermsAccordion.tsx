"use client";

/**
 * OfferTermsAccordion - Terms & conditions accordion
 *
 * Simplified from: kigo-web-sdks/packages/top-sdk/src/ui/components/features/offer/components/OfferTermBase.tsx
 *
 * The original opens a modal; this version uses an inline accordion for preview.
 */

import { TextSnippet } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { Grid, AccordionItem } from "../../common-ui";
import { usePreviewOffer } from "../PreviewOfferContext";

export function OfferTermsAccordion() {
  const offer = usePreviewOffer();
  const [isOpen, setIsOpen] = useState(false);

  // Only show if there are terms
  if (!offer.conditions) {
    return null;
  }

  return (
    <Grid container sx={{ mt: 2 }} data-testid="offer-terms-grid">
      <Grid size={12} data-testid="offer-terms-grid-item">
        <AccordionItem
          title="Offer terms"
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        >
          <Box sx={{ py: 1 }}>
            <Typography
              variant="bodySm"
              sx={{
                color: (theme) => theme.palette.kigo?.charcoal || "#5A5858",
                whiteSpace: "pre-wrap",
              }}
              data-testid="offer-terms-content"
            >
              {offer.conditions}
            </Typography>
          </Box>
        </AccordionItem>
      </Grid>
    </Grid>
  );
}

/**
 * Alternative: Button-style terms link (matches SDK more closely)
 * This version shows a button that would open a modal in the real SDK
 */
export function OfferTermsButton() {
  const offer = usePreviewOffer();

  if (!offer.conditions) {
    return null;
  }

  return (
    <Grid container sx={{ mt: 2 }} data-testid="offer-terms-base-grid">
      <Grid data-testid="offer-terms-base-grid-item">
        <Button
          variant="link"
          startIcon={<TextSnippet />}
          sx={{
            cursor: "default", // Preview only
          }}
          data-testid="offer-terms-base-button"
        >
          Offer terms
        </Button>
      </Grid>
    </Grid>
  );
}
