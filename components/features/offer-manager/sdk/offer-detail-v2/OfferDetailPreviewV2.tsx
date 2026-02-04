"use client";

/**
 * OfferDetailPreviewV2 - SDK-accurate offer detail preview
 *
 * Matches the actual Kigo Web SDK offer detail view styling.
 */

import { Box, ThemeProvider, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState, useEffect } from "react";
import { createKigoTheme } from "../theme/kigoTheme";
import { PreviewOfferProvider, usePreviewOffer } from "./PreviewOfferContext";
import { mapFormDataToOffer, OfferFormData } from "./mapFormDataToOffer";

export interface OfferDetailPreviewV2Props {
  formData: OfferFormData;
  primaryColor?: string;
  className?: string;
}

// Color extraction hook
function useImageColor(imageUrl: string, fallback: string) {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = 10;
        canvas.height = 10;
        ctx.drawImage(img, 0, 0, 10, 10);
        const data = ctx.getImageData(0, 0, 10, 10).data;
        let r = 0,
          g = 0,
          b = 0;
        const count = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        setColor(
          `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`
        );
      } catch {}
    };
    const proxy = `https://d21s3enjdwswpd.cloudfront.net/?imageURL=${encodeURIComponent(imageUrl)}`;
    img.src = proxy;
  }, [imageUrl]);

  return color;
}

// Internal content component
function OfferDetailContent({ primaryColor }: { primaryColor: string }) {
  const offer = usePreviewOffer();
  const [termsOpen, setTermsOpen] = useState(false);

  // Image sources (4 total)
  const offerImage = offer.image?.url || "";
  const merchantLogo = offer.merchant?.image?.url || "";
  const offerBanner = offer.banner?.url || "";
  const merchantBanner = offer.merchant?.banner?.url || "";

  // Production fallback logic:
  // Circle Image (Logo): OfferImage || MerchantLogo || OfferBanner || MerchantBanner
  const logoUrl = offerImage || merchantLogo || offerBanner || merchantBanner;

  // Hero Banner: OfferBanner || MerchantBanner || OfferImage || MerchantLogo
  const heroUrl = offerBanner || merchantBanner || offerImage || merchantLogo;

  const dominantColor = useImageColor(heroUrl || logoUrl, primaryColor);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Return to Home */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.5 }}
      >
        <ArrowBackIcon sx={{ color: primaryColor, fontSize: 20 }} />
        <Typography
          sx={{ color: primaryColor, fontSize: "14px", fontWeight: 500 }}
        >
          Return to Home
        </Typography>
      </Box>

      {/* Hero Section */}
      <Box sx={{ px: 2, position: "relative", mb: 5 }}>
        <Box
          sx={{
            width: "100%",
            height: "180px",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
            backgroundColor: heroUrl ? "transparent" : `${dominantColor}30`,
          }}
        >
          {/* Background image */}
          {heroUrl && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("${heroUrl}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          {/* Color overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: heroUrl
                ? `${dominantColor}60`
                : `${dominantColor}30`,
            }}
          />
          {/* Favorite button */}
          <IconButton
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "white",
              border: `2px solid ${primaryColor}30`,
              width: 44,
              height: 44,
              "&:hover": { backgroundColor: "white" },
            }}
          >
            <FavoriteBorderIcon sx={{ color: primaryColor }} />
          </IconButton>
        </Box>

        {/* Logo circle */}
        <Box
          sx={{
            position: "absolute",
            bottom: -24,
            left: 24,
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "white",
            border: "3px solid #eaeaea",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={offer.merchant?.name || "Logo"}
              style={{ width: "80%", height: "80%", objectFit: "contain" }}
            />
          ) : (
            <Typography
              sx={{ fontSize: 32, fontWeight: 700, color: dominantColor }}
            >
              {(offer.merchant?.name || "M").charAt(0).toUpperCase()}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 2, flex: 1 }}>
        {/* Title */}
        <Typography
          variant="h1"
          sx={{
            fontSize: "24px",
            fontWeight: 800,
            lineHeight: "32px",
            color: "#000",
            mb: 0.5,
          }}
        >
          {offer.description || "Offer title"}
        </Typography>

        {/* Estimated savings */}
        {offer.estimated_savings && (
          <Typography
            sx={{
              color: primaryColor,
              fontSize: "16px",
              fontWeight: 600,
              mb: 1.5,
            }}
          >
            ${offer.estimated_savings} estimated savings
          </Typography>
        )}

        {/* Merchant */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          {logoUrl && (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid #f6f5f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={logoUrl}
                alt=""
                style={{ width: 20, height: 20, objectFit: "contain" }}
              />
            </Box>
          )}
          <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
            {offer.merchant_name || "Merchant"}
          </Typography>
        </Box>

        {/* Description */}
        {offer.merchant?.stub_copy && (
          <Typography
            sx={{ fontSize: "14px", lineHeight: "20px", color: "#000", mb: 2 }}
          >
            {offer.merchant.stub_copy.length > 80 ? (
              <>
                {offer.merchant.stub_copy.slice(0, 80)}...{" "}
                <Box
                  component="span"
                  sx={{
                    color: primaryColor,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Read more
                </Box>
              </>
            ) : (
              offer.merchant.stub_copy
            )}
          </Typography>
        )}

        {/* About */}
        {offer.max_discount && offer.max_discount > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#5A5858",
                mb: 0.5,
              }}
            >
              About
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "#000" }}>
              Maximum Discount $
              {offer.max_discount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </Typography>
          </Box>
        )}

        {/* Terms */}
        {offer.conditions && (
          <Box sx={{ mt: 2 }}>
            <Box
              onClick={() => setTermsOpen(!termsOpen)}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              <Typography
                sx={{ fontSize: "14px", fontWeight: 600, color: "#5A5858" }}
              >
                Offer terms
              </Typography>
              <Box
                sx={{
                  ml: 0.5,
                  transform: termsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </Box>
            </Box>
            {termsOpen && (
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#5A5858",
                  mt: 1,
                  whiteSpace: "pre-wrap",
                }}
              >
                {offer.conditions}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* CTA */}
      <Box
        sx={{
          backgroundColor: "white",
          px: 2,
          pt: 2,
          pb: 3,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          boxShadow: "0px -10px 20px 0px #0000000A",
        }}
      >
        <Box
          sx={{
            backgroundColor: primaryColor,
            color: "white",
            borderRadius: "20px",
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          Redeem offer
        </Box>
      </Box>
    </Box>
  );
}

export function OfferDetailPreviewV2({
  formData,
  primaryColor = "#4B55FD",
  className,
}: OfferDetailPreviewV2Props) {
  const offer = mapFormDataToOffer(formData);
  const theme = createKigoTheme(primaryColor);

  return (
    <ThemeProvider theme={theme}>
      <PreviewOfferProvider offer={offer}>
        <Box className={className}>
          <OfferDetailContent primaryColor={primaryColor} />
        </Box>
      </PreviewOfferProvider>
    </ThemeProvider>
  );
}

export default OfferDetailPreviewV2;
