// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Base colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Custom colors
        sidebar: "hsl(var(--sidebar))",
        'sidebar-foreground': "hsl(var(--sidebar-foreground))",
        'sidebar-border': "hsl(var(--sidebar-border))",
        'sidebar-ring': 'hsl(var(--sidebar-ring))',
        'chart-1': "hsl(var(--chart-1))",
        'chart-2': "hsl(var(--chart-2))",
        'chart-3': "hsl(var(--chart-3))",
        'chart-4': "hsl(var(--chart-4))",
        'chart-5': "hsl(var(--chart-5))",
        'chart-1-foreground': 'hsl(var(--chart-1-foreground))',
        'chart-2-foreground': 'hsl(var(--chart-2-foreground))',
        'chart-3-foreground': 'hsl(var(--chart-3-foreground))',
        'chart-4-foreground': 'hsl(var(--chart-4-foreground))',
        'chart-5-foreground': 'hsl(var(--chart-5-foreground))',

        // Component colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.border'),
      }),
      boxShadow: {
        'sidebar-ring': '0 0 0 1px hsl(var(--sidebar-ring))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "slide-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-down": "slide-down 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};