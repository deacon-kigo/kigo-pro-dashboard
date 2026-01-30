"use client";

/**
 * MerchantOfferButton - Copied from mockup-studio Web SDK
 *
 * This is the actual marketplace card component used in the Web SDK.
 * Copied to kigo-pro-dashboard for use in Offer Preview Panel (P0.4).
 *
 * Source: kigo-top/apps/top/src/app/mockup-studio/components/sdk/MerchantOfferButton.tsx
 */

import { useState } from "react";
import {
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Skeleton,
  Typography,
  useMediaQuery,
  Theme,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

// Kigo color palette (matching mockup-studio)
const kigoColors = {
  white: "#FFFFFF",
  black: "#000000",
  charcoal: "#4A4A4A",
  gray100: "#E5E5E5",
  purple: "#9851F2",
  blueLighten35: "#E6E7FF",
};

export interface MerchantOfferButtonProps {
  id?: string;
  bannerUrl?: string;
  logoUrl?: string;
  title: string;
  subTitle: string;
  isFeatured?: boolean;
  isInWallet?: boolean;
  onClick?: () => void;
  onAddToWalletClick?: () => void;
  primaryColor?: string;
  distanceFromUser?: number;
}

export function MerchantOfferButton({
  id,
  bannerUrl,
  logoUrl,
  title,
  subTitle,
  isFeatured = false,
  isInWallet = false,
  onClick,
  onAddToWalletClick,
  primaryColor = "#4B55FD",
  distanceFromUser,
}: MerchantOfferButtonProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("xl"));

  // Card dimensions based on breakpoint
  const cardWidth = isDesktop ? "173.3px" : "150.8px";

  // Truncate title to 38 chars
  const displayTitle = title.length > 38 ? `${title.slice(0, 38)}...` : title;

  const handleWalletClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWalletClick && !isInWallet) {
      setIsWalletLoading(true);
      onAddToWalletClick();
      setTimeout(() => setIsWalletLoading(false), 500);
    }
  };

  const imageUrl = bannerUrl || logoUrl;
  const showSkeleton = !imageLoaded && !imageError && imageUrl;

  return (
    <ButtonBase
      disableRipple
      onClick={onClick}
      sx={{
        width: cardWidth,
        minWidth: cardWidth,
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        overflow: "hidden",
        p: 1,
        textAlign: "left",
        position: "relative",
        transition: "none",
        "&:focus-visible": {
          outline: "2px solid #1976d2",
          outlineOffset: "2px",
        },
        "&:active": {
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          width: "100%",
          height: 120,
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          backgroundColor: imageUrl ? "transparent" : `${primaryColor}15`,
        }}
      >
        {showSkeleton && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{
              borderRadius: "12px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        )}

        {imageUrl && !imageError ? (
          <Box
            component="img"
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "12px",
              display: imageLoaded ? "block" : "none",
            }}
          />
        ) : (
          /* Fallback: Logo circle with colored background */
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${primaryColor}15`,
              borderRadius: "12px",
            }}
          >
            {logoUrl && !imageError ? (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: kigoColors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  component="img"
                  src={logoUrl}
                  alt={title}
                  sx={{
                    width: "70%",
                    height: "70%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: kigoColors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  color: primaryColor,
                }}
              >
                {title.charAt(0).toUpperCase()}
              </Box>
            )}
          </Box>
        )}

        {/* Wallet Icon - overlapping bottom of image */}
        <Box
          onClick={handleWalletClick}
          sx={{
            position: "absolute",
            bottom: -16,
            left: "50%",
            transform: "translateX(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: kigoColors.white,
            border: "1px solid #EAEAEA",
            boxShadow: "0px 6.67px 13.33px 0px #410B181A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isInWallet ? "default" : "pointer",
            zIndex: 2,
          }}
        >
          {isWalletLoading ? (
            <CircularProgress size={20} sx={{ color: primaryColor }} />
          ) : isInWallet ? (
            <FavoriteIcon sx={{ fontSize: 20, color: primaryColor }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 20, color: primaryColor }} />
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ pt: 3, px: 0.5, width: "100%" }}>
        {/* Featured Badge */}
        {isFeatured && (
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
            label="Featured"
            size="small"
            sx={{
              backgroundColor: "rgba(152, 81, 242, 0.1)",
              color: kigoColors.purple,
              height: 22,
              fontSize: 12,
              borderRadius: "8px",
              mb: 0.5,
              "& .MuiChip-icon": {
                color: kigoColors.purple,
                marginLeft: "4px",
              },
              "& .MuiChip-label": {
                padding: "0 6px 0 2px",
              },
            }}
          />
        )}

        {/* Merchant Name */}
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "16px",
            color: kigoColors.charcoal,
            mb: 0.25,
          }}
        >
          {subTitle}
        </Typography>

        {/* Offer Title */}
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "20px",
            color: kigoColors.black,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            minHeight: "40px",
          }}
        >
          {displayTitle}
        </Typography>

        {/* Distance (if provided) */}
        {distanceFromUser !== undefined && distanceFromUser > 0 && (
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              lineHeight: "16px",
              color: kigoColors.charcoal,
              mt: 0.5,
            }}
          >
            {distanceFromUser} miles
          </Typography>
        )}
      </Box>
    </ButtonBase>
  );
}

export default MerchantOfferButton;
