/**
 * InnerOS Youth Internationalization Engine
 * Comprehensive multilingual support for English, Urdu (اردو), Pakistani Punjabi (پنجابی / شاہ مکھی), and Roman Urdu.
 * Enforces true RTL orientation for Urdu and Shahmukhi Punjabi.
 */

export type YouthLocale = "en" | "ur" | "pa" | "ur-Latn";

export interface YouthLocaleMeta {
  code: YouthLocale;
  label: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  script: "latin" | "arabic-nastaliq" | "arabic-shahmukhi";
  fontFamily: string;
}

export const YOUTH_LOCALES: Record<YouthLocale, YouthLocaleMeta> = {
  en: {
    code: "en",
    label: "English",
    nativeName: "English",
    dir: "ltr",
    script: "latin",
    fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)',
  },
  ur: {
    code: "ur",
    label: "Urdu",
    nativeName: "اردو",
    dir: "rtl",
    script: "arabic-nastaliq",
    fontFamily: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Noto Sans Arabic", serif',
  },
  pa: {
    code: "pa",
    label: "Punjabi (Shahmukhi)",
    nativeName: "پنجابی",
    dir: "rtl",
    script: "arabic-shahmukhi",
    fontFamily: '"Noto Sans Shahmukhi", "Noto Nastaliq Urdu", "Noto Sans Arabic", serif',
  },
  "ur-Latn": {
    code: "ur-Latn",
    label: "Roman Urdu",
    nativeName: "Roman Urdu",
    dir: "ltr",
    script: "latin",
    fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)',
  },
};

