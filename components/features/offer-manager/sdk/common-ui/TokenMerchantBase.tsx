"use client";

/**
 * TokenMerchantBase - Merchant name and logo display
 *
 * Ported from: kigo-web-sdks/packages/common-ui/src/lib/base/tokenDetails/TokenMerchantBase.tsx
 */

import { Box, Typography } from "@mui/material";
import { Grid } from "./Grid";

export const TokenMerchantBase = ({
  merchantName,
  merchantImageUrl,
}: {
  merchantName?: string;
  merchantImageUrl?: string;
}) => {
  return (
    <Grid container alignItems="center" spacing={1}>
      {merchantImageUrl && (
        <Grid>
          <Box
            sx={{
              position: "relative",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: (theme) => `1px solid ${theme.palette.kigo.stone}`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "20px",
                height: "20px",
              }}
            >
              <img
                alt={`${merchantName} image` || "merchant image"}
                src={merchantImageUrl || ""}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        </Grid>
      )}
      {merchantName && (
        <Grid>
          <Typography variant="titleSm">{merchantName}</Typography>
        </Grid>
      )}
    </Grid>
  );
};
