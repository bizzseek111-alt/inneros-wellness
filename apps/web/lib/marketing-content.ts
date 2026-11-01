/**
 * InnerOS Dynamic Marketing Content Architecture (CMS-Ready Typed Modules).
 * Centralizes configurable product features, trust pillars, pricing tiers,
 * and FAQ items for dynamic rendering and localization.
 */

export interface MarketingFeatureModule {
  id: string;
  badge: string;
  title: string;
  summary: string;
  route: string;
  surfaceColor: "sage" | "peach" | "lavender" | "sky";
  highlights: string[];
}

export interface MarketingPricingTier {
  id: string;
  name: string;
  priceLabel: string;
  cadence: string;
  description: string;
  isPopular?: boolean;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
}

export const MARKETING_FEATURE_MODULES: MarketingFeatureModule[] = [
  {
    id: "voice-companion",
    badge: "Voice & Text Presence",
    title: "Calm, Interruptible Voice & Text Conversations",
    summary:
      "Choose from five intentional conversation modes—Just Listen, Help Me Understand, Help Me Solve, Teach Me, or Help Me Settle—without unsolicited advice.",
    route: "/companion/voice",
    surfaceColor: "sage",
    highlights: [
      "Natural breath-paced voice cadence with instant interruption support",
      "Real-time warmth and directness sliders under your control",
      "Ephemeral session option when you want zero memory saved",
    ],
  },
  {
    id: "transparent-memory",
    badge: "User-Governed Memory",
    title: "Things I Remember & Interactive Life Graph",
    summary:
      "Every memory item distinguishes confirmed facts from tentative AI observations, with full provenance quotes, one-click editing, and instant GDPR deletion.",
    route: "/memory",
    surfaceColor: "lavender",
    highlights: [
      "Explicit staging workflow—confirm or reject suggested memories",
      "Visual Life Graph mapping roles, habits, triggers, and coping tools",
      "Global Pause Memory switch and instant JSON data export",
    ],
  },
  {
    id: "psychology-library",
    badge: "17-Department Library",
    title: "Evidence-Tiered Psychology & Somatic Exercises",
    summary:
      "Explore peer-reviewed psychoeducation across 17 departments—from cognitive reframing to vagal tone breathwork—clearly separated from pop-psychology.",
    route: "/knowledge",
    surfaceColor: "sky",
    highlights: [
      "Transparent evidence-quality badges and academic citations",
      "Guided breathwork and somatic grounding practices",
      "Strict non-clinical educational boundary",
    ],
  },
  {
    id: "gentle-routines",
    badge: "Anti-Guilt Pacing",
    title: "Personal Journal, Growth Intentions & Quiet-Hours Reminders",
    summary:
      "Reflect on daily moments, break personal intentions into small low-pressure steps, and schedule lock-screen-sanitized reminders that respect your rest.",
    route: "/journal",
    surfaceColor: "peach",
    highlights: [
      "Zero streak-shaming or manipulative engagement mechanics",
      "Automatic Quiet Hours and crisis reminder suppression",
      "Relational account sync with browser-to-account migration",
    ],
  },
];

export const MARKETING_PRICING_TIERS: MarketingPricingTier[] = [
  {
    id: "sanctuary-free",
    name: "Personal Sanctuary",
    priceLabel: "$0",
    cadence: "Forever free core access",
    description:
      "Essential text reflection, daily check-ins, personal journaling, and full privacy &crisis support.",
    ctaLabel: "Create Free Account",
    ctaHref: "/signup",
    features: [
      "5 intentional companion conversation modes",
      "Personal Journal & Daily Somatic Check-Ins",
      "17-Department Psychology Knowledge Library",
      "Full Memory Vault inspection, export & instant deletion",
      "24/7 global crisis helpline directory",
    ],
  },
  {
    id: "sanctuary-plus",
    name: "Living Presence Plus",
    priceLabel: "$14",
    cadence: "per month (preview tier)",
    description:
      "Unlimited real-time voice companion sessions, full Life Graph pattern explorer, and connected archive imports.",
    isPopular: true,
    ctaLabel: "Start Free Sanctuary",
    ctaHref: "/signup",
    features: [
      "Everything in Personal Sanctuary",
      "Unlimited Living Voice Companion (12 languages)",
      "Interactive Life Graph causal & mitigating edge explorer",
      "Staged OAuth & Markdown archive imports with PII scrubbing",
      "Custom Quiet Hours & lock-screen-sanitized routines",
    ],
  },
];
