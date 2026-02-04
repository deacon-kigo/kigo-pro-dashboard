"use client";

/**
 * Button - Kigo button component with loading state
 *
 * Ported from: kigo-web-sdks/packages/common-ui/src/lib/components/button/Button.tsx
 */

import { ButtonProps, Button as MuiButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { loading?: boolean }
>((props, ref) => {
  const { loading, children, ...rest } = props;
  return (
    <MuiButton ref={ref} {...rest}>
      {loading ? (
        <CircularProgress
          aria-label="loading"
          role="status"
          sx={{ color: (theme) => theme.palette?.kigo?.white }}
          size={20}
        />
      ) : (
        children
      )}
    </MuiButton>
  );
});

Button.displayName = "Button";
