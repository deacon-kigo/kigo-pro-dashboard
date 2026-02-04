"use client";

/**
 * ReadMore - Truncate text with expand/collapse functionality
 *
 * Ported from: kigo-web-sdks/packages/common-ui/src/lib/components/readMore/ReadMore.tsx
 */

import {
  Box,
  Button,
  Theme,
  Typography,
  TypographyVariant,
  useMediaQuery,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

interface ReadMoreProps {
  content: string;
  truncateLengths?: {
    small: number;
    medium: number;
    large: number;
  };
  readMoreText?: string;
  readLessText?: string;
  variant?: "bodyMd" | "bodyMdBold" | TypographyVariant;
  fontAccentColor?: string;
}

const SMALL_TRUNCATE_LENGTH = 150;
const MEDIUM_TRUNCATE_LENGTH = 250;
const LARGE_TRUNCATE_LENGTH = 350;

export function ReadMore({
  content,
  truncateLengths = {
    small: SMALL_TRUNCATE_LENGTH,
    medium: MEDIUM_TRUNCATE_LENGTH,
    large: LARGE_TRUNCATE_LENGTH,
  },
  readMoreText = "Read more",
  readLessText = "Read less",
  variant = "bodyMd",
  fontAccentColor = undefined,
}: ReadMoreProps) {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const isMedium =
    useMediaQuery((theme: Theme) => theme.breakpoints.down("md")) && !isSmall;
  const isLarge = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const [isExpanded, setIsExpanded] = useState(false);

  const getTruncatedText = useCallback(
    (text: string) => {
      if (isExpanded) return text;

      if (isSmall) {
        return truncateText(text, truncateLengths.small);
      }
      if (isMedium) {
        return truncateText(text, truncateLengths.medium);
      }
      if (isLarge) {
        return truncateText(text, truncateLengths.large);
      }
      return text;
    },
    [isSmall, isMedium, isLarge, isExpanded, truncateLengths]
  );

  const showReadMoreButton = useMemo(() => {
    if (isSmall) {
      return content.length > truncateLengths.small;
    }
    if (isMedium) {
      return content.length > truncateLengths.medium;
    }
    if (isLarge) {
      return content.length > truncateLengths.large;
    }
    return false;
  }, [isSmall, isMedium, isLarge, content, truncateLengths]);

  return (
    <Box sx={{ display: "inline" }}>
      <Typography
        component="div"
        variant={variant}
        sx={{
          color: (theme) => theme.palette.kigo?.black || "#000",
          a: {
            color: (theme) => theme.palette.kigo?.black || "#000",
            fontWeight: "bold",
          },
          display: "inline",
        }}
        dangerouslySetInnerHTML={{
          __html: getTruncatedText(content),
        }}
      />
      {showReadMoreButton && (
        <Button
          disableRipple
          disableElevation
          disableTouchRipple
          disableFocusRipple
          variant="text"
          sx={{
            textTransform: "none",
            margin: 0,
            padding: 0,
            fontSize: "inherit",
            height: "inherit",
            verticalAlign: "baseline",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&:active": {
              backgroundColor: "transparent",
            },
            ...(fontAccentColor && { color: fontAccentColor }),
          }}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <Typography variant="bodyMdBold">
            &nbsp;{isExpanded ? readLessText : readMoreText}
          </Typography>
        </Button>
      )}
    </Box>
  );
}
