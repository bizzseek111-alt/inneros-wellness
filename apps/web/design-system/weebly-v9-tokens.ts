/**
 * WEEBLY V9 — INTERNATIONAL BRAND & DESIGN SYSTEM TOKENS
 *
 * Brand Essence:
 * "A calm, intelligent, joyful world where children talk, learn, create, play
 *  and grow — supported by trusted adults."
 *
 * Designed for dual-environment harmony:
 *  - Child Magic World: warm ivory & soft sky, tactile cards, generous targets (64–88px),
 *    low cognitive load, expressive companion accents.
 *  - Adult Operational Studio: crisp ivory & deep ink/navy, clear data hierarchy,
 *    calm emerald/sky indicators, zero diagnostic/clinical alarmism.
 */

export const WEEBLY_V9_PALETTE = {
  // Primary Canvas & Surfaces
  canvasWarm: "#FAF7F2", // Warm Ivory / Soft Off-White
  canvasPure: "#FFFFFF",
  canvasLavender: "#EDE9FE", // Soft Lavender Tint
  canvasSky: "#E0F2FE", // Soft Sky Blue Tint
  canvasMint: "#D1FAE5", // Soft Mint / Sage Tint
  canvasPeach: "#FFEDD5", // Soft Peach / Coral Tint
  canvasSun: "#FEF3C7", // Warm Yellow Highlight Tint

  // Deep Editorial Ink & Neutrals
  inkPrimary: "#0F172A", // Deep Midnight Ink (Primary Text & Adult Shell)
  inkSecondary: "#334155", // Slate 700 (Body Copy)
  inkMuted: "#64748B", // Slate 500 (Captions & Metadata)
  borderSubtle: "#E2E8F0",
  borderWarm: "#E7E0D6",

  // Semantic & Action Accents
  brandIndigo: "#4F46E5", // Trustworthy Interactive Primary
  brandViolet: "#7C3AED", // Creative / Companion Accent
  brandEmerald: "#10B981", // Growth, Progress & Verified State
  brandSky: "#0284C7", // Calm Voice & Discovery
  brandAmber: "#F59E0B", // Selective Warm Highlight (used sparingly)
  brandCoral: "#F97316", // Playful Energy Accent
  brandRose: "#E11D48", // Safeguarding / Urgent Escalation Only
} as const;

export const WEEBLY_V9_COMPANION_TOKENS = {
  kai: {
    id: "kai",
    name: "Kai",
    role: "Explorer & Problem-Solving Guide",
    tagline: "Brave quests, numbers, patterns, and outdoor action",
    primary: "#0D9488",
    surface: "#CCFBF1",
    ring: "#5EEAD4",
    accentGradient: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
  },
  mia: {
    id: "mia",
    name: "Mia",
    role: "Storyteller & Creative Companion",
    tagline: "Imaginative stories, drawing, music, and bilingual vocabulary",
    primary: "#DB2777",
    surface: "#FCE7F3",
    ring: "#F9A8D4",
    accentGradient: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
  },
  lumi: {
    id: "lumi",
    name: "Lumi",
    role: "Calm, Feelings & Gentle Support",
    tagline: "Mindful breathing, sensory comfort, and emotional naming",
    primary: "#7C3AED",
    surface: "#EDE9FE",
    ring: "#C4B5FD",
    accentGradient: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
  },
  zayn: {
    id: "zayn",
    name: "Zayn",
    role: "Curiosity, Coding & Everyday Skills",
    tagline: "How technology works, logic puzzles, and helpful daily habits",
    primary: "#D97706",
    surface: "#FEF3C7",
    ring: "#FCD34D",
    accentGradient: "linear-gradient(135deg, #F59E0B 0%, #10B981 100%)",
  },
} as const;

