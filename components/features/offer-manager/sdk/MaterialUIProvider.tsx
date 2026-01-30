"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Kigo theme matching Web SDK
const kigoTheme = createTheme({
  palette: {
    primary: {
      main: "#4B55FD",
    },
    secondary: {
      main: "#9851F2",
    },
    grey: {
      100: "#E5E5E5",
      200: "#EAEAEA",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

interface MaterialUIProviderProps {
  children: React.ReactNode;
}

export function MaterialUIProvider({ children }: MaterialUIProviderProps) {
  return (
    <ThemeProvider theme={kigoTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default MaterialUIProvider;
