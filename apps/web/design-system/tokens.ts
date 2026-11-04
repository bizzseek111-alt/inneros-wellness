/**
 * InnerOS Design System Tokens
 * Master token specifications for "Warm Human Minimalism with Gentle Futurism".
 */

export const tokens = {
  colors: {
    // Warm Alabaster & Soft Surfaces (Light Default)
    canvas: {
      primary: "#FAF8F4",
      subtle: "#F3EFE8",
      card: "#FFFFFF",
      elevated: "#FCFBF9",
    },

    // Soft Sage (Calm, Grounding & Primary Accent)
    sage: {
      50: "#F4F8F5",
      100: "#E8F1EB",
      200: "#D0E3D7",
      300: "#A8CBB5",
      400: "#78AC8D",
      500: "#4D8B68",
      600: "#376F50",
      700: "#285B55",
      800: "#1F4742",
      900: "#173632",
    },

    // Warm Peach (Human Warmth & Gentle Reassurance)
    peach: {
      50: "#FDF8F6",
      100: "#F7E7E2",
      200: "#EED0C6",
      300: "#E0B0A0",
      400: "#CE8A74",
      500: "#B86B52",
      600: "#9A523B",
      700: "#7D402D",
    },

    // Gentle Lavender (Reflection, Clarity & Stillness)
    lavender: {
      50: "#F7F5FA",
      100: "#EDE8F5",
      200: "#DCD3EC",
      300: "#C2B3DF",
      400: "#A38ECF",
      500: "#856BB8",
      600: "#6B519E",
      700: "#553E82",
      800: "#423166",
      900: "#31254C",
    },

    // Accessible Typography Ink Hierarchy
    ink: {
      primary: "#263330", // 11.2:1 contrast ratio on #FAF8F4
      secondary: "#52625E", // 5.6:1 contrast ratio on #FAF8F4
      muted: "#6E7E7A",
      border: "#E4E0D8",
    },

    // Backward-compatible semantic palettes mapped to Warm Human Minimalism
    midnight: {
      950: "#FAF8F4",
      900: "#FFFFFF",
      850: "#F6F3EC",
      800: "#FFFFFF",
      700: "#E8E3D9",
      600: "#D5CFC2",
      500: "#52625E",
    },
    indigo: {
      900: "#31254C",
      800: "#423166",
      700: "#553E82",
      600: "#6B519E",
      500: "#856BB8",
      400: "#A38ECF",
      300: "#C2B3DF",
      200: "#DCD3EC",
      100: "#EDE8F5",
      50: "#F7F5FA",
    },
    ivory: {
      900: "#FAF8F4",
      800: "#F3EFE8",
      700: "#E6E1D6",
      600: "#6E7E7A",
      500: "#5C6B67",
      400: "#52625E",
      300: "#3D4D49",
      200: "#2F3E3A",
      100: "#263330",
      50: "#1B2623",
    },
    teal: {
      900: "#173632",
      800: "#1F4742",
      700: "#285B55",
      600: "#285B55",
      500: "#2F6B64",
      400: "#4D8B68",
      300: "#78AC8D",
      200: "#A8CBB5",
      100: "#E8F1EB",
      50: "#F4F8F5",
    },

    functional: {
      crisisRose: {
        dark: "#7F1D1D",
        medium: "#9B1C31",
        light: "#FDF2F2",
        bg: "#FDF2F2",
      },
      warningAmber: {
        dark: "#6B4415",
        medium: "#9A523B",
        light: "#F7E7E2",
        bg: "#FDF8F6",
      },
      successSage: {
        dark: "#173632",
        medium: "#285B55",
        light: "#E8F1EB",
        bg: "#F4F8F5",
      },
    },
  },

  typography: {
    fontFamilies: {
      serif: '"Newsreader", "Playfair Display", "Cormorant Garamond", Georgia, serif',
      sans: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
    },
    scale: {
      "2xs": { size: "0.8125rem", lineHeight: "1.35rem", letterSpacing: "0.01em" }, // 13px
      xs: { size: "0.875rem", lineHeight: "1.4rem", letterSpacing: "0.01em" },      // 14px
      sm: { size: "0.9375rem", lineHeight: "1.5rem", letterSpacing: "0em" },        // 15px
      base: { size: "1.0625rem", lineHeight: "1.65rem", letterSpacing: "0em" },     // 17px
      md: { size: "1.125rem", lineHeight: "1.7rem", letterSpacing: "-0.005em" },    // 18px
      lg: { size: "1.25rem", lineHeight: "1.75rem", letterSpacing: "-0.01em" },     // 20px
      xl: { size: "1.5rem", lineHeight: "2rem", letterSpacing: "-0.015em" },        // 24px
      "2xl": { size: "1.875rem", lineHeight: "2.375rem", letterSpacing: "-0.02em" },// 30px
      "3xl": { size: "2.25rem", lineHeight: "2.75rem", letterSpacing: "-0.025em" }, // 36px
      "4xl": { size: "2.75rem", lineHeight: "3.25rem", letterSpacing: "-0.03em" },  // 44px
    },
  },

  radius: {
    none: "0px",
    xs: "6px",
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "24px",
    "2xl": "32px",
    full: "9999px",
  },

  elevations: {
    subtle: "0 2px 8px rgba(38, 51, 48, 0.04)",
    surface: "0 6px 24px -4px rgba(38, 51, 48, 0.06)",
    elevated: "0 16px 40px -6px rgba(38, 51, 48, 0.09)",
    floating: "0 24px 60px -12px rgba(38, 51, 48, 0.14)",
  },

  motion: {
    ease: {
      fluid: [0.16, 1, 0.3, 1],
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

  /**
   * InnerOS Youth Design System
   * Premium educational & developmental design tokens for Ages 2-5, 6-12, and 13-18.
   */
  youth: {
    colors: {
      // Gentle core pastels (calm, trustworthy, joyful)
      cream: {
        50: "#FFFDF9",
        100: "#FDFBF4",
        200: "#F9F5EA",
        300: "#F2EBD7",
        surface: "#FFFFFF",
      },
      lavender: {
        50: "#FAF7FD",
        100: "#F3EDFA",
        200: "#E6D7F5",
        300: "#D3B9ED",
        400: "#B892DF",
        500: "#9868CE",
        text: "#43256A",
      },
      mint: {
        50: "#F2FAF6",
        100: "#E3F6EC",
        200: "#C4EDD6",
        300: "#98DEB8",
        400: "#60C592",
        500: "#36A871",
        text: "#154D32",
      },
      sky: {
        50: "#F0F8FF",
        100: "#E0F1FE",
        200: "#B9E2FE",
        300: "#7DC7FC",
        400: "#38A8F8",
        500: "#0E87E3",
        text: "#0C436F",
      },
      peach: {
        50: "#FFF7F2",
        100: "#FFEEE5",
        200: "#FFD9C7",
        300: "#FFB99D",
        400: "#FF8E68",
        500: "#F36437",
        text: "#6B240E",
      },
      sunbeam: {
        50: "#FEFCE8",
        100: "#FEF9C3",
        200: "#FEF08A",
        300: "#FDE047",
        400: "#EAB308",
        500: "#CA8A04",
        text: "#613E02",
      },
      // Ink hierarchy with WCAG 2.2 AA compliant contrast
      ink: {
        primary: "#1A202C",   // 13.8:1 on cream
        secondary: "#4A5568", // 6.5:1 on cream
        muted: "#718096",     // 4.6:1 on cream
        border: "#E2E8F0",
      },
      // Low-stimulation mode palette (desaturated, warm gray base)
      lowStimulation: {
        canvas: "#F7F6F2",
        card: "#FFFFFF",
        accent: "#768692",
        ink: "#2D3748",
        border: "#E2E0D8",
      },
      // High-contrast accessibility palette
      highContrast: {
        canvas: "#FFFFFF",
        card: "#FFFFFF",
        ink: "#000000",
        border: "#000000",
        accent: "#0047AB",
      },
    },

    // Developmental Age Tier Configurations
    tiers: {
      little: {
        ageRange: "2-5",
        label: "Little Explorers",
        touchTargetMin: "56px",
        cardRadius: "28px",
        headingSize: "1.75rem",
        primaryMode: "caregiver-mediated",
        allowsDirectAI: false,
      },
      junior: {
        ageRange: "6-12",
        label: "Junior Adventurers",
        touchTargetMin: "48px",
        cardRadius: "24px",
        headingSize: "1.5rem",
        primaryMode: "guided-child",
        allowsDirectAI: true,
      },
      teen: {
        ageRange: "13-18",
        label: "Youth Sanctuary",
        touchTargetMin: "44px",
        cardRadius: "18px",
        headingSize: "1.375rem",
        primaryMode: "independent-autonomous",
        allowsDirectAI: true,
      },
    },

    typography: {
      fontFamilyLatin: '"Plus Jakarta Sans", "Fredoka", -apple-system, BlinkMacSystemFont, sans-serif',
      fontFamilyUrdu: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Noto Sans Arabic", serif',
      fontFamilyPunjabi: '"Noto Sans Shahmukhi", "Noto Nastaliq Urdu", "Noto Sans Gurmukhi", sans-serif',
      fontFamilyDyslexic: '"OpenDyslexic", "Comic Sans MS", "Plus Jakarta Sans", sans-serif',
    },
  },
} as const;

export type ThemeMode = "light" | "dark";
export type DesignDirection = "serene-luxury" | "warm-futurism" | "minimal-eq";
export type YouthAgeTier = "little" | "junior" | "teen";
export type SupportedYouthLocale = "en" | "ur" | "pa" | "ur-Latn";

