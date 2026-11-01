export type SupportedMarketingLocale =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "bg"
  | "ar"
  | "ur"
  | "hi";

export interface LocaleConfig {
  code: SupportedMarketingLocale;
  label: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  tier: "Primary Supported" | "Beta Evaluation";
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaStart: string;
  ctaExplore: string;
  ctaOpenApp: string;
  nonClinicalNotice: string;
}

export const MARKETING_LOCALES: Record<SupportedMarketingLocale, LocaleConfig> = {
  en: {
    code: "en",
    label: "English",
    nativeName: "English",
    dir: "ltr",
    tier: "Primary Supported",
    heroBadge: "Your personal space for everyday clarity",
    heroHeadline: "A little more clarity. A little more calm. A space that’s yours.",
    heroSubheadline:
      "Talk, reflect, and find your next step with an AI companion designed for everyday wellbeing and personal growth.",
    ctaStart: "Start Your Journey",
    ctaExplore: "Explore InnerOS",
    ctaOpenApp: "Open Companion",
    nonClinicalNotice:
      "InnerOS is an AI companion for reflection and personal growth, not a replacement for licensed mental-health professionals.",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeName: "Español",
    dir: "ltr",
    tier: "Primary Supported",
    heroBadge: "Tu espacio personal para la calma diaria",
    heroHeadline: "Un poco más de claridad. Un poco más de calma. Un espacio tuyo.",
    heroSubheadline:
      "Habla, reflexiona y encuentra tu próximo paso con un compañero de IA diseñado para el bienestar cotidiano y el crecimiento personal.",
    ctaStart: "Comienza Tu Camino",
    ctaExplore: "Explorar InnerOS",
    ctaOpenApp: "Abrir Aplicación",
    nonClinicalNotice:
      "InnerOS es un compañero de IA para la reflexión y el bienestar, no un sustituto de profesionales de salud mental con licencia.",
  },
  fr: {
    code: "fr",
    label: "French",
    nativeName: "Français",
    dir: "ltr",
    tier: "Primary Supported",
    heroBadge: "Votre espace personnel pour plus de sérénité",
    heroHeadline: "Un peu plus de clarté. Un peu plus de calme. Un espace à vous.",
    heroSubheadline:
      "Parlez, réfléchissez et avancez à votre rythme avec un compagnon IA conçu pour le bien-être quotidien et le développement personnel.",
    ctaStart: "Commencer",
    ctaExplore: "Découvrir InnerOS",
    ctaOpenApp: "Ouvrir l’Application",
    nonClinicalNotice:
      "InnerOS est un compagnon IA de réflexion personnelle et ne remplace pas un professionnel de santé mentale agréé.",
  },
  de: {
    code: "de",
    label: "German",
    nativeName: "Deutsch",
    dir: "ltr",
    tier: "Primary Supported",
    heroBadge: "Dein persönlicher Raum für Ruhe im Alltag",
    heroHeadline: "Ein wenig mehr Klarheit. Ein wenig mehr Ruhe. Ein Raum für dich.",
    heroSubheadline:
      "Sprich, reflektiere und finde deinen nächsten Schritt mit einem KI-Begleiter für alltägliches Wohlbefinden und persönliches Wachstum.",
    ctaStart: "Jetzt Starten",
    ctaExplore: "InnerOS Entdecken",
    ctaOpenApp: "App Öffnen",
    nonClinicalNotice:
      "InnerOS ist ein KI-Begleiter zur Selbstreflexion und kein Ersatz für approbierte Psychotherapeuten oder Ärzte.",
  },
  bg: {
    code: "bg",
    label: "Bulgarian",
    nativeName: "Български",
    dir: "ltr",
    tier: "Primary Supported",
    heroBadge: "Твоето лично пространство за спокойствие и яснота",
    heroHeadline: "Малко повече яснота. Малко повече спокойствие. Пространство за теб.",
    heroSubheadline:
      "Говори, размишлявай и открий следващата си стъпка с AI спътник, създаден за ежедневно благополучие и личностно израстване.",
    ctaStart: "Започни Своето Пътуване",
    ctaExplore: "Разгледай InnerOS",
    ctaOpenApp: "Отвори Приложението",
    nonClinicalNotice:
      "InnerOS е AI спътник за размисъл и личностно развитие и не замества лицензирани специалисти по психично здраве.",
  },
  ar: {
    code: "ar",
    label: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    tier: "Beta Evaluation",
    heroBadge: "مساحتك الشخصية للهدوء والوضوح اليومي",
    heroHeadline: "مزيد من الوضوح. مزيد من الهدوء. مساحة خاصة بك.",
    heroSubheadline:
      "تحدث وتأمل واكتشف خطوتك التالية مع مرافق ذكاء اصطناعي مصمم للرفاهية اليومية والنمو الشخصي.",
    ctaStart: "ابدأ رحلتك",
    ctaExplore: "استكشف InnerOS",
    ctaOpenApp: "افتح التطبيق",
    nonClinicalNotice:
      "InnerOS هو مرافق ذكاء اصطناعي للتأمل الشخصي، وليس بديلاً عن المختصين المرخصين في الصحة النفسية.",
  },
  ur: {
    code: "ur",
    label: "Urdu",
    nativeName: "اردو",
    dir: "rtl",
    tier: "Beta Evaluation",
    heroBadge: "روزمرہ سکون اور وضاحت کے لیے آپ کی ذاتی جگہ",
    heroHeadline: "تھوڑی زیادہ وضاحت۔ تھوڑا زیادہ سکون۔ ایک ایسی جگہ جو آپ کی ہے۔",
    heroSubheadline:
      "روزمرہ فلاح و بہبود اور ذاتی ترقی کے لیے بنائے گئے AI ساتھی کے ساتھ بات کریں، غور کریں اور اپنا اگلا قدم تلاش کریں۔",
    ctaStart: "اپنا سفر شروع کریں",
    ctaExplore: "InnerOS دیکھیں",
    ctaOpenApp: "ایپ کھولیں",
    nonClinicalNotice:
      "InnerOS ذاتی غور و فکر کے لیے ایک AI ساتھی ہے، یہ لائسنس یافتہ ذہنی صحت کے ماہرین کا متبادل نہیں ہے۔",
  },
  hi: {
    code: "hi",
    label: "Hindi",
    nativeName: "हिन्दी",
    dir: "ltr",
    tier: "Beta Evaluation",
    heroBadge: "दैनिक शांति और स्पष्टता के लिए आपका निजी स्थान",
    heroHeadline: "थोड़ी और स्पष्टता। थोड़ी और शांति। एक ऐसा स्थान जो आपका है।",
    heroSubheadline:
      "दैनिक कल्याण और व्यक्तिगत विकास के लिए डिज़ाइन किए गए AI साथी के साथ बात करें, चिंतन करें और अपना अगला कदम खोजें।",
    ctaStart: "अपनी यात्रा शुरू करें",
    ctaExplore: "InnerOS जानें",
    ctaOpenApp: "ऐप खोलें",
    nonClinicalNotice:
      "InnerOS आत्म-चिंतन और व्यक्तिगत विकास के लिए एक AI साथी है, यह लाइसेंस प्राप्त मानसिक स्वास्थ्य पेशेवरों का विकल्प नहीं है।",
  },
};
