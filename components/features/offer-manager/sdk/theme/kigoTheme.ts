"use client";

/**
 * Kigo Theme - Extended MUI theme matching the Web SDK
 *
 * Ported from: kigo-web-sdks/packages/common-ui/src/lib/theme/kigoMuiTheme.ts
 *
 * This provides the full Kigo theming system with:
 * - Kigo color palette (kigo.charcoal, kigo.white, kigo.blueLighten35, etc.)
 * - Typography variants (titleXl, titleMd, bodyMd, bodySmBold, etc.)
 * - z-index layers (layer3 for sticky CTA)
 * - Custom button variants (link, outlinedNeutral)
 */

import { createTheme, PaletteOptions } from "@mui/material/styles";
import React from "react";

// Typography variant configuration
interface CustomTypographyVariants {
  titleXl: React.CSSProperties;
  titleLg: React.CSSProperties;
  titleMd: React.CSSProperties;
  titleSm: React.CSSProperties;
  titleXs: React.CSSProperties;
  titleSmBd: React.CSSProperties;
  bodyMdBold: React.CSSProperties;
  bodySmBold: React.CSSProperties;
  bodyXsBold: React.CSSProperties;
  bodyMd: React.CSSProperties;
  bodySm: React.CSSProperties;
  bodyXs: React.CSSProperties;
}

// Extend MUI types
declare module "@mui/material/styles" {
  interface ButtonPropsVariantOverrides {
    link: true;
    outlinedNeutral: true;
  }

  interface TypographyVariants extends CustomTypographyVariants {}
  interface TypographyVariantsOptions extends Partial<CustomTypographyVariants> {}

  interface Palette {
    kigo: KigoColors;
  }
  interface PaletteOptions {
    kigo?: KigoColors;
  }

  interface ZIndex {
    layer3: number;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    link: true;
    outlinedNeutral: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    titleXl: true;
    titleLg: true;
    titleMd: true;
    titleSm: true;
    titleSmBd: true;
    titleXs: true;
    bodyMdBold: true;
    bodySmBold: true;
    bodyXsBold: true;
    bodyMd: true;
    bodySm: true;
    bodyXs: true;
  }
}

// Kigo color palette
// Reference: https://www.figma.com/design/kKMk2TgBvZ5ayc7gtYOC3t/Kigo%3A-Library?node-id=906-3129
type KigoColors = {
  white: string;
  black: string;
  black_grey: string;
  charcoal: string;
  stone: string;
  gray100: string;
  gray200: string;
  gray500: string;
  gray900: string;
  redLighten50: string;
  redLighten10: string;
  red: string;
  redDarken10: string;
  redDarken20: string;
  coral: string;
  orange: string;
  blue: string;
  blueLighten35: string;
  skyBlue: string;
  darkSkyBlue: string;
  green: string;
  green100: string;
  lightGreen: string;
  purple: string;
  lightPurple: string;
  gold: string;
  lightGold: string;
  error: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
};

const kigoColors: KigoColors = {
  white: "#FFFFFF",
  stone: "#f6f5f1",
  charcoal: "#5A5858",
  black: "#000000",
  black_grey: "#E9E9E9",
  gray100: "#E4E5E7",
  gray200: "#E5E7EB",
  gray500: "#717585",
  gray900: "#111827",
  redLighten50: "#FEECED",
  redLighten10: "#C63469",
  red: "#DC1021",
  redDarken10: "#AB0C1A",
  redDarken20: "#8E0916",
  coral: "#FF4F5E",
  orange: "#FF8717",
  blue: "#328FE5",
  blueLighten35: "#E6E7FF",
  skyBlue: "#25BDFE33",
  darkSkyBlue: "#25BDFE",
  green: "#41C37D",
  green100: "#6ADFA0",
  lightGreen: "#41C37D33",
  purple: "#8941EB",
  lightPurple: "#8941EB33",
  gold: "#DCA824",
  lightGold: "#DCA82433",
  error: {
    main: "#F44336",
    light: "#FFE7E6",
    dark: "#D32F2F",
    contrastText: "#FFFFFF",
  },
};

