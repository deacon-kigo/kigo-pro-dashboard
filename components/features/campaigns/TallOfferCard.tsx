"use client";

import { useState } from "react";
import { Box, ButtonBase, CircularProgress, Typography } from "@mui/material";
import { Badge } from "@/components/atoms/Badge";

// First, let me create simplified versions of the components we need
const Grid = ({ children, ...props }: any) => {
  return (
    <div className="grid" {...props}>
      {children}
    </div>
  );
};

const TokenImageAutoBgBase = ({
  imageUrl,
  size,
}: {
  imageUrl: string;
  size: string;
}) => {
  const sizeClasses = {
    "large-tall": "w-full h-40 object-cover",
  };

  return (
    <img
      src={imageUrl}
      alt="Offer"
      className={
        sizeClasses[size as keyof typeof sizeClasses] ||
        "w-full h-32 object-cover"
      }
    />
  );
};

const CustomWalletIcon = ({
  isInWallet,
  customIconUrl,
}: {
  isInWallet?: boolean;
  customIconUrl?: string;
}) => {
  return (
    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
      <span className="text-white text-xs">+</span>
    </div>
  );
};

// Simple tag display for now - we'll enhance this later
const getDisplayTag = (offer: any) => {
  if (offer?.isFeatured) return { slug: "featured", name: "Featured" };
  return null;
};

const getTagComponent = (tag: any, options: any) => {
  if (tag?.slug === "featured") {
    return (
      <Badge variant="default" className="bg-purple-100 text-purple-700">
        ⭐ Featured
      </Badge>
    );
  }
  return null;
};

type TallOfferCardProps = {
  imageUrl: string;
  title: string;
  subTitle: string;
  additionalInfo: string;
  isAddedToWallet?: boolean;
  tags?: string[];
  onClick: () => void;
  distanceFromUser?: number;
  onAddToWalletClick?: (onSuccess: () => void) => void;
  customIconUrl?: string;
};

export const TallOfferCard = ({
  imageUrl,
  title,
  subTitle,
  additionalInfo,
  isAddedToWallet,
  tags,
  onClick,
  distanceFromUser,
  onAddToWalletClick,
  customIconUrl,
}: TallOfferCardProps) => {
  const [loading, setLoading] = useState(false);

  // Convert tags array to the format expected by getDisplayTag
  const offerWithTags = tags
    ? {
        tags: tags.map((tag) => ({ slug: tag, name: tag })),
        isFeatured: tags.includes("featured"),
      }
    : undefined;

  // Get the highest priority tag using the proper priority system
  const displayTag = offerWithTags ? getDisplayTag(offerWithTags) : undefined;

  // Use getTagComponent to render the appropriate tag component
  const SelectedTag = displayTag
    ? getTagComponent(displayTag, { isDark: true, hideHoverFX: true })
    : null;

  const handleAddToWallet = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setLoading(true);

    onAddToWalletClick?.(() => {
      setLoading(false);
    });
  };

  const handleRemoveFromWallet = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <ButtonBase
      disableRipple
      onClick={onClick}
      disabled={loading}
      sx={{
        width: 275,
        display: "flex",
        borderRadius: 5,
        flex: 1,
        overflow: "hidden",
        border: (theme) => `1px solid #e5e7eb`, // Tailwind gray-200 equivalent
        position: "relative",
      }}
    >
      {/* Render the highest priority tag if found */}
      {SelectedTag && (
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
          {SelectedTag}
        </Box>
      )}

      <Grid container sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <Grid xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 160,
              overflow: "hidden",
            }}
          >
            <TokenImageAutoBgBase imageUrl={imageUrl} size="large-tall" />
          </Box>
        </Grid>

        <Grid xs={12}>
          <Grid container sx={{ p: 2, gap: 1 }}>
            <Grid
              xs={9}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                textAlign: "left",
                height: "100px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: "40px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280", // Tailwind gray-500 equivalent
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "12px",
                }}
              >
                {subTitle}
              </Typography>

              {distanceFromUser !== undefined &&
                distanceFromUser !== null &&
                distanceFromUser > 0 && (
                  <Typography
                    component="div"
                    variant="body2"
                    sx={{
                      color: "#6b7280", // Tailwind gray-500 equivalent
                      fontSize: "12px",
                    }}
                  >
                    {distanceFromUser} miles
                  </Typography>
                )}

              <Typography
                sx={{
                  color: "#2563eb", // Tailwind blue-600 equivalent
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {additionalInfo}
              </Typography>
            </Grid>

            <Grid
              xs={3}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px solid #E6E7FF",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  boxSizing: "border-box",
                }}
                onClick={
                  isAddedToWallet ? handleRemoveFromWallet : handleAddToWallet
                }
              >
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : (
                  <CustomWalletIcon
                    isInWallet={isAddedToWallet}
                    customIconUrl={customIconUrl}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ButtonBase>
  );
};
