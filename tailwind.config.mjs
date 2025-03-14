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
        primary: "#2563EB",
        "primary-dark": "#1D4ED8", 
        "primary-light": "#EFF6FF",
        "bg-light": "#F8FAFC",
        "text-dark": "#1E293B",
        "text-muted": "#64748B",
        "border-light": "#E2E8F0",
        // Pastel Colors
        "pastel-blue": "#E1F0FF",
        "pastel-purple": "#F3E8FF", 
        "pastel-green": "#DCFCE7",
        "pastel-yellow": "#FEF9C3",
        "pastel-orange": "#FFEDD5",
        "pastel-red": "#FEE2E2",
        "pastel-pink": "#FCE7F3",
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#2563EB",
          secondary: "#6366F1",
          accent: "#F59E0B",
          neutral: "#1E293B",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          "base-300": "#E2E8F0",
        },
      },
    ],
  },
} 