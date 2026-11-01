/**
 * InnerOS Prototype State & Service Layer
 * Provides persistent local state, rich synthetic datasets (Persona Elena Vance),
 * GDPR Article 17 deletion, envelope encryption simulations, and prototype guardrails.
 */

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  valence: "reflective" | "calm" | "overwhelmed" | "grateful" | "restless";
  energyScore: number; // 1-10
  somaticFocus: string; // e.g. "Shoulders & chest tension"
  content: string;
  isEncrypted: boolean;
  tags: string[];
}

export interface GrowthGoal {
  id: string;
  horizonTitle: string;
  category: "boundaries" | "rest" | "presence" | "craft";
  intention: string;
  coreValue: string;
  status: "active" | "integrating" | "resting";
  reflectionNotes: string;
  milestones: Array<{ id: string; label: string; completed: boolean }>;
}

export interface ReminderSchedule {
  id: string;
  title: string;
  time: string;
  days: string[];
  type: "breath_pause" | "evening_unwind" | "morning_intention";
  prompt: string;
  channel: "in_app" | "browser_push";
  isActive: boolean;
}

export interface LifeGraphNode {
  id: string;
  label: string;
  type: "role" | "habit" | "stressor" | "core_value" | "relationship";
  description: string;
  emotionalCharge: "positive" | "neutral" | "challenging";
}

export interface LifeGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string; // e.g. "mitigates", "triggers", "anchors"
}

export interface UserConsentLedger {
  storeConversations: boolean;
  deriveLongTermMemory: boolean;
  voiceAudioProcessing: boolean;
  calendarIntegration: boolean;
  analyticsParticipation: boolean;
  updatedAt: string;
}

export interface PrototypeState {
  user: {
    id: string;
    name: string;
    preferredName: string;
    role: string;
    timezone: string;
    language: string; // "en" | "es" | "de" | "fr" | "ja" | "ar"
    direction: "ltr" | "rtl";
  };
  companionConfig: {
    voiceId: string;
    toneMode: "grounding" | "warm" | "concise" | "inquisitive";
    pacing: number; // 0.5 (deliberate) to 1.5 (brisk)
    warmthLevel: number; // 0.0 to 1.0
    brevityLevel: number; // 0.0 to 1.0
  };
  consent: UserConsentLedger;
  journal: JournalEntry[];
  goals: GrowthGoal[];
  reminders: ReminderSchedule[];
  lifeGraph: {
    nodes: LifeGraphNode[];
    edges: LifeGraphEdge[];
  };
  connectedApps: Array<{
    id: string;
    name: string;
    type: string;
    status: "connected" | "disconnected" | "scrubbing_pending";
    lastSync?: string;
  }>;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    suppressGentleAlerts: boolean;
  };
  safetyPlan: {
    groundingAnchor: string;
    trustedContact: string;
    soothingSensoryTool: string;
    personalBoundaryStatement: string;
  };
}