export const WEEBLY_V9_LEARNING_WORLDS = [
  {
    id: "learning-quest",
    title: "Learning Quest",
    subtitle: "Reading, Numbers, Science & Logic",
    description:
      "Adaptive literacy, phonics, mental math bridges, and everyday science experiments guided by voice.",
    mentor: "kai" as const,
    ageBands: ["3–5", "6–9", "10–12", "13–16"],
    color: "#0284C7",
    bgTint: "#E0F2FE",
    borderTint: "#BAE6FD",
    href: "/youth/play?world=learning-quest",
    samplePrompt: "Kai, let's solve a rocket bridge math puzzle!",
    skills: ["Phonics & Vocabulary", "Number Sense", "Scientific Curiosity"],
  },
  {
    id: "creative-studio",
    title: "Creative Studio",
    subtitle: "Drawing, Stories, Music & Maker Prompts",
    description:
      "Finger-painting canvas, co-created bilingual storybooks, rhythm pads, and offline craft challenges.",
    mentor: "mia" as const,
    ageBands: ["3–5", "6–9", "10–12", "13–16"],
    color: "#DB2777",
    bgTint: "#FCE7F3",
    borderTint: "#FBCFE8",
    href: "/creative-studio",
    samplePrompt: "Mia, let's invent a story about a flying Rickshaw in Lahore!",
    skills: ["Visual Expression", "Narrative Building", "Musical Rhythm"],
  },
  {
    id: "sports-movement",
    title: "Sports & Movement",
    subtitle: "Balance, Coordination & Offline Active Play",
    description:
      "60-second movement breaks, footwork timers, stretching routines, and team sportsmanship challenges.",
    mentor: "kai" as const,
    ageBands: ["3–5", "6–9", "10–12", "13–16"],
    color: "#059669",
    bgTint: "#D1FAE5",
    borderTint: "#A7F3D0",
    href: "/youth/play?world=sports-movement",
    samplePrompt: "Kai, give me a 60-second agility and balance challenge!",
    skills: ["Gross Motor Balance", "Active Screen Breaks", "Teamwork"],
  },
  {
    id: "cartoon-story-world",
    title: "Interactive Story World",
    subtitle: "Choice-Based Moral & Empathy Adventures",
    description:
      "Branching illustrated episodes where children choose how characters share, resolve conflicts, and help friends.",
    mentor: "mia" as const,
    ageBands: ["3–5", "6–9", "10–12"],
    color: "#7C3AED",
    bgTint: "#EDE9FE",
    borderTint: "#DDD6FE",
    href: "/youth/play?world=cartoon-story-world",
    samplePrompt: "Mia, open the story where two friends want the same toy.",
    skills: ["Perspective Taking", "Listening Comprehension", "Bilingual Dialogue"],
  },
  {
    id: "tech-coding-world",
    title: "Tech & Coding World",
    subtitle: "Sequencing, Patterns & Safe Digital Citizenship",
    description:
      "Visual step-by-step command blocks, pattern debugging, and age-appropriate lessons on how AI works.",
    mentor: "zayn" as const,
    ageBands: ["6–9", "10–12", "13–16"],
    color: "#D97706",
    bgTint: "#FEF3C7",
    borderTint: "#FDE68A",
    href: "/youth/play?world=tech-coding-world",
    samplePrompt: "Zayn, how do we program the robot to cross the river?",
    skills: ["Algorithmic Thinking", "Pattern Debugging", "Digital Safety"],
  },
  {
    id: "life-skills-feelings",
    title: "Life Skills & Feelings",
    subtitle: "Calm Breathing, Visual Routines & Kindness",
    description:
      "Gentle balloon breathing, visual morning/bedtime schedules, emotion check-ins, and family appreciation.",
    mentor: "lumi" as const,
    ageBands: ["3–5", "6–9", "10–12", "13–16"],
    color: "#4F46E5",
    bgTint: "#E0E7FF",
    borderTint: "#C7D2FE",
    href: "/youth/play?world=life-skills-feelings",
    samplePrompt: "Lumi, can we do three slow balloon breaths together?",
    skills: ["Emotional Naming", "Daily Independence", "Self-Regulation"],
  },
] as const;

export const WEEBLY_V9_TYPOGRAPHY = {
  fontFamilyDisplay: "'Plus Jakarta Sans', 'Nunito', 'Inter', system-ui, -apple-system, sans-serif",
  fontFamilyBody: "'Inter', system-ui, -apple-system, sans-serif",
  fontFamilyChild: "'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif",
  fontFamilyUrdu: "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', 'Geeza Pro', serif",
  scale: {
    heroDisplay: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
    sectionTitle: "clamp(1.875rem, 3vw + 0.75rem, 3rem)",
    subsectionTitle: "clamp(1.35rem, 2vw + 0.5rem, 2rem)",
    bodyLarge: "1.125rem",
    bodyRegular: "1rem",
    caption: "0.875rem",
  },
} as const;

export const WEEBLY_V9_MOTION = {
  springGentle: "cubic-bezier(0.22, 1, 0.36, 1)",
  springPlayful: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  durationFast: "180ms",
  durationNormal: "280ms",
  durationSlow: "450ms",
} as const;

export const WEEBLY_V9_TOUCH_TARGETS = {
  childPrimaryButtonMinPx: 64,
  childHeroOrbMinPx: 88,
  adultControlMinPx: 44,
} as const;
