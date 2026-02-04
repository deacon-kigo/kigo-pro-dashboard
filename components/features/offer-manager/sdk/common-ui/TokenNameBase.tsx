"use client";

/**
 * TokenNameBase - Typography wrapper for offer/token title
 *
 * Ported from: kigo-web-sdks/packages/common-ui/src/lib/base/tokenDetails/TokenNameBase.tsx
 */

import { Typography } from "@mui/material";
import { Grid } from "./Grid";

export function TokenNameBase({ name }: { name: string }) {
  return (
    <Grid container data-testid="token-name-base-grid">
      <Grid size={12} data-testid="token-name-base-grid-item">
        <Typography
          variant="titleMd"
          data-testid="token-name-base-typography"
          component="h1"
        >
          {name}
        </Typography>
      </Grid>
    </Grid>
  );
}
