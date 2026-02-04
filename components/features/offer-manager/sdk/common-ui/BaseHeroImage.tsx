"use client";

/**
 * BaseHeroImage - Hero image with merchant logo overlay and favorite button
 *
 * Ported from: kigo-web-sdks/packages/common-ui/src/lib/base/baseHeroImage/BaseHeroImage.tsx
 *
 * Features:
 * - Banner image with semi-transparent color overlay
 * - Circular merchant logo at bottom-left overlapping the hero
 * - Favorite/heart button at top-right
 */

import { Box, IconButton, Skeleton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";

// Simple color extraction using canvas
function useImageDominantColor(
  imageUrl: string,
  fallbackColor: string = "#4B55FD"
): { color: string; loading: boolean } {
  const [color, setColor] = useState<string>(fallbackColor);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setLoading(false);
          return;
        }

        canvas.width = 10;
        canvas.height = 10;
        ctx.drawImage(img, 0, 0, 10, 10);

        const imageData = ctx.getImageData(0, 0, 10, 10).data;

        let r = 0,
          g = 0,
          b = 0;
        const pixelCount = imageData.length / 4;

        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
        }

        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        setColor(`rgb(${r}, ${g}, ${b})`);
      } catch {
        // Fallback to primary color on error
      }
      setLoading(false);
    };

    img.onerror = () => {
      setLoading(false);
    };

    // Use proxy URL for CORS
    const proxyUrl = imageUrl
      ? `https://d21s3enjdwswpd.cloudfront.net/?imageURL=${encodeURIComponent(imageUrl)}`
      : "";
    img.src = proxyUrl;
  }, [imageUrl]);

  return { color, loading };
}

export interface BaseHeroImageProps {
  heroImageUrl: string;
  imageUrl: string;
  imageDescription?: string;
  isLoadingImage?: boolean;
  fallbackColor?: string;
  primaryColor?: string;
}

export const BaseHeroImage = ({
  heroImageUrl,
  imageUrl,
  imageDescription,
  isLoadingImage,
  fallbackColor = "#4B55FD",
  primaryColor = "#4B55FD",
}: BaseHeroImageProps) => {
  const { color, loading } = useImageDominantColor(
    heroImageUrl || imageUrl,
    fallbackColor
  );

  if (isLoadingImage || loading) {
    return (
      <Box sx={{ position: "relative", mb: 4 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="180px"
          sx={{ borderRadius: "12px" }}
        />
      </Box>
    );
  }

  const hasHeroImage = !!heroImageUrl;

  return (
    <Box
      sx={{ position: "relative", mb: 4, pt: 1 }}
      data-testid="base-hero-image-container"
    >
      {/* Hero banner */}
      <Box
        sx={{
          width: "100%",
          height: "180px",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          backgroundColor: hasHeroImage ? "transparent" : `${color}30`,
        }}
        data-testid="base-hero-image-banner"
      >
        {/* Background image */}
        {hasHeroImage && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("${encodeURI(heroImageUrl)}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}

        {/* Color overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: hasHeroImage ? `${color}60` : `${color}30`,
          }}
        />

        {/* Favorite button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "white",
            border: `2px solid ${primaryColor}20`,
            width: 40,
            height: 40,
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          <FavoriteBorderIcon sx={{ color: primaryColor, fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Merchant logo circle - overlapping the hero */}
      <Box
        sx={{
          position: "absolute",
          bottom: -20,
          left: 16,
          backgroundColor: "white",
          borderRadius: "50%",
          width: "100px",
          height: "100px",
          overflow: "hidden",
          border: "3px solid #eaeaea",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-testid="base-hero-image-logo-container"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageDescription ?? "Merchant logo"}
            style={{
              width: "80%",
              height: "80%",
              objectFit: "contain",
            }}
            data-testid="base-hero-image-logo-img"
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${color}20`,
              fontSize: "32px",
              fontWeight: 700,
              color: color,
            }}
          >
            {imageDescription?.charAt(0).toUpperCase() || "M"}
          </Box>
        )}
      </Box>
    </Box>
  );
};
