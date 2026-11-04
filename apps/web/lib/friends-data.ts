export type CharacterId = "kai" | "mia" | "lumi" | "zayn";

export type AgeTier = "little" | "junior" | "teen";

export interface CharacterVoiceProfile {
  pitch: number;
  rate: number;
  langCodes: {
    en: string;
    ur: string;
    pa: string;
  };
  samplePhrases: {
    en: string;
    ur: string;
    pa: string;
  };
}

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  role: string;
  tagline: string;
  specialization: string;
  specializationBadge: string;
  accentColor: string;
  bgGradient: string;
  borderHoverColor: string;
  avatarBg: string;
  description: {
    little: string;
    junior: string;
    teen: string;
  };
  voiceProfile: CharacterVoiceProfile;
  suggestedQuestions: {
    en: string[];
    ur: string[];
    pa: string[];
  };
}

export const AI_FRIENDS: Record<CharacterId, CharacterDefinition> = {
  kai: {
    id: "kai",
    name: "Kai",
    role: "Learning Guide",
    tagline: "Curious, encouraging mentor for homework, questions, and step-by-step confidence.",
    specialization: "Homework, Questions & Problem-Solving",
    specializationBadge: "Learning & Confidence",
    accentColor: "#F59E0B",
    bgGradient: "from-amber-50 via-orange-50 to-amber-100/40",
    borderHoverColor: "#FBBF24",
    avatarBg: "bg-amber-100 text-amber-800",
    description: {
      little: "Kai loves exploring numbers, shapes, and big 'Why?' questions with you!",
      junior: "Stuck on homework or a tricky question? Kai breaks it into bite-sized steps so you can solve it yourself.",
      teen: "A dedicated study sounding board. Kai helps you unpack complex concepts, test logic, and build real confidence.",
    },
    voiceProfile: {
      pitch: 1.15,
      rate: 1.02,
      langCodes: {
        en: "en-US",
        ur: "ur-PK",
        pa: "pa-PK",
      },
      samplePhrases: {
        en: "Hi there! I'm Kai. What question are we solving together today?",
        ur: "سلام! میں کائی ہوں۔ آج ہم مل کر کون سا سوال حل کریں گے؟",
        pa: "سلام جی! میں کائی آں۔ اج اسیں کیہڑا سبق مل کے سمجھنا اے؟",
      },
    },
    suggestedQuestions: {
      en: [
        "I don't understand this question.",
        "How do fractions work?",
        "Can you help me start my science project?",
      ],
      ur: [
        "مجھے یہ سوال سمجھ نہیں آ رہا۔",
        "ریاضی کا یہ سوال کیسے حل کریں؟",
        "کیا آپ سبق یاد کرنے میں میری مدد کریں گے؟",
      ],
      pa: [
        "Mainu homework samajh nahi aa reha.",
        "Aao mil ke sawal hal kariye.",
        "Mainu school de kamm vich madad chahidi ae.",
      ],
    },
  },
  mia: {
    id: "mia",
    name: "Mia",
    role: "Creative Guide",
    tagline: "Warm, empathetic companion for stories, big feelings, and social learning.",
    specialization: "Storytelling, Feelings & Empathy",
    specializationBadge: "Stories & Feelings",
    accentColor: "#EC4899",
    bgGradient: "from-pink-50 via-rose-50 to-purple-50",
    borderHoverColor: "#F472B6",
    avatarBg: "bg-pink-100 text-pink-800",
    description: {
      little: "Mia loves telling gentle animal tales and hearing all about how your heart feels.",
      junior: "Got a story to tell or dealing with friendship drama? Mia listens closely and helps you find the right words.",
      teen: "A creative and emotional sounding board. Mia helps process interpersonal friction and expressive writing.",
    },
    voiceProfile: {
      pitch: 1.25,
      rate: 0.96,
      langCodes: {
        en: "en-US",
        ur: "ur-PK",
        pa: "pa-PK",
      },
      samplePhrases: {
        en: "Hello friend! I'm Mia. I love stories and listening to how you feel.",
        ur: "ہیلو دوست! میں میا ہوں۔ مجھے کہانیاں سنانا اور آپ کے دل کی بات سننا پسند ہے۔",
        pa: "سلام پیارے دوست! میں میا آں۔ مینوں کہانیاں سنانا تے تہاڈیاں گلاں سننا بڑا چنگا لگدا اے۔",
      },
    },
    suggestedQuestions: {
      en: [
        "Tell me a story about a brave squirrel.",
        "I had a disagreement with my friend today.",
        "How can I express what I'm feeling?",
      ],
      ur: [
        "مجھے ایک دلچسپ کہانی سنائیں۔",
        "آج دوست سے ناراضگی ہو گئی تھی۔",
        "میں اپنی اداسی کیسے دور کروں؟",
      ],
      pa: [
        "Mainu ik sohni kahani sunao.",
        "Aj dost naal thori laraai ho gayi si.",
        "Dil thora udaas ae, ki karaan?",
      ],
    },
  },
  lumi: {
    id: "lumi",
    name: "Lumi",
    role: "Calm Guide",
    tagline: "Gentle, soothing presence for daily routines, emotional regulation, and deep breaths.",
    specialization: "Routines, Calming & Co-Regulation",
    specializationBadge: "Calm & Routines",
    accentColor: "#0284C7",
    bgGradient: "from-sky-50 via-cyan-50 to-blue-50",
    borderHoverColor: "#38BDF8",
    avatarBg: "bg-sky-100 text-sky-800",
    description: {
      little: "Lumi helps you take soft bunny breaths and settle into peaceful morning and bedtime rhythms.",
      junior: "When the day feels noisy or overwhelming, Lumi guides you through sensory resets and calming steps.",
      teen: "A calm, zero-pressure space to decompress from sensory overload, exams, and daily noise.",
    },
    voiceProfile: {
      pitch: 1.06,
      rate: 0.88,
      langCodes: {
        en: "en-US",
        ur: "ur-PK",
        pa: "pa-PK",
      },
      samplePhrases: {
        en: "Hi there. I am Lumi. Let's take a calm, gentle breath together.",
        ur: "ہیلو۔ میں لومی ہوں۔ آئیے مل کر ایک پرسکون سانس لیتے ہیں۔",
        pa: "سلام۔ میں لومی آں۔ آؤ مل کے اک لمبا، سکون والا ساہ لئیے۔",
      },
    },
    suggestedQuestions: {
      en: [
        "Can we do a 1-minute breathing exercise?",
        "I'm feeling very overwhelmed right now.",
        "Help me make a calm evening routine.",
      ],
      ur: [
        "کیا ہم پرسکون سانس کی مشق کر سکتے ہیں؟",
        "مجھے بہت زیادہ بے چینی محسوس ہو رہی ہے۔",
        "سوتے وقت کا پرسکون معمول بنائیں۔",
      ],
      pa: [
        "Aao mil ke saah len di mashq kariye.",
        "Mainu thora ghabrahat ho rehi ae.",
        "Raat nu son da aasan tareeqa dso.",
      ],
    },
  },
  zayn: {
    id: "zayn",
    name: "Zayn",
    role: "Energetic Explorer",
    tagline: "Enthusiastic explorer for science mysteries, space wonders, and mind-bending puzzles.",
    specialization: "Science, Nature, Space & Puzzles",
    specializationBadge: "Science & Curiosity",
    accentColor: "#10B981",
    bgGradient: "from-emerald-50 via-teal-50 to-green-50",
    borderHoverColor: "#34D399",
    avatarBg: "bg-emerald-100 text-emerald-800",
    description: {
      little: "Zayn loves roaring like dinosaurs, looking at stars, and splashing in puddles!",
      junior: "Got a mind-boggling science question or love solving riddles? Zayn is your curiosity co-pilot.",
      teen: "Deep-dives into physics, biology curiosities, coding logic, and astronomical mysteries.",
    },
    voiceProfile: {
      pitch: 1.20,
      rate: 1.08,
      langCodes: {
        en: "en-US",
        ur: "ur-PK",
        pa: "pa-PK",
      },
      samplePhrases: {
        en: "Hey explorer! I'm Zayn. Did you know octopuses have three hearts?! What are we discovering today?",
        ur: "ارے دوست! میں زین ہوں۔ کیا آپ جانتے ہیں کہ آکٹوپس کے تین دل ہوتے ہیں؟! آج ہم کیا دریافت کریں گے؟",
        pa: "اوئے یار! میں زین آں۔ کی تہانوں پتا اے کہ آکٹوپس دے تِن دل ہوندے نے؟! اج اسیں کیہڑی نویں کھوج کرنی اے؟",
      },
    },
    suggestedQuestions: {
      en: [
        "Why is the sky blue?",
        "Tell me an incredible animal superpower.",
        "Give me a challenging riddle to solve!",
      ],
      ur: [
        "آسمان نیلا کیوں ہوتا ہے؟",
        "جانوروں کا کوئی انوکھا راز بتائیں۔",
        "مجھ سے ایک مشکل پہیلی پوچھیں۔",
      ],
      pa: [
        "Asmaan neela kyon hunda ae?",
        "Koi zabardast paheli puchho!",
        "Chann te sitare kinve chamkde ne?",
      ],
    },
  },
};

export const CHARACTER_LIST: CharacterDefinition[] = [
  AI_FRIENDS.kai,
  AI_FRIENDS.mia,
  AI_FRIENDS.lumi,
  AI_FRIENDS.zayn,
];
