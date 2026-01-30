"use client";

/**
 * OfferDetailPreview - Based on mockup-studio OfferDetailPage
 *
 * This is the actual marketplace detail view used in the Web SDK.
 * Adapted for kigo-pro-dashboard Offer Preview Panel (P0.4).
 *
 * Source: kigo-top/apps/top/src/app/mockup-studio/components/sdk/OfferDetailPage.tsx
 */

import { Box, Container, Typography, IconButton, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Kigo color palette (matching mockup-studio)
const kigoColors = {
  white: "#FFFFFF",
  black: "#000000",
  charcoal: "#4A4A4A",
  gray100: "#E5E5E5",
  blueLighten35: "#E6E7FF",
};

export interface OfferDetailPreviewProps {
  title: string;
  merchant: string;
  discount: string;
  description?: string;
  terms?: string;
  imageUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  redemptionMethod?: string;
  validUntil?: string;
  promoCode?: string;
}

export function OfferDetailPreview({
  title,
  merchant,
  discount,
  description,
  terms,
  imageUrl,
  logoUrl,
  primaryColor = "#4B55FD",
  redemptionMethod = "Online",
  validUntil,
  promoCode,
}: OfferDetailPreviewProps) {
  return (
    <Box
      sx={{
        backgroundColor: kigoColors.white,
        minHeight: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Top Bar with Back Button */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor: kigoColors.white,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Container sx={{ py: 1, maxWidth: 1280 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              size="small"
              sx={{ border: `1px solid ${kigoColors.gray100}` }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{ border: `1px solid ${kigoColors.gray100}` }}
              >
                <ShareIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  border: `2px solid ${kigoColors.blueLighten35}`,
                }}
              >
                <FavoriteBorderIcon
                  fontSize="small"
                  sx={{ color: primaryColor }}
                />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Image */}
      <Box
        sx={{
          width: "100%",
          height: 140,
          backgroundColor: `${primaryColor}15`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: kigoColors.white,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {logoUrl || imageUrl ? (
            <img
              src={logoUrl || imageUrl}
              alt={title}
              style={{
                width: "80%",
                height: "80%",
                objectFit: "contain",
                borderRadius: "50%",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: 36,
                fontWeight: 700,
                color: primaryColor,
              }}
            >
              {merchant.charAt(0).toUpperCase()}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Container sx={{ py: 2, px: 2, maxWidth: 1280 }}>
        {/* Discount Badge */}
        <Box
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            backgroundColor: primaryColor,
            color: kigoColors.white,
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          {discount}
        </Box>

        {/* Title & Merchant */}
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: "28px",
            color: kigoColors.black,
            mb: 0.5,
          }}
        >
          {title || "Offer headline will appear here..."}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color: kigoColors.charcoal,
            mb: 2,
          }}
        >
          {merchant || "Merchant name"}
        </Typography>

        {/* Quick Info */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: kigoColors.charcoal }} />
            <Typography sx={{ fontSize: "12px", color: kigoColors.charcoal }}>
              {redemptionMethod}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: kigoColors.charcoal }} />
            <Typography sx={{ fontSize: "12px", color: kigoColors.charcoal }}>
              {validUntil || "Valid dates TBD"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Description */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "20px",
            color: kigoColors.black,
            mb: 1,
          }}
        >
          About this offer
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "20px",
            color: kigoColors.charcoal,
            mb: 2,
          }}
        >
          {description ||
            "Offer description will appear here. Provide details about what the customer gets."}
        </Typography>

        {/* Promo Code */}
        {promoCode && (
          <Box
            sx={{
              p: 1.5,
              backgroundColor: `${primaryColor}10`,
              borderRadius: "8px",
              border: `1px solid ${primaryColor}30`,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 600,
                color: primaryColor,
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Promo Code
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: primaryColor,
                fontFamily: "monospace",
              }}
            >
              {promoCode}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Terms */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "20px",
            color: kigoColors.black,
            mb: 1,
          }}
        >
          Terms & Conditions
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "18px",
            color: kigoColors.charcoal,
            mb: 2,
            whiteSpace: "pre-wrap",
          }}
        >
          {terms ||
            "• Valid on select items only\n• Cannot be combined with other offers\n• One use per customer\n• Subject to availability"}
        </Typography>

        {/* CTA Button */}
        <Box
          sx={{
            width: "100%",
            py: 1.5,
            backgroundColor: primaryColor,
            color: kigoColors.white,
            borderRadius: "20px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              opacity: 0.9,
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          Redeem {redemptionMethod}
        </Box>
      </Container>
    </Box>
  );
}

export default OfferDetailPreview;
