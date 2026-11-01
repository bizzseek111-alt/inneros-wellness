/**
 * InnerOS Design System Tokens
 * Master token specifications for typography, colors, elevations, radiuses, and motion.
 */

export const tokens = {
  colors: {
    // Midnight Blue (Foundational Dark Canvas & Depths)
    midnight: {
      950: "#04070D", // Deepest canvas void
      900: "#070B14", // Primary dark canvas
      850: "#0B111E", // Dark elevated surface
      800: "#101828", // Card surface in dark
      700: "#1A253A", // Subtle dark border
      600: "#273752", // Active state border
      500: "#3B4E70", // Muted dark text
    },

    // Soft Indigo (Contemplation, Depth & Evening Rest)
    indigo: {
      900: "#181E36",
      800: "#222B4C",
      700: "#2E3B66",
      600: "#3D4E85",
      500: "#4F64AA",
      400: "#687DC2",
      300: "#8B9CD6",
      200: "#B4C1EA",
      100: "#DCE3F6",
      50: "#F2F5FC",
    },

    // Muted Lavender (Ethereal Clarity, Self-Reflection & Nuance)
    lavender: {
      900: "#232130",
      800: "#36334A",
      700: "#4D4968",
      600: "#69648D",
      500: "#8983B3",
      400: "#A9A4CF",
      300: "#C4C0E3",
      200: "#DDD9F0",
      100: "#EFEBF8",
      50: "#F9F7FC",
    },

    // Warm Ivory & Alabaster (Light Canvas, Gentle Warmth & Human Touch)
    ivory: {
      900: "#262420",
      800: "#3B3833",
      700: "#59544D",
      600: "#7E776D",
      500: "#A8A094",
      400: "#C8C1B5",
      300: "#E3DDD3",
      200: "#EFEBE3",
      100: "#F6F3EE",
      50: "#FAF8F5", // Pristine warm light canvas
    },

    // Restrained Teal (Calm Breath, Autonomic Nervous System Regulation & Centeredness)
    teal: {
      900: "#0D2523",
      800: "#133734",
      700: "#1B4D49",
      600: "#266863",
      500: "#348680",
      400: "#4BA59E",
      300: "#6EC2BC",
      200: "#9CDBD6",
      100: "#CEEFEB",
      50: "#EBF8F6",
    },

    // Functional Sanctuary Semantic Colors
    functional: {
      crisisRose: {
        dark: "#7F1D1D",
        medium: "#BE123C",
        light: "#F43F5E",
        bg: "rgba(190, 18, 60, 0.12)",
      },
      warningAmber: {
        dark: "#78350F",
        medium: "#B45309",
        light: "#F59E0B",
        bg: "rgba(245, 158, 11, 0.12)",
      },
      successSage: {
        dark: "#143E2C",
        medium: "#1F6D4F",
        light: "#34D399",
        bg: "rgba(52, 211, 153, 0.12)",
      },
    },
  },

  typography: {
    fontFamilies: {
      serif: '"Newsreader", "Playfair Display", "Cormorant Garamond", Georgia, serif',
      sans: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
    },
    scale: {
      "2xs": { size: "0.6875rem", lineHeight: "1rem", letterSpacing: "0.04em" }, // 11px
      xs: { size: "0.75rem", lineHeight: "1.125rem", letterSpacing: "0.02em" }, // 12px
      sm: { size: "0.8125rem", lineHeight: "1.25rem", letterSpacing: "0.01em" }, // 13px
      base: { size: "0.9375rem", lineHeight: "1.5rem", letterSpacing: "0em" }, // 15px
      md: { size: "1.0625rem", lineHeight: "1.625rem", letterSpacing: "-0.01em" }, // 17px
      lg: { size: "1.25rem", lineHeight: "1.75rem", letterSpacing: "-0.015em" }, // 20px
      xl: { size: "1.5rem", lineHeight: "2rem", letterSpacing: "-0.02em" }, // 24px
      "2xl": { size: "1.875rem", lineHeight: "2.375rem", letterSpacing: "-0.025em" }, // 30px
      "3xl": { size: "2.375rem", lineHeight: "2.875rem", letterSpacing: "-0.03em" }, // 38px
      "4xl": { size: "3rem", lineHeight: "3.5rem", letterSpacing: "-0.035em" }, // 48px
    },
  },

  radius: {
    none: "0px",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    full: "9999px",
  },

  elevations: {
    subtle: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)",
    surface: "0 4px 20px -2px rgba(0, 0, 0, 0.18), 0 2px 6px -1px rgba(0, 0, 0, 0.08)",
    elevated: "0 12px 36px -4px rgba(0, 0, 0, 0.28), 0 4px 12px -2px rgba(0, 0, 0, 0.14)",
    floating: "0 24px 64px -12px rgba(0, 0, 0, 0.42), 0 8px 24px -4px rgba(0, 0, 0, 0.22)",
  },

  motion: {
    ease: {
      fluid: [0.16, 1, 0.3, 1], // Apple-grade natural deceleration
      meditative: [0.33, 1, 0.68, 1],
      breathe: [0.45, 0, 0.55, 1],
    },
    duration: {
      instant: 100,
      micro: 180,
      standard: 300,
      deliberate: 500,
      meditative: 800,
      breathCycle: 6000,
    },
  },
} as const;

export type ThemeMode = "dark" | "light";
export type DesignDirection = "serene-luxury" | "warm-futurism" | "minimal-eq";