const INITIAL_PROTOTYPE_STATE: PrototypeState = {
  user: {
    id: "usr_synthetic_elena_vance_001",
    name: "Elena Vance",
    preferredName: "Elena",
    role: "Staff Product Designer",
    timezone: "America/Chicago (CST)",
    language: "en",
    direction: "ltr",
  },
  companionConfig: {
    voiceId: "voice_sanctuary_calm",
    toneMode: "grounding",
    pacing: 0.9,
    warmthLevel: 0.85,
    brevityLevel: 0.5,
  },
  consent: {
    storeConversations: true,
    deriveLongTermMemory: true,
    voiceAudioProcessing: false,
    calendarIntegration: false,
    analyticsParticipation: false,
    updatedAt: "2026-10-31T20:15:00Z",
  },
  journal: [
    {
      id: "jrn_001",
      date: "2026-10-31",
      title: "Reclaiming Stillness After Executive Review",
      valence: "calm",
      energyScore: 7,
      somaticFocus: "Chest tightness subsided after 4-4-4-4 box breathing",
      content:
        "The Q4 alignment critique felt intense. Three stakeholders pushed contradictory timelines. My initial impulse was to immediately defend our team's craft. Remembering cognitive defusion helped me observe the defensive urge without being captured by it. Took an evening walk as the sunset faded; the cool air anchored me in physical presence.",
      isEncrypted: true,
      tags: ["work_boundaries", "defusion", "evening_walk"],
    },
    {
      id: "jrn_002",
      date: "2026-10-28",
      title: "Morning Stillness Before Screens",
      valence: "reflective",
      energyScore: 8,
      somaticFocus: "Jaw relaxed, breathing slow and expansive",
      content:
        "Held a strict 20-minute window of natural light and herbal tea before opening email or Slack. It is remarkable how much sovereign calm is preserved simply by delaying the incoming demands of the day.",
      isEncrypted: true,
      tags: ["morning_routine", "circadian", "digital_boundaries"],
    },
  ],
  goals: [
    {
      id: "goal_001",
      horizonTitle: "Non-Reactive Work Pacing",
      category: "boundaries",
      intention: "Introduce a 30-second breathing buffer between stakeholder critiques and my verbal responses.",
      coreValue: "Intentional Craftsmanship",
      status: "active",
      reflectionNotes: "Successfully paused during Wednesday critique. Felt significantly less depleted afterward.",
      milestones: [
        { id: "m1", label: "Set up 5-minute buffer blocks on calendar", completed: true },
        { id: "m2", label: "Notice bodily defensiveness before answering", completed: true },
        { id: "m3", label: "Decline non-critical overlapping invites", completed: false },
      ],
    },
    {
      id: "goal_002",
      horizonTitle: "Circadian Sleep Recovery",
      category: "rest",
      intention: "Dim overhead domestic lighting at 9:15 PM to support natural melatonin synthesis.",
      coreValue: "Biological Equilibrium",
      status: "active",
      reflectionNotes: "Slow-wave sleep quality improved by 14% over the last fortnight.",
      milestones: [
        { id: "m4", label: "Replace bedroom bulbs with warm amber lamps", completed: true },
        { id: "m5", label: "Screen curfew 45 minutes before sleep", completed: true },
        { id: "m6", label: "Consistent 6:45 AM wake window", completed: false },
      ],
    },
  ],
  reminders: [
    {
      id: "rem_001",
      title: "Morning Intention & Breath",
      time: "08:15",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      type: "morning_intention",
      prompt: "Before the digital world knocks, take three deep belly breaths and name one thing you honor today.",
      channel: "in_app",
      isActive: true,
    },
    {
      id: "rem_002",
      title: "Midday Visual Accommodation Pause",
      time: "14:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      type: "breath_pause",
      prompt: "Rest your eyes on a distant point outside. Drop your shoulders away from your ears.",
      channel: "in_app",
      isActive: true,
    },
    {
      id: "rem_003",
      title: "Evening Sanctuary Curfew",
      time: "21:30",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      type: "evening_unwind",
      prompt: "The day is finished. Anything left undone can wait for tomorrow's energy. Enter your evening rest.",
      channel: "in_app",
      isActive: true,
    },
  ],
  lifeGraph: {
    nodes: [
      { id: "n_role", label: "Staff Product Designer", type: "role", description: "Design Systems & Product Architecture lead", emotionalCharge: "neutral" },
      { id: "n_habit_walk", label: "20-min Dusk Nature Walk", type: "habit", description: "Circadian transition out of the work mindset", emotionalCharge: "positive" },
      { id: "n_stressor_reviews", label: "Back-to-Back Critiques", type: "stressor", description: "Multiple stakeholders with conflicting agendas", emotionalCharge: "challenging" },
      { id: "n_value_craft", label: "Deep Focus Craftsmanship", type: "core_value", description: "Valuing deliberate quality over frantic shipping", emotionalCharge: "positive" },
      { id: "n_habit_tea", label: "Morning Herbal Tea Pause", type: "habit", description: "20 minutes screen-free tea ceremony", emotionalCharge: "positive" },
    ],
    edges: [
      { id: "e1", source: "n_role", target: "n_stressor_reviews", relation: "generates" },
      { id: "e2", source: "n_habit_walk", target: "n_stressor_reviews", relation: "mitigates" },
      { id: "e3", source: "n_value_craft", target: "n_habit_walk", relation: "anchors" },
      { id: "e4", source: "n_habit_tea", target: "n_role", relation: "grounds" },
    ],
  },
  connectedApps: [
    { id: "app_chatgpt", name: "ChatGPT Archive Ingest", type: "archive_json", status: "connected", lastSync: "2026-10-25" },
    { id: "app_claude", name: "Claude Export Ingest", type: "archive_html", status: "disconnected" },
    { id: "app_calendar", name: "Work Calendar (Read-Only)", type: "ical", status: "disconnected" },
  ],
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "08:00",
    suppressGentleAlerts: true,
  },
  safetyPlan: {
    groundingAnchor: "Holding a cool stone in palm + 4-4-4-4 box breathing",
    trustedContact: "Maya (Close friend & design colleague) • 512-555-0192",
    soothingSensoryTool: "Listening to ocean rain sounds with noise-canceling headphones",
    personalBoundaryStatement: "I am allowed to step away from any conversation that overwhelms my nervous system.",
  },
};

