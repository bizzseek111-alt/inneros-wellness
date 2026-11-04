/**
 * Weebly V4 Design System Tokens
 * Master visual specifications for "Kids Magic World & Warm Human Minimalism"
 */

export const WEEBLY_THEME = {
  brand: {
    name: "Weebly",
    tagline: "Voice-First Multilingual Learning for Young Minds",
    legalNotice: "COPPA & GDPR-K Scoped • Zero Persistent Behavioral Profiling",
  },
  colors: {
    // 5 Signature Pastel Hues
    mint: {
      50: "#F2FAF6",
      100: "#E3F6EC",
      200: "#C4EDD6",
      300: "#98DEB8",
      400: "#60C592",
      500: "#36A871",
      600: "#154D32",
    },
    lavender: {
      50: "#FAF7FD",
      100: "#EDE8F5",
      200: "#DCD3EC",
      300: "#C2B3DF",
      400: "#B892DF",
      500: "#9868CE",
      600: "#43256A",
    },
    peach: {
      50: "#FFF7F2",
      100: "#FFEEE5",
      200: "#FFD9C7",
      300: "#FFB99D",
      400: "#FF8E68",
      500: "#F36437",
      600: "#6B240E",
    },
    buttercup: {
      50: "#FEFCE8",
      100: "#FEF9C3",
      200: "#FEF08A",
      300: "#FDE047",
      400: "#EAB308",
      500: "#CA8A04",
      600: "#613E02",
    },
    sky: {
      50: "#F0F8FF",
      100: "#E0F1FE",
      200: "#B9E2FE",
      300: "#7DC7FC",
      400: "#38A8F8",
      500: "#0E87E3",
      600: "#0C436F",
    },
    // Warm Neutral Canvas
    canvas: {
      primary: "#FFFDF9",
      subtle: "#FAF8F4",
      elevated: "#FFFFFF",
      border: "#E2E8F0",
    },
    // Accessible WCAG 2.2 AA Ink
    ink: {
      primary: "#0F172A", // 15.1:1 on #FFFDF9
      secondary: "#334155", // 8.8:1 on #FFFDF9
      muted: "#64748B", // 4.8:1 on #FFFDF9
      inverted: "#FFFFFF",
    },
  },

  // 4 AI Companion Visual Identities
  characters: {
    kai: {
      id: "kai",
      name: "Kai",
      title: "Curious Learning Guide",
      specialty: "Homework, Tricky Questions & Math",
      accent: "#F59E0B",
      bgGradient: "from-amber-50 via-orange-50/60 to-amber-100/40",
      avatarBg: "bg-amber-100",
      pillClass: "bg-amber-100 text-amber-900 border-amber-200",
      emoji: "🦊",
    },
    mia: {
      id: "mia",
      name: "Mia",
      title: "Warm Creative Guide",
      specialty: "Bedtime Stories, Feelings & Empathy",
      accent: "#EC4899",
      bgGradient: "from-pink-50 via-rose-50/60 to-pink-100/40",
      avatarBg: "bg-pink-100",
      pillClass: "bg-pink-100 text-pink-900 border-pink-200",
      emoji: "🌸",
    },
    lumi: {
      id: "lumi",
      name: "Lumi",
      title: "Calm Gentle Guide",
      specialty: "Routines, Emotional Vocabulary & Calming",
      accent: "#10B981",
      bgGradient: "from-emerald-50 via-teal-50/60 to-emerald-100/40",
      avatarBg: "bg-emerald-100",
      pillClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
      emoji: "🐰",
    },
    zayn: {
      id: "zayn",
      name: "Zayn",
      title: "Energetic Explorer",
      specialty: "Science, Nature, Space & Puzzles",
      accent: "#0284C7",
      bgGradient: "from-sky-50 via-blue-50/60 to-sky-100/40",
      avatarBg: "bg-sky-100",
      pillClass: "bg-sky-100 text-sky-900 border-sky-200",
      emoji: "🚀",
    },
  },

  // 6 Original Gamified Learning Worlds
  learningWorlds: [
    {
      id: "feelings-garden",
      name: "Feelings Garden",
      character: "mia",
      themeColor: "#EC4899",
      bgGradient: "from-pink-50 via-rose-50 to-pink-100/60",
      emoji: "🌺",
      tagline: "Explore emotions, name your feelings, and cultivate empathy.",
      route: "/youth/emotions",
      skills: ["Emotional Naming", "Somatic Awareness", "Empathy Stories"],
    },
    {
      id: "story-forest",
      name: "Story Forest",
      character: "mia",
      themeColor: "#8B5CF6",
      bgGradient: "from-purple-50 via-indigo-50 to-purple-100/60",
      emoji: "🌲",
      tagline: "Listen to magical moral tales and soothing bedtime stories.",
      route: "/youth/stories",
      skills: ["Auditory Comprehension", "Moral Imagination", "Vocabulary"],
    },
    {
      id: "curiosity-lab",
      name: "Curiosity Lab",
      character: "zayn",
      themeColor: "#0284C7",
      bgGradient: "from-sky-50 via-blue-50 to-sky-100/60",
      emoji: "🔬",
      tagline: "Discover space mysteries, dinosaurs, and fun science experiments.",
      route: "/youth/activities?category=science_and_discovery",
      skills: ["Hypothesis Testing", "Animal Biology", "Planetary Science"],
    },
    {
      id: "memory-mountain",
      name: "Memory Mountain",
      character: "kai",
      themeColor: "#F59E0B",
      bgGradient: "from-amber-50 via-orange-50 to-amber-100/60",
      emoji: "⛰️",
      tagline: "Climb through 3,000 curriculum questions and fun math puzzles.",
      route: "/youth/activities?category=mathematics",
      skills: ["Working Memory", "Math Logic", "Pattern Recognition"],
    },
    {
      id: "calm-corner",
      name: "Calm Corner",
      character: "lumi",
      themeColor: "#10B981",
      bgGradient: "from-emerald-50 via-teal-50 to-emerald-100/60",
      emoji: "🌸",
      tagline: "Belly breaths, soft soothing chimes, and gentle sensory resets.",
      route: "/youth/support-center",
      skills: ["Somatic Self-Regulation", "Belly Breathing", "Sensory Grounding"],
    },
    {
      id: "friendship-village",
      name: "Friendship Village",
      character: "kai",
      themeColor: "#6366F1",
      bgGradient: "from-indigo-50 via-purple-50 to-indigo-100/60",
      emoji: "🏘️",
      tagline: "Daily routines, cooperative play, and real-life kindness habits.",
      route: "/youth/routines",
      skills: ["Visual Routines", "Cooperative Habits", "Sharing"],
    },
  ],

  // Animation Transitions for Motion for React
  motion: {
    springBouncy: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
    springSmooth: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
    fadeSlideUp: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -16 },
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
    pulseGlow: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
} as const;

export type LearningWorldId = (typeof WEEBLY_THEME.learningWorlds)[number]["id"];