export const YOUTH_STRINGS: Record<YouthLocale, Record<string, string>> = {
  en: {
    // Navigation & Shell
    brand_name: "Weebly Youth",
    tagline: "Your gentle space to breathe, learn, and grow",
    age_tier_little: "Ages 2–5",
    age_tier_junior: "Ages 6–12",
    age_tier_teen: "Ages 13–18",
    nav_home: "Home",
    nav_talk: "Voice Room",
    nav_chat: "Text Chat",
    nav_emotions: "Feelings",
    nav_stories: "Stories",
    nav_activities: "Activities",
    nav_routines: "Routines",
    nav_visual_tools: "Visual Tools",
    nav_journal: "Journal",
    nav_habits: "Daily Habits",
    nav_achievements: "Achievements",
    nav_parent: "Parent Hub",
    nav_teacher: "Teacher Hub",
    nav_safety: "Help & Safety",
    nav_accessibility: "Accessibility",
    nav_language: "Language",
    nav_admin: "Content Admin",

    // Safety & Trust
    safety_badge: "Child-Safe Sanctuary",
    safety_emergency: "Quick Help & Safety",
    safety_exit: "Exit to Safe Screen",
    mascot_greeting: "Hi there! I am Lumi. I'm here to listen, tell stories, and breathe with you.",
    mascot_listening: "Lumi is listening with care...",
    mascot_thinking: "Lumi is thinking calmly...",
    mascot_breathing: "Let's breathe together: Inhale... Exhale...",

    // Action Buttons
    btn_talk: "Talk to Lumi",
    btn_listen: "Listen to Story",
    btn_breathe: "Calm Breathing",
    btn_start: "Get Started",
    btn_continue: "Continue",
    btn_save: "Save Reflection",
    btn_cancel: "Cancel",
    btn_replay: "Replay Voice",
    btn_pause: "Pause",
    btn_stop: "Stop",

    // Accessibility
    acc_low_stimulation: "Low Stimulation Mode",
    acc_high_contrast: "High Contrast",
    acc_reduced_motion: "Reduced Motion",
    acc_font_size: "Text Size",

    // Disclaimer
    non_clinical_notice: "Weebly Youth is an educational emotional wellbeing companion, not medical care or clinical therapy.",
  },

  ur: {
    // Navigation & Shell (اردو)
    brand_name: "انر او ایس یوتھ",
    tagline: "سکون سے سانس لینے، سیکھنے اور آگے بڑھنے کے لیے آپ کی محفوظ جگہ",
    age_tier_little: "عمر ۲ تا ۵ سال",
    age_tier_junior: "عمر ۶ تا ۱۲ سال",
    age_tier_teen: "عمر ۱۳ تا ۱۸ سال",
    nav_home: "ہوم",
    nav_talk: "آواز کا کمرہ",
    nav_chat: "تحریری بات چیت",
    nav_emotions: "جذبات و احساسات",
    nav_stories: "کہانیاں",
    nav_activities: "سرگرمیاں",
    nav_routines: "روزمرہ شیڈول",
    nav_visual_tools: "بصری سہولت کار",
    nav_journal: "ذاتی ڈائری",
    nav_habits: "اچھی عادات",
    nav_achievements: "کامیابیاں",
    nav_parent: "والدین پورٹل",
    nav_teacher: "اساتذہ پورٹل",
    nav_safety: "مدد اور حفاظت",
    nav_accessibility: "رسائی و سہولیات",
    nav_language: "زبان کا انتخاب",
    nav_admin: "مواد کی نگرانی",

    // Safety & Trust
    safety_badge: "بچوں کے لیے محفوظ پناہ گاہ",
    safety_emergency: "فوری مدد اور حفاظت",
    safety_exit: "فوری محفوظ اسکرین",
    mascot_greeting: "ہیلو دوست! میں لومی ہوں۔ میں آپ کی بات سننے، کہانیاں سنانے اور پرسکون سانس لینے میں آپ کا ساتھی ہوں۔",
    mascot_listening: "لومی توجہ سے سن رہا ہے...",
    mascot_thinking: "لومی سوچ رہا ہے...",
    mascot_breathing: "آئیں مل کر گہری سانس لیں: سانس اندر... سانس باہر...",

    // Action Buttons
    btn_talk: "لومی سے بات کریں",
    btn_listen: "کہانی سنیں",
    btn_breathe: "پرسکون سانس لیں",
    btn_start: "شروع کریں",
    btn_continue: "آگے بڑھیں",
    btn_save: "محفوظ کریں",
    btn_cancel: "منسوخ",
    btn_replay: "دوبارہ سنیں",
    btn_pause: "روکیں",
    btn_stop: "ختم کریں",

    // Accessibility
    acc_low_stimulation: "کم تحریک / پرسکون موڈ",
    acc_high_contrast: "واضح کنٹراسٹ",
    acc_reduced_motion: "کم متحرک گرافکس",
    acc_font_size: "حروف کا سائز",

    // Disclaimer
    non_clinical_notice: "انر او ایس یوتھ جذباتی بہبود اور تعلیم کا ساتھی ہے، یہ کوئی طبی علاج یا تشخیص فراہم نہیں کرتا۔",
  },

  pa: {
    // Navigation & Shell (پنجابی شاہ مکھی)
    brand_name: "انر او ایس یوتھ",
    tagline: "سکھن، سنبھلن تے سکون نال وکھرن لئی تواڈی اپنی تھاں",
    age_tier_little: "عمر ۲ توں ۵ سال",
    age_tier_junior: "عمر ۶ توں ۱۲ سال",
    age_tier_teen: "عمر ۱۳ توں ۱۸ سال",
    nav_home: "ہوم",
    nav_talk: "بولن والا کمرہ",
    nav_chat: "لکھ کے گل بات",
    nav_emotions: "احساس تے جذبے",
    nav_stories: "کہانیاں",
    nav_activities: "مشقاں تے کھیل",
    nav_routines: "روز دی روٹین",
    nav_visual_tools: "ویکھن والے اوزار",
    nav_journal: "دل دی ڈائری",
    nav_habits: "چنگیاں عادتاں",
    nav_achievements: "شاباشیاں",
    nav_parent: "ماں پیو پورٹل",
    nav_teacher: "استاد پورٹل",
    nav_safety: "حفاظت تے مدد",
    nav_accessibility: "آسان سہولتاں",
    nav_language: "بولی چنو",
    nav_admin: "مواد دا انتظام",

    // Safety & Trust
    safety_badge: "بالاں لئی محفوظ تھاں",
    safety_emergency: "فوری مدد لئی دبو",
    safety_exit: "محفوظ اسکرین تے جاؤ",
    mascot_greeting: "ست سری اکال / سلام جی! میں لومی آں۔ میں تہاڈیاں گلاں سنن تے کہانیاں سنان آیا آں۔",
    mascot_listening: "لومی تہاڈی گل سن رہیا اے...",
    mascot_thinking: "لومی سوچ رہیا اے...",
    mascot_breathing: "آؤ اکٹھے ساہ کھچئے: ساہ اندر... ساہ باہر...",

    // Action Buttons
    btn_talk: "لومی نال گل کرو",
    btn_listen: "کہانی سنو",
    btn_breathe: "ٹھنڈا ساہ لوو",
    btn_start: "شروع کرو",
    btn_continue: "اگے ودھو",
    btn_save: "سنبھالو",
    btn_cancel: "چھڈو",
    btn_replay: "مڑ کے سنو",
    btn_pause: "روکو",
    btn_stop: "بند کرو",

    // Accessibility
    acc_low_stimulation: "پرسکون / مدھم موڈ",
    acc_high_contrast: "تیز رنگ / واضح لکھائی",
    acc_reduced_motion: "ہلدی جُلدی چیزاں روکو",
    acc_font_size: "اکھراں دا ناپ",

    // Disclaimer
    non_clinical_notice: "انر او ایس یوتھ سکھن تے سکون لئی اے، ایہہ ڈاکٹری علاج دا بدل نہیں۔",
  },

  "ur-Latn": {
    // Navigation & Shell (Roman Urdu)
    brand_name: "Weebly Youth",
    tagline: "Sukoon se saans lene, seekhne aur aagay barhne ki mehfooz jagah",
    age_tier_little: "Umar 2 se 5 saal",
    age_tier_junior: "Umar 6 se 12 saal",
    age_tier_teen: "Umar 13 se 18 saal",
    nav_home: "Home",
    nav_talk: "Awaaz Ka Kamra",
    nav_chat: "Text Chat",
    nav_emotions: "Jazbaat Aur Ehsaasaat",
    nav_stories: "Kahaniyan",
    nav_activities: "Sargarmiyan",
    nav_routines: "Rozmarrah Schedule",
    nav_visual_tools: "Visual Tools",
    nav_journal: "Zaati Diary",
    nav_habits: "Achi Aadatein",
    nav_achievements: "Kaamyabiyan",
    nav_parent: "Walidain Portal",
    nav_teacher: "Asataza Portal",
    nav_safety: "Madad Aur Hifazat",
    nav_accessibility: "Accessibility",
    nav_language: "Zaban Ka Intekhab",
    nav_admin: "Content Admin",

    // Safety & Trust
    safety_badge: "Bacchon Ke Liye Mehfooz Sanctuary",
    safety_emergency: "Fauri Madad & Safety",
    safety_exit: "Fauri Exit",
    mascot_greeting: "Hello dost! Main Lumi hoon. Main aap ki baat sunne aur sukoon bhari kahaniyan sunane ke liye yahan hoon.",
    mascot_listening: "Lumi dhyan se sun raha hai...",
    mascot_thinking: "Lumi soch raha hai...",
    mascot_breathing: "Aayein mil kar gehri saans lein: Saans andar... Saans bahar...",

    // Action Buttons
    btn_talk: "Lumi Se Baat Karein",
    btn_listen: "Kahani Sunein",
    btn_breathe: "Sukoon Se Saans Lein",
    btn_start: "Shuru Karein",
    btn_continue: "Aagay Barhein",
    btn_save: "Save Karein",
    btn_cancel: "Cancel",
    btn_replay: "Dobara Sunein",
    btn_pause: "Rokein",
    btn_stop: "Khatam Karein",

    // Accessibility
    acc_low_stimulation: "Low Stimulation Mode",
    acc_high_contrast: "High Contrast",
    acc_reduced_motion: "Kam Animations",
    acc_font_size: "Huroof Ka Size",

    // Disclaimer
    non_clinical_notice: "Weebly Youth jazbaati sukoon aur taleem ka sathi hai, yeh kisi doctri ilaj ka badal nahi hai.",
  },
};
