/**
 * Font loading for Remotion compositions.
 * Uses @remotion/google-fonts for consistent rendering.
 */
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily, waitUntilDone } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export { fontFamily, waitUntilDone };

export const fontStyles = {
  heading: {
    fontFamily,
    fontWeight: 700 as const,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  subheading: {
    fontFamily,
    fontWeight: 600 as const,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },
  body: {
    fontFamily,
    fontWeight: 400 as const,
    lineHeight: 1.5,
  },
  label: {
    fontFamily,
    fontWeight: 500 as const,
    lineHeight: 1.3,
    letterSpacing: "0.02em",
    textTransform: "uppercase" as const,
  },
} as const;
