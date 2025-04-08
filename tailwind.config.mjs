/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kigo Brand Colors
        primary: "#4B55FD",
        secondary: "#CCFFFE",
        
        // Kigo Neutrals
        white: "#FFFFFF",
        stone: "#f6f5f1",
        charcoal: "#5A5858",
        black: "#231F20",
        "black-grey": "#E9E9E9",
        "gray-100": "#E4E5E7",
        "gray-200": "#E5E7EB",
        "gray-500": "#717585",
        "gray-900": "#111827",
        
        // Text & Background Colors
        "text-dark": "#231F20", // Using Kigo black
        "text-muted": "#5A5858", // Using Kigo charcoal
        "bg-light": "#F9FAFC", // Changed to requested light gray/blue
        "border-light": "#E4E5E7", // Using Kigo gray-100
        
        // Kigo Reds
        "red-light-50": "#FEECED",
        "red-light-10": "#C63469",
        red: "#DC1021",
        "red-dark-10": "#AB0C1A",
        "red-dark-20": "#8E0916",
        coral: "#FF4F5E",
        
        // Kigo Blues & Other Colors
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
        
        // CVS colors
        "cvs-blue": "#2563EB",
        "cvs-red": "#CC0000",
        
        // Retain existing pastel colors for specific use cases
        "pastel-blue": "#E1F0FF",
        "pastel-purple": "#F3E8FF", 
        "pastel-green": "#DCFCE7",
        "pastel-yellow": "#FEF9C3",
        "pastel-orange": "#FFEDD5",
        "pastel-red": "#FEE2E2",
        "pastel-pink": "#FCE7F3",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        // Mapping to Kigo type scale
        'xs': '10px',    // bodyXs
        'sm': '12px',    // bodySm
        'base': '14px',  // bodyMd
        'lg': '16px',    // titleSm
        'xl': '22px',    // titleMd
        '2xl': '32px',   // titleLg
        '3xl': '50px',   // titleXl
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      lineHeight: {
        tight: '16px',    // bodySm lineHeight
        snug: '20px',     // bodyMd lineHeight
        normal: '24px',   // titleSmBd lineHeight
        relaxed: '28px',  // titleMd lineHeight
        loose: '40px',    // titleLg lineHeight
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px', 
        'lg': '20px',
        'xl': '25px',
      },
      screens: {
        'sm': '420px',
        'md': '640px',
        'lg': '768px',
        'xl': '1025px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'popover': '0px 2px 2px -1px rgba(27, 35, 44, 0.04), 0px 8px 16px -2px rgba(27, 36, 44, 0.12)', // From Kigo's MuiPopover
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideInRight': 'slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slideInLeft': 'slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-slow': 'gridMove 20s linear infinite',
        'rainbow': 'rainbow 4s linear infinite',
        'rainbow-border': 'rainbowBorder 4s linear infinite',
        'spring': 'spring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        gridMove: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '100%': { transform: 'translateX(-50%) translateY(-50%)' },
        },
        rainbow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        rainbowBorder: {
          '0%': { borderColor: 'hsl(0, 85%, 60%)', boxShadow: '0 0 5px hsl(0, 85%, 60%)' },
          '20%': { borderColor: 'hsl(72, 85%, 60%)', boxShadow: '0 0 5px hsl(72, 85%, 60%)' },
          '40%': { borderColor: 'hsl(144, 85%, 60%)', boxShadow: '0 0 5px hsl(144, 85%, 60%)' },
          '60%': { borderColor: 'hsl(216, 85%, 60%)', boxShadow: '0 0 5px hsl(216, 85%, 60%)' },
          '80%': { borderColor: 'hsl(288, 85%, 60%)', boxShadow: '0 0 5px hsl(288, 85%, 60%)' },
          '100%': { borderColor: 'hsl(0, 85%, 60%)', boxShadow: '0 0 5px hsl(0, 85%, 60%)' },
        },
        spring: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '50%': { transform: 'scale(1.05)', opacity: 0.9 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#4B55FD", // Kigo primary color
          secondary: "#CCFFFE", // Kigo secondary color
          accent: "#FF8717", // Using Kigo orange as accent
          neutral: "#231F20", // Using Kigo black
          "base-100": "#FFFFFF", // Using Kigo white
          "base-200": "#f6f5f1", // Using Kigo stone
          "base-300": "#E4E5E7", // Using Kigo gray-100
        },
      },
    ],
  },
} 