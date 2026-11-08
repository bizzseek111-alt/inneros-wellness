/**
 * WEEBLY V10 — INTERNATIONAL EDITORIAL & TACTILE STUDIO DESIGN SYSTEM TOKENS
 *
 * Aesthetic Direction: "Sunlit Editorial Studio & Tactile Toybox"
 * - Combines editorial authority for parents, teachers, and ministries with
 *   warm, storybook-tactile playfulness for children.
 * - Distinct visual silhouettes across all 16 homepage sections (zero repeated card grids).
 * - WCAG 2.1 AA+ high-contrast pairings and reduced-motion/low-stimulation tokens.
 */

export const WEEBLY_V10_DESIGN_SYSTEM = {
  brand: {
    name: "Weebly",
    positioning: "WEEBLY — LEARN. CREATE. THINK. GROW.",
    tagline: "International-Grade AI Learning, Creation, Foundational Skills & Child Development",
    ageRange: "Ages 2–18",
    languages: ["English", "Urdu (اردو)", "Punjabi (پنجابی)"],
  },
  palette: {
    surfaces: {
      warmPaper: "#FAF7F2",
      sunlitCream: "#FFFDF8",
      linenCard: "#F3EFE6",
      inkStage: "#0F172A",
      midnightSlate: "#1E293B",
      sageSanctuary: "#ECFDF5",
      amberStudio: "#FFFBEB",
      indigoAtelier: "#EEF2FF",
      roseWarmth: "#FFF1F2",
    },
    ink: {
      primary: "#0F172A",
      secondary: "#334155",
      muted: "#64748B",
      onDark: "#F8FAFC",
    },
    borders: {
      hairline: "#E7E0D6",
      editorialInk: "#0F172A",
      subtleSlate: "#CBD5E1",
    },
    pillars: {
      learnWithAi: {
        name: "Learn with AI",
        accent: "#0D9488",
        surface: "#F0FDFA",
        border: "#5EEAD4",
        route: "/learning-method",
        appRoute: "/youth/journeys",
      },
      createWithAi: {
        name: "Create with AI",
        accent: "#D97706",
        surface: "#FFFBEB",
        border: "#FCD34D",
        route: "/ai-creator",
        appRoute: "/youth/creator",
      },
      foundationalSkills: {
        name: "Build Foundational Skills",
        accent: "#4F46E5",
        surface: "#EEF2FF",
        border: "#A5B4FC",
        route: "/brain-skills",
        appRoute: "/youth/skills-lab",
      },
      growWithSupport: {
        name: "Grow with Support",
        accent: "#E11D48",
        surface: "#FFF1F2",
        border: "#FDA4AF",
        route: "/inclusive-learning",
        appRoute: "/youth/passport",
      },
    },
  },
  typography: {
    displayScale: {
      hero: "clamp(2.5rem, 5vw + 1rem, 4.35rem)",
      sectionTitle: "clamp(1.85rem, 3vw + 0.5rem, 2.85rem)",
      editorialLead: "clamp(1.125rem, 1.2vw + 0.5rem, 1.35rem)",
    },
    multilingual: {
      en: "Inter, Plus Jakarta Sans, system-ui, sans-serif",
      ur: "Noto Nastaliq Urdu,Jameel Noori Nastaleeq, serif",
      pa: "Noto Nastaliq Urdu, Noto Sans Gurmukhi, serif",
    },
  },
  motion: {
    springSnappy: "cubic-bezier(0.22, 1, 0.36, 1)",
    springGentle: "cubic-bezier(0.16, 1, 0.3, 1)",
    reducedMotionRespect: "prefers-reduced-motion: reduce",
  },
  homepageArchitecture16: [
    { id: "01-hero", number: "01", title: "Learn. Create. Think. Grow.", silhouette: "Split Editorial Hero + Live Animated Character & Voice Stage" },
    { id: "02-the-problem", number: "02", title: "The Problem: Passive Screens vs. Active Growth", silhouette: "Editorial Contrast Manifesto (Evidence-Based, Non-Clinical)" },
    { id: "03-learning-journey", number: "03", title: "Watch → Learn → Play → Implement → Reflect", silhouette: "Connected 5-Stage Interactive Stepper & Live Storyboard" },
    { id: "04-four-ai-friends", number: "04", title: "Four Caring AI Friends (Kai, Mia, Lumi, Zayn)", silhouette: "Expressive Character Studio with Trilingual Voice Waveform" },
    { id: "05-ai-creator-academy", number: "05", title: "Flagship: AI Creator Academy", silhouette: "Interactive Child Game & Story Builder Workbench (5x5 Live Stage)" },
    { id: "06-age-pathways", number: "06", title: "Age-Based AI Pathways (Ages 5 to 16–18)", silhouette: "Interactive Age Scrubber with Sample Student Creations" },
    { id: "07-foundational-skills", number: "07", title: "Foundational Skills Lab", silhouette: "Interactive Transforming Pattern & Rule-Switch Puzzle" },
    { id: "08-six-learning-worlds", number: "08", title: "Six Illustrated Learning Worlds", silhouette: "Bento World Atlas Preserving All 6 Child Routes" },
    { id: "09-inclusive-learning", number: "09", title: "Inclusive Learning & Neurodiversity-Affirming Design", silhouette: "Live Adjustable Sensory, AAC & Reading Spacing Sandbox" },
    { id: "10-wellbeing-support", number: "10", title: "Child Wellbeing, Early Support & Safeguarding Boundaries", silhouette: "3-Tier Escalation Diagram (No AI Diagnosis Claims)" },
    { id: "11-ai-literacy", number: "11", title: "AI Literacy & Responsible AI Detective", silhouette: "Interactive Hallucination & Privacy Spotter Challenge" },
    { id: "12-parent-center", number: "12", title: "Parent & Family Center", silhouette: "Skills & Creations Passport Preview + Home Routine Bridge" },
    { id: "13-teacher-school", number: "13", title: "Teacher Studio & School Command Center", silhouette: "Dual-Tab Educator Assignment & Punjab Pilot Blueprint" },
    { id: "14-demo-center", number: "14", title: "Interactive 6-Role Demo Center", silhouette: "6 Role-Isolated Launchpad Cards with Fictional Data Badge" },
    { id: "15-safety-access", number: "15", title: "Safety, Offline PWA & Trilingual Access", silhouette: "Technical Trust Matrix (Low-Data, PWA, 1121 Oversight)" },
    { id: "16-final-cta", number: "16", title: "Begin Your Child's or School's Journey", silhouette: "High-Contrast Editorial Closing Banner" },
  ],
} as const;