const STORAGE_KEY = "inneros_prototype_state_v1";

export const prototypeService = {
  getState(): PrototypeState {
    if (typeof window === "undefined") return INITIAL_PROTOTYPE_STATE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not read prototype state from localStorage, using synthetic defaults:", e);
    }
    return INITIAL_PROTOTYPE_STATE;
  },

  saveState(state: PrototypeState): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist prototype state:", e);
    }
  },

  resetToDefaults(): PrototypeState {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
    return INITIAL_PROTOTYPE_STATE;
  },

  addJournalEntry(entry: Omit<JournalEntry, "id" | "date" | "isEncrypted">): JournalEntry {
    const state = this.getState();
    const newEntry: JournalEntry = {
      ...entry,
      id: `jrn_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      isEncrypted: true,
    };
    state.journal.unshift(newEntry);
    this.saveState(state);
    return newEntry;
  },

  deleteJournalEntry(id: string): void {
    const state = this.getState();
    state.journal = state.journal.filter((j) => j.id !== id);
    this.saveState(state);
  },

  deleteLifeGraphNode(id: string): void {
    const state = this.getState();
    state.lifeGraph.nodes = state.lifeGraph.nodes.filter((n) => n.id !== id);
    state.lifeGraph.edges = state.lifeGraph.edges.filter((e) => e.source !== id && e.target !== id);
    this.saveState(state);
  },

  addLifeGraphNode(node: Omit<LifeGraphNode, "id">): LifeGraphNode {
    const state = this.getState();
    const newNode: LifeGraphNode = { ...node, id: `node_${Date.now()}` };
    state.lifeGraph.nodes.push(newNode);
    this.saveState(state);
    return newNode;
  },

  updateConsent(consent: Partial<UserConsentLedger>): UserConsentLedger {
    const state = this.getState();
    state.consent = {
      ...state.consent,
      ...consent,
      updatedAt: new Date().toISOString(),
    };
    this.saveState(state);
    return state.consent;
  },

  setLanguage(lang: string): void {
    const state = this.getState();
    state.user.language = lang;
    state.user.direction = lang === "ar" ? "rtl" : "ltr";
    this.saveState(state);
  },

  exportGdprArticle15Archive(): string {
    const state = this.getState();
    return JSON.stringify(
      {
        exportType: "GDPR_ARTICLE_15_DATA_ACCESS",
        generatedAt: new Date().toISOString(),
        userContext: state.user,
        consentPreferences: state.consent,
        journalEntriesCount: state.journal.length,
        journalEntries: state.journal,
        lifeGraphNodesCount: state.lifeGraph.nodes.length,
        lifeGraphNodes: state.lifeGraph.nodes,
        growthGoals: state.goals,
        encryptionStandard: "AES-256-GCM (Per-User HKDF Derived Key)",
        disclaimer: "SYNTHETIC PROTOTYPE DATA ONLY - NOT A REAL CLINICAL ARCHIVE",
      },
      null,
      2
    );
  },

  purgeAllDataPermanently(): void {
    this.resetToDefaults();
  },
};
