"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // Blue-600 to match existing Tailwind theme
    },
    secondary: {
      main: "#6b7280", // Gray-500
    },
  },
  typography: {
    fontFamily: "inherit", // Use the existing font family from Tailwind
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          // Remove default button base styles to work better with existing design
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    },
  },
});

interface MaterialUIProviderProps {
  children: ReactNode;
}

export const MaterialUIProvider = ({ children }: MaterialUIProviderProps) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