// Default typography configuration
const defaultTypography = {
  fontFamily: '"Inter", sans-serif',
  titleFontFamily: '"Inter", sans-serif',
  titleXl: {
    fontFamily: '"Inter"',
    fontSize: "50px",
    fontWeight: 800,
    letterSpacing: "0px",
    lineHeight: "50px",
  },
  titleLg: {
    fontFamily: '"Inter"',
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "0px",
    lineHeight: "40px",
  },
  titleMd: {
    fontFamily: '"Inter"',
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "0px",
    lineHeight: "28px",
  },
  titleSmBd: {
    fontFamily: '"Inter"',
    fontSize: "16px",
    fontWeight: 800,
    letterSpacing: "0px",
    lineHeight: "24px",
  },
  titleSm: {
    fontFamily: '"Inter"',
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0px",
    lineHeight: "20px",
  },
  titleXs: {
    fontFamily: '"Inter"',
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0px",
    lineHeight: "20px",
  },
  bodyMdBold: {
    fontFamily: '"Inter"',
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0px",
    lineHeight: "20px",
  },
  bodyMd: {
    fontFamily: '"Inter"',
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: "0px",
    lineHeight: "20px",
  },
  bodySmBold: {
    fontFamily: '"Inter"',
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0px",
    lineHeight: "16px",
  },
  bodySm: {
    fontFamily: '"Inter"',
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "0px",
    lineHeight: "16px",
  },
  bodyXsBold: {
    fontFamily: '"Inter"',
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0px",
    lineHeight: "16px",
  },
  bodyXs: {
    fontFamily: '"Inter"',
    fontSize: "10px",
    fontWeight: 400,
    letterSpacing: "0px",
    lineHeight: "16px",
  },
};

// Breakpoints matching SDK
export const breakpoints = {
  values: {
    xs: 0,
    sm: 420,
    md: 640,
    lg: 768,
    xl: 1025,
  },
};

// Z-index layers
const zIndex = {
  background: 0,
  layer1: 1,
  layer2: 2,
  layer3: 3,
  mapControls: 1000,
  header: 1100,
  modal: 1200,
  modalControls: 1300,
  sticky: 2000,
  alwaysOnTop: 9999,
};

export const maxWidth = (breakpoint: keyof typeof breakpoints.values) =>
  `@media (max-width: ${breakpoints.values[breakpoint]}px)`;

// Create Kigo palette options
function createKigoPaletteOptions(primaryColor: string): PaletteOptions {
  return {
    error: {
      main: kigoColors.red,
      dark: kigoColors.redDarken10,
    },
    common: {
      black: kigoColors.black,
      white: kigoColors.white,
    },
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: "#CCFFFE",
    },
    text: {
      primary: kigoColors.black,
      secondary: kigoColors.charcoal,
      disabled: kigoColors.charcoal,
    },
    kigo: kigoColors,
  };
}

/**
 * Create a Kigo MUI theme
 */
export function createKigoTheme(primaryColor: string = "#4B55FD") {
  const kigoPaletteOptions = createKigoPaletteOptions(primaryColor);

  return createTheme({
    breakpoints: breakpoints,
    palette: kigoPaletteOptions,
    typography: {
      fontFamily: defaultTypography.fontFamily,
      titleXl: defaultTypography.titleXl,
      titleLg: defaultTypography.titleLg,
      titleMd: defaultTypography.titleMd,
      titleSmBd: defaultTypography.titleSmBd,
      titleSm: defaultTypography.titleSm,
      titleXs: defaultTypography.titleXs,
      bodyMdBold: defaultTypography.bodyMdBold,
      bodyMd: defaultTypography.bodyMd,
      bodySmBold: defaultTypography.bodySmBold,
      bodySm: defaultTypography.bodySm,
      bodyXsBold: defaultTypography.bodyXsBold,
      bodyXs: defaultTypography.bodyXs,
    },
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: {
            border: "none",
            width: "100%",
            boxShadow: "none",
            "& .MuiAccordionSummary-root": {
              padding: "0",
            },
            "& .MuiAccordionDetails-root": {
              padding: "0",
            },
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow:
              "0px 2px 2px -1px rgba(27, 35, 44, 0.04), 0px 8px 16px -2px rgba(27, 36, 44, 0.12)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            [maxWidth("md")]: {
              margin: 0,
              borderRadius: 0,
              width: "100%",
              maxWidth: "100%",
            },
            margin: "10px",
            width: "calc(100% - 20px)",
            maxHeight: "calc(100% - 20px)",
            borderRadius: 12,
          },
          root: {
            "& .MuiDialog-container": {
              alignItems: "flex-start",
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            color: kigoPaletteOptions.kigo?.charcoal,
            fontWeight: 400,
            "&.Mui-selected": {
              fontWeight: 600,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            height: 54,
            padding: "13px 32px",
            fontFamily: defaultTypography.fontFamily,
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "20px",
            textTransform: "none",
          },
        },
        variants: [
          {
            props: { variant: "link" },
            style: ({ theme }) => ({
              color: theme.palette.primary.main,
              padding: 0,
              height: "auto",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }),
          },
          {
            props: { variant: "outlined" },
            style: ({ theme }) => ({
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            }),
          },
          {
            props: { variant: "outlinedNeutral" },
            style: ({ theme }) => ({
              color: theme.palette.kigo.gray900,
              border: `1px solid ${theme.palette.kigo.gray200}`,
              fontWeight: 400,
            }),
          },
        ],
      },
    },
    zIndex: zIndex,
  });
}

// Default Kigo theme
export const kigoTheme = createKigoTheme();

// Export colors for direct access
export { kigoColors };
