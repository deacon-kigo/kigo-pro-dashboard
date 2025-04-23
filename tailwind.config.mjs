/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        white: "#FFFFFF",
        stone: "#f6f5f1",
        charcoal: "#5A5858",
        black: "#231F20",
        "black-grey": "#E9E9E9",
        "gray-100": "#E4E5E7",
        "gray-200": "#E5E7EB",
        "gray-500": "#717585",
        "gray-900": "#111827",
        "text-dark": "#231F20",
        "text-muted": "#5A5858",
        "bg-light": "#F9FAFC",
        "border-light": "#E4E5E7",
        "red-light-50": "#FEECED",
        "red-light-10": "#C63469",
        red: "#DC1021",
        "red-dark-10": "#AB0C1A",
        "red-dark-20": "#8E0916",
        coral: "#FF4F5E",
        orange: "#FF8717",
        blue: "#328FE5",
        "blue-light-35": "#E6E7FF",
        "blue-50": "#EFF6FF",
        "sky-blue": "#CCFFFE",
        "dark-sky-blue": "#25BDFE",
        green: "#77D898",
        "green-100": "#6ADFA0",
        "light-green": "#D1F7DF",
        purple: "#8941EB",
        "light-purple": "#E5D7FA",
        "cvs-blue": "#2563EB",
        "cvs-red": "#CC0000",
        "pastel-blue": "#E1F0FF",
        "pastel-purple": "#F3E8FF",
        "pastel-green": "#DCFCE7",
        "pastel-yellow": "#FEF9C3",
        "pastel-orange": "#FFEDD5",
        "pastel-red": "#FEE2E2",
        "pastel-pink": "#FCE7F3",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: "10px",
        sm: "12px",
        base: "14px",
        lg: "16px",
        xl: "22px",
        "2xl": "32px",
        "3xl": "50px",
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      lineHeight: {
        tight: "16px",
        snug: "20px",
        normal: "24px",
        relaxed: "28px",
        loose: "40px",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "25px",
      },
      screens: {
        sm: "420px",
        md: "640px",
        lg: "768px",
        xl: "1025px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        popover:
          "0px 2px 2px -1px rgba(27, 35, 44, 0.04), 0px 8px 16px -2px rgba(27, 36, 44, 0.12)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideInRight: "slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        slideInLeft: "slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "grid-slow": "gridMove 20s linear infinite",
        rainbow: "rainbow 4s linear infinite",
        "rainbow-border": "rainbowBorder 4s linear infinite",
        spring: "spring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "spin-slow": "spin 8s linear infinite",
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        slideInRight: {
          "0%": {
            transform: "translateX(100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        slideInLeft: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        pulseSubtle: {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.8,
          },
        },
        gridMove: {
          "0%": {
            transform: "translateX(0) translateY(0)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-50%)",
          },
        },
        rainbow: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        rainbowBorder: {
          "0%": {
            borderColor: "hsl(0, 85%, 60%)",
            boxShadow: "0 0 5px hsl(0, 85%, 60%)",
          },
          "20%": {
            borderColor: "hsl(72, 85%, 60%)",
            boxShadow: "0 0 5px hsl(72, 85%, 60%)",
          },
          "40%": {
            borderColor: "hsl(144, 85%, 60%)",
            boxShadow: "0 0 5px hsl(144, 85%, 60%)",
          },
          "60%": {
            borderColor: "hsl(216, 85%, 60%)",
            boxShadow: "0 0 5px hsl(216, 85%, 60%)",
          },
          "80%": {
            borderColor: "hsl(288, 85%, 60%)",
            boxShadow: "0 0 5px hsl(288, 85%, 60%)",
          },
          "100%": {
            borderColor: "hsl(0, 85%, 60%)",
            boxShadow: "0 0 5px hsl(0, 85%, 60%)",
          },
        },
        spring: {
          "0%": {
            transform: "scale(0.8)",
            opacity: 0,
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: 0.9,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
        aurora: {
          "0%": {
            backgroundPosition: "0% 0%, 0% 0%",
          },
          "50%": {
            backgroundPosition: "100% 0%, 100% 0%",
          },
          "100%": {
            backgroundPosition: "0% 0%, 0% 0%",
          },
        },
      },
      transitionProperty: {
        width: "width",
        spacing: "margin, padding",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
