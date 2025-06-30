"use client";

import { useState } from "react";
import {
  Box,
  ButtonBase,
  CircularProgress,
  Typography,
  Chip,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const CustomWalletIcon = ({
  isInWallet,
  customIconUrl,
}: {
  isInWallet?: boolean;
  customIconUrl?: string;
}) => {
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid #E6E7FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        "& svg path": {
          fill: "white",
        },
      }}
    >
      {customIconUrl ? (
        <img
          src={customIconUrl}
          alt="Wallet"
          style={{ width: 24, height: 24, filter: "brightness(0) invert(1)" }}
        />
      ) : (
        <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
          +
        </span>
      )}
    </Box>
  );
};

type DisplayBannerCardProps = {
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

export const DisplayBannerCard = ({
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
}: DisplayBannerCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleAddToWallet = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setLoading(true);
    onAddToWalletClick?.(() => {
      setLoading(false);
    });
  };

  const isFeatured = tags?.includes("featured");
  const isMobile = false; // Assuming desktop for now, can be made responsive later

  // Truncate text function to match the original
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const styles = {
    container: {
      borderRadius: "20px",
      height: "100%",
      width: "100%",
      minHeight: "150px",
      maxHeight: "150px",
      background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
      border: (theme: any) => `1px solid ${theme.palette.grey[200]}`,
    },
    contentWrapper: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: 2,
      position: "relative",
    },
    logoContainer: {
      paddingTop: isMobile ? "15px" : "20px",
      marginBottom: 1,
    },
    logoBox: {
      width: isMobile ? "45px" : "50px",
      height: isMobile ? "45px" : "50px",
      borderRadius: "50%",
      backgroundColor: "white",
      overflow: "hidden",
      padding: "8px",
    },
    logoImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      maxWidth: isMobile ? "200px" : "70%",
    },
    title: {
      textAlign: "left",
      mb: 0.5,
    },
    description: {
      textAlign: "left",
    },
    chipContainer: {
      position: "absolute",
      top: 10,
      left: 10,
    },
    addToWalletButton: {
      position: "absolute",
      bottom: 15,
      right: 15,
      border: "2px solid #E6E7FF",
      borderRadius: "50%",
      width: "48px",
      height: "48px",
      boxSizing: "border-box",
      zIndex: 2,
      cursor: isAddedToWallet ? "default" : "pointer",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    addToWalletButtonIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
  };

  return (
    <ButtonBase
      disableRipple
      onClick={onClick}
      disabled={loading}
      sx={styles.container}
      data-testid="display-banner-card"
    >
      <Box sx={styles.contentWrapper}>
        {/* Featured chip at top left */}
        {isFeatured && (
          <Box sx={styles.chipContainer}>
            <Chip
              icon={<AutoAwesomeIcon />}
              label="Featured"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                maxWidth: "none",
                color: "white",
                "& .MuiChip-label": {
                  overflow: "visible",
                },
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
              size="small"
            />
          </Box>
        )}

        {/* Logo container */}
        <Box sx={styles.logoContainer}>
          <Box sx={styles.logoBox}>
            <Box
              component="img"
              src={imageUrl} // Using the same image for logo for now - can be made configurable
              alt={subTitle}
              sx={styles.logoImage}
            />
          </Box>
        </Box>

        {/* Text content */}
        <Box sx={styles.textContainer}>
          <Typography
            variant="body2"
            color="white"
            sx={{
              ...styles.title,
              fontWeight: "bold",
              fontSize: isMobile ? "13px" : "14px",
              lineHeight: 1.2,
            }}
          >
            {subTitle}
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{
              ...styles.description,
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "bold",
              mt: 0.5,
            }}
          >
            {truncateText(title, isMobile ? 35 : 50)}
          </Typography>
          {distanceFromUser !== undefined &&
            distanceFromUser !== null &&
            distanceFromUser > 0 && (
              <Typography
                variant="body2"
                color="white"
                sx={{
                  fontSize: "11px",
                  mt: 0.5,
                }}
              >
                {distanceFromUser} miles
              </Typography>
            )}
        </Box>

        {/* Wallet button at bottom right */}
        <Box sx={styles.addToWalletButton} onClick={handleAddToWallet}>
          {loading ? (
            <Box sx={styles.addToWalletButtonIcon}>
              <CircularProgress size={20} sx={{ color: "white" }} />
            </Box>
          ) : (
            <Box sx={styles.addToWalletButtonIcon}>
              <CustomWalletIcon
                customIconUrl={customIconUrl}
                isInWallet={isAddedToWallet}
              />
            </Box>
          )}
        </Box>
      </Box>
    </ButtonBase>
  );
};
