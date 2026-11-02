/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./design-system/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Newsreader"', '"Playfair Display"', '"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', '"Inter"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.4" }],     // 14px minimum (no microscopic 10-12px)
        sm: ["0.9375rem", { lineHeight: "1.5" }],    // 15px
        base: ["1.0625rem", { lineHeight: "1.65" }], // 17px comfortable reading body
        lg: ["1.1875rem", { lineHeight: "1.6" }],    // 19px
        xl: ["1.375rem", { lineHeight: "1.45" }],    // 22px
        "2xl": ["1.6875rem", { lineHeight: "1.35" }],// 27px
        "3xl": ["2.125rem", { lineHeight: "1.25" }], // 34px
        "4xl": ["2.625rem", { lineHeight: "1.2" }],  // 42px
      },
      colors: {
        // Warm Human Minimalism Core Tokens
        canvas: {
          DEFAULT: "#FFFBF7",
          warm: "#FAF8F4",
          subtle: "#F3EFE8",
          card: "#FFFFFF",
          elevated: "#FCFBF9",
        },
        sage: {
          50: "#F4F8F5",
          100: "#E5F1E8", // Pale sage primary token
          200: "#D0E3D7",
          300: "#A8CBB5",
          400: "#78AC8D",
          500: "#4D8B68",
          600: "#376F50",
          700: "#285B55", // Primary accent
          800: "#1F4742",
          900: "#173632",
        },
        peach: {
          50: "#FDF8F6",
          100: "#F9E5DC", // Warm peach primary token
          200: "#EED0C6",
          300: "#E0B0A0",
          400: "#CE8A74",
          500: "#B86B52",
          600: "#9A523B",
          700: "#7D402D",
        },
        lavender: {
          50: "#F7F5FA",
          100: "#EEE7FA", // Soft lilac primary token
          200: "#DCD3EC",
          300: "#C2B3DF",
          400: "#A38ECF",
          500: "#856BB8",
          600: "#6B519E",
          700: "#553E82",
          800: "#423166",
          900: "#31254C",
        },
        sky: {
          50: "#F3F9FD",
          100: "#E4F1FA", // Soft sky blue primary token
          200: "#C5E2F5",
          500: "#3A7CA5",
          700: "#235372",
        },
        // Dribbble AI Mental Wellness Platform Tokens (Imran Hossen)
        wellness: {
          blue: "#2B4CDE",
          blueDark: "#1E3A8A",
          blueLight: "#EEF4FF",
          blueBorder: "#DCE7FE",
          mint: "#ECFDF5",
          mintText: "#059669",
          mintBorder: "#A7F3D0",
          lavender: "#F5F3FF",
          lavenderText: "#7C3AED",
          lavenderBorder: "#DDD6FE",
          rose: "#FFF1F2",
          roseText: "#E11D48",
          roseBorder: "#FECDD3",
          amber: "#FFFBEB",
          amberText: "#D97706",
          amberBorder: "#FDE68A",
          canvas: "#F8FAFC",
          canvasIce: "#F0F5FF",
          slate: "#0F172A",
          slateMuted: "#64748B",
        },
        accent: {
          DEFAULT: "#2B4CDE", // Royal therapeutic blue
          hover: "#1E3A8A",
          light: "#EEF4FF",
          subtle: "#DCE7FE",
        },
        ink: {
          DEFAULT: "#263330", // Primary text (11.2:1 contrast on #FAF8F4)
          secondary: "#52625E", // Accessible muted charcoal (5.6:1 contrast)
          muted: "#6E7E7A",
          border: "#E4E0D8",
        },
        // Remapped Legacy Tokens to Light-First Warm Equivalents for Seamless Cohesiveness
        midnight: {
          950: "#FAF8F4",
          900: "#FFFFFF",
          850: "#F6F3EC",
          800: "#FFFFFF",
          700: "#E8E3D9",
          600: "#D5CFC2",
          500: "#52625E",
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
          950: "#E8F1EB",
          900: "#DCEAE1",
          800: "#B8D5C4",
          700: "#285B55",
          600: "#285B55",
          500: "#2F6B64",
          400: "#285B55",
          300: "#1F4742",
          200: "#183834",
          100: "#E8F1EB",
          50: "#F4F8F5",
        },
        indigo: {
          950: "#EDE8F5",
          900: "#E4DDF0",
          800: "#C9BBE2",
          700: "#553E82",
          600: "#553E82",
          500: "#6B519E",
          400: "#553E82",
          300: "#423166",
          200: "#31254C",
          100: "#EDE8F5",
          50: "#F7F5FA",
        },
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(38, 51, 48, 0.05), 0 1px 4px -1px rgba(38, 51, 48, 0.03)",
        card: "0 4px 20px -2px rgba(38, 51, 48, 0.06), 0 1px 3px -1px rgba(38, 51, 48, 0.04)",
        elevated: "0 12px 32px -4px rgba(38, 51, 48, 0.09), 0 2px 8px -2px rgba(38, 51, 48, 0.04)",
      },
      borderRadius: {
        "2xl": "1.125rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
