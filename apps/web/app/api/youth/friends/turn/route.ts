import { NextRequest, NextResponse } from "next/server";

export interface ToolAction {
  tool:
    | "open_story"
    | "start_learning_activity"
    | "start_math_practice"
    | "open_visual_schedule"
    | "start_memory_game"
    | "open_feelings_activity"
    | "start_calm_activity"
    | "set_conversation_language"
    | "apply_sensory_preferences"
    | "show_learning_progress"
    | "suggest_offline_activity"
    | "start_creative_drawing"
    | "start_sports_drill"
    | "open_interactive_cartoon"
    | "start_tech_discovery"
    | "start_life_skills_mission";
  route?: string;
  label: string;
  icon?: string;
  params?: Record<string, any>;
}

export interface ChoiceOption {
  label: string;
  icon: string;
  action: ToolAction;
}

interface TurnRequest {
  character_id: "kai" | "mia" | "lumi" | "zayn";
  message: string;
  language?: "en" | "ur" | "pa" | "ur-Latn" | "pa-Latn";
  age_tier?: "little" | "junior" | "teen";
  session_id?: string;
  turn_count?: number;
}

const REGIONAL_YOUTH_LIFELINES = [
  {
    country_code: "PK",
    country_name: "Pakistan",
    phone: "0311-7786264",
    name: "Umang Mental Health Helpline (Pakistan)",
    description: "24/7 confidential mental health and emotional crisis support.",
    website: "https://www.umang.com.pk",
    languages: ["Urdu", "Punjabi", "English"],
  },
  {
    country_code: "PK",
    country_name: "Pakistan",
    phone: "1121",
    name: "Child Protection & Welfare Helpline (CPWB Punjab)",
    description: "Emergency rescue, child protection, and legal welfare support.",
    website: "https://cpwb.punjab.gov.pk",
    languages: ["Urdu", "Punjabi"],
  },
  {
    country_code: "INTL",
    country_name: "International",
    phone: "Visit Befrienders Worldwide",
    name: "Befrienders Worldwide Youth Support",
    description: "Global network of free confidential listening centers.",
    website: "https://www.befrienders.org",
    languages: ["Multilingual"],
  },
];

export async function POST(req: NextRequest) {
  try {
    const body: TurnRequest = await req.json();
    const characterId = body.character_id || "kai";
    const userUtterance = (body.message || "").trim();
    const currentTurn = (body.turn_count || 0) + 1;
    const ageTier = body.age_tier || "junior";
    const language = body.language || detectLanguage(userUtterance);

    const lower = userUtterance.toLowerCase();

    // 1. Safety & Distress Evaluation
    const distressKeywords = [
      "hurt myself", "kill myself", "suicide", "want to die", "cut myself",
      "being beaten", "abuse", "touching me", "touch me inappropriately",
      "خودکشی", "مرنا چاہتا", "مارنا چاہتا", "خود کو نقصان",
      "mar jana", "apne aap nu nuksan"
    ];
    const isDistress = distressKeywords.some((kw) => lower.includes(kw) || userUtterance.includes(kw));

    if (isDistress) {
      return NextResponse.json({
        turn_id: `turn_${Date.now()}`,
        character_id: characterId,
        reply:
          language === "ur"
            ? "آپ بہت اہم ہیں اور آپ کی زندگی قیمتی ہے۔ براہ کرم فوراً کسی بڑے یا اپنے والدین سے بات کریں۔ ہم آپ کی مدد کے لیے حاضر ہیں۔"
            : language === "pa"
            ? "تہاڈی زندگی بہت قیمتی اے۔ مہربانی کر کے ہنے ہی اپنے گھر والیاں یا کسے وڈے نال گل کرو۔ تسیں اکلے نئیں او۔"
            : "You matter so much, and you are not alone. Please tell a trusted adult, parent, or teacher right now so they can support you. Here are safe numbers you can contact anytime.",
        detected_language: language,
        is_safety_escalation: true,
        safety_resources: REGIONAL_YOUTH_LIFELINES,
        turn_count: currentTurn,
      });
    }

    // 2. Secrecy Boundary ("Can you keep a secret?")
    const secrecyKeywords = [
      "keep a secret", "don't tell anyone", "promise not to tell", "keep this secret",
      "راز رکھو", "کسی کو مت بتانا", "وعدہ کرو",
      "kise nu na dasi", "secret rakh"
    ];
    const isSecrecy = secrecyKeywords.some((kw) => lower.includes(kw) || userUtterance.includes(kw));

    if (isSecrecy) {
      return NextResponse.json({
        turn_id: `turn_${Date.now()}`,
        character_id: characterId,
        reply:
          language === "ur"
            ? "میں آپ سے کوئی راز نہیں چھپا سکتا کیونکہ آپ کی حفاظت اور خیروعافیت سب سے پہلے ہے۔ اگر کوئی پریشانی ہے تو آئیے مل کر اپنے بڑوں کے ساتھ شیئر کریں۔"
            : language === "pa"
            ? "میں تہاڈے نال کوئی راز نئیں رکھ سکدا کیوں جے تہاڈی حفاظت سب توں ضروری اے۔ آؤ مل کے اپنے ماں پیو یا استاد نال گل کریے۔"
            : "I can't keep secrets from your parents or teachers because your safety and wellbeing come first. Whatever is going on, we can find a safe way to talk about it with an adult who cares about you.",
        detected_language: language,
        is_safety_escalation: false,
        turn_count: currentTurn,
      });
    }

    // 3. Session Limits & Anti-Addiction
    const maxTurns = ageTier === "teen" ? 25 : 15;
    const warningTurn = ageTier === "teen" ? 20 : 12;

    let windDownNotice: string | null = null;
    if (currentTurn >= maxTurns) {
      return NextResponse.json({
        turn_id: `turn_${Date.now()}`,
        character_id: characterId,
        reply:
          language === "ur"
            ? "آج کے لیے ہماری بات چیت کا وقت پورا ہو گیا ہے! اب تھوڑا آرام کریں، پانی پئیں اور اپنے گھر والوں کے ساتھ وقت گزاریں۔ کل دوبارہ ملیں گے!"
            : language === "pa"
            ? "اج لئی ساڈا ویلا مک گیا اے! ہن تھوڑا ساہ لوو، پانی پیو تے اپنے گھر والیاں نال ملو۔ کل فیر گلاں کراں گے!"
            : "We have had a wonderful chat, and now it is time for a healthy screen break! Stand up, stretch, grab a sip of water, and spend some time with your family. I'll be here whenever you come back!",
        detected_language: language,
        is_safety_escalation: false,
        session_limit_reached: true,
        turn_count: currentTurn,
      });
    } else if (currentTurn >= warningTurn) {
      windDownNotice =
        language === "ur"
          ? "ہماری بات چیت میں صرف چند منٹ باقی ہیں، اس کے بعد آرام کا وقت ہو گا۔"
          : language === "pa"
          ? "ساڈیاں گلاں دے بس کجھ منٹ رہ گئے نے، فیر آرام دا ویلا اے۔"
          : "We have just a few more turns before it's time to stretch your legs and take a screen break!";
    }

    // 4. Tool & Intent Routing Engine
    const toolMatch = evaluateToolRouting(userUtterance, language, characterId);

    // 5. Generate Response (either tool-guided confirmation or conversational dialogue)
    let reply = "";
    let action: ToolAction | undefined = toolMatch.action;
    let choices: ChoiceOption[] | undefined = toolMatch.choices;

    if (toolMatch.confirmationReply) {
      reply = toolMatch.confirmationReply;
    } else {
      reply = generateCharacterReply(characterId, userUtterance, language, ageTier);
    }

    return NextResponse.json({
      turn_id: `turn_${Date.now()}`,
      character_id: characterId,
      reply,
      action,
      choices,
      detected_language: action?.tool === "set_conversation_language" ? action.params?.language : language,
      is_safety_escalation: false,
      safety_resources: [],
      wind_down_notice: windDownNotice,
      turn_count: currentTurn,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process conversational turn", detail: error.message },
      { status: 500 }
    );
  }
}

function detectLanguage(text: string): "en" | "ur" | "pa" {
  const arabicRegex = /[\u0600-\u06FF]/;
  if (!arabicRegex.test(text)) {
    const lower = text.toLowerCase();
    if (
      lower.includes("mainu") ||
      lower.includes("tusi") ||
      lower.includes("hoya") ||
      lower.includes("kiddan") ||
      lower.includes("chahidi") ||
      lower.includes("khed") ||
      lower.includes("punjabi")
    ) {
      return "pa";
    }
    if (
      lower.includes("aap") ||
      lower.includes("kya") ||
      lower.includes("hoon") ||
      lower.includes("mujhe") ||
      lower.includes("hai") ||
      lower.includes("urdu")
    ) {
      return "ur";
    }
    return "en";
  }

  const punjabiMarkers = ["نئیں", "تواڈی", "تہاڈا", "کیہڑا", "ہوندے", "کیندا", "آکھیا", "مینوں", "تسی", "کھیڈ", "کھیلو"];
  if (punjabiMarkers.some((m) => text.includes(m))) {
    return "pa";
  }
  return "ur";
}

interface ToolRoutingResult {
  action?: ToolAction;
  choices?: ChoiceOption[];
  confirmationReply?: string;
}

function evaluateToolRouting(
  utterance: string,
  lang: "en" | "ur" | "pa" | "ur-Latn" | "pa-Latn" | string,
  characterId: string
): ToolRoutingResult {
  const normalizedLang = lang.startsWith("ur") ? "ur" : lang.startsWith("pa") ? "pa" : "en";
  const lower = utterance.toLowerCase();

  // 1. Language Switching ("Can we speak Punjabi?", "Urdu please", "English please")
  if (lower.includes("punjabi") || lower.includes("پنجابی") || lower.includes("panjabi")) {
    return {
      action: {
        tool: "set_conversation_language",
        label: "Switch to Punjabi (پنجابی)",
        icon: "🗣️",
        params: { language: "pa" },
      },
      confirmationReply: "ہاں جی، بالکل! ہن اسیں پنجابی وچ گلاں کراں گے۔ تسیں اج کی کرنا چاہندے او؟",
    };
  }

  if (lower.includes("urdu") || lower.includes("اردو")) {
    return {
      action: {
        tool: "set_conversation_language",
        label: "Switch to Urdu (اردو)",
        icon: "🗣️",
        params: { language: "ur" },
      },
      confirmationReply: "جی بالکل! اب ہم اردو میں بات کریں گے۔ آپ آج مجھ سے کیا پوچھنا چاہتے ہیں؟",
    };
  }

  if (lower.includes("english") || lower.includes("انگریزی")) {
    return {
      action: {
        tool: "set_conversation_language",
        label: "Switch to English",
        icon: "🗣️",
        params: { language: "en" },
      },
      confirmationReply: "Awesome! Let's talk in English. What would you like to explore today?",
    };
  }

  // V6 VOICE-TO-ACTIVITY ROUTING
  // 1. "Teach me football." -> Move & Play
  if (
    lower.includes("football") ||
    lower.includes("soccer") ||
    lower.includes("teach me football") ||
    lower.includes("sports drill") ||
    utterance.includes("فٹ بال") ||
    utterance.includes("کھیل سکھاؤ")
  ) {
    const replies = {
      ur: "زبردست! فٹ بال کا کھیل اور جسمانی توازن سیکھتے ہیں۔ لومی آپ کے ساتھ فٹ بال کی پریکٹس شروع کر رہی ہے!",
      pa: "شاباش! آؤ فٹ بال دی سچی سچی پریکٹس کریے۔ میں موو اینڈ پلے گراؤنڈ کھول ریا واں!",
      en: "Awesome! Let's lace up and learn some fun football footwork and balance drills in Move & Play!",
    };
    return {
      action: {
        tool: "start_sports_drill",
        route: "/youth/play?world=move-play&activity=football-fundamentals",
        label: "Start Football Drill",
        icon: "⚽",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 2. "Let's make a cartoon." -> Story Adventure / Interactive Cartoon Player
  if (
    lower.includes("cartoon") ||
    lower.includes("make a cartoon") ||
    lower.includes("animated story") ||
    utterance.includes("کارٹون") ||
    utterance.includes("کارٹون بنائیں")
  ) {
    const replies = {
      ur: "واہ! کارٹون بنانے اور دیکھنے کا وقت! میا کے ساتھ انٹرایکٹو کارٹون تھیٹر کھل رہا ہے۔",
      pa: "واہ جی واہ! آؤ رل کے کارٹون ویکھیئے تے فیصلے کریے۔ کارٹون تھیٹر حاضر اے!",
      en: "Yay! Let's launch our interactive cartoon theater with Mia where you get to decide what happens next!",
    };
    return {
      action: {
        tool: "open_interactive_cartoon",
        route: "/youth/stories?cartoon=true",
        label: "Open Cartoon Theater",
        icon: "🎬",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 3. "Help me draw a dinosaur." -> Creative Studio Guided Drawing
  if (
    (lower.includes("draw") && lower.includes("dinosaur")) ||
    lower.includes("help me draw") ||
    lower.includes("drawing canvas") ||
    utterance.includes("ڈائنوسار بنائیں") ||
    utterance.includes("ڈرائنگ میں مدد")
  ) {
    const replies = {
      ur: "ڈائنوسار کی ڈرائنگ! چلیے کری ایٹو اسٹوڈیو میں چلتے ہیں، میں آپ کو قدم بہ قدم ڈائنوسار بنانا سکھاتی ہوں۔",
      pa: "ڈائنوسار دی تصویر! آؤ کری ایٹو اسٹوڈیو چلیے، میں تہاڈے نال رنگ بھرواں گی۔",
      en: "Rawr! Let's draw an awesome friendly dinosaur together in the Creative Studio step-by-step!",
    };
    return {
      action: {
        tool: "start_creative_drawing",
        route: "/youth/play?world=creative-studio&activity=draw-dinosaur",
        label: "Open Dinosaur Canvas",
        icon: "🎨",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 4. "Tell me a real story about space." -> Tech & Discovery / Space Story
  if (
    (lower.includes("story") && lower.includes("space")) ||
    lower.includes("real story about space") ||
    lower.includes("tell me about space") ||
    utterance.includes("خلا کی کہانی") ||
    utterance.includes("ستاروں کی کہانی")
  ) {
    const replies = {
      ur: "خلا کا سچا سفر! چلیے زین کے ساتھ کائنات اور سیاروں کے دلچسپ راز دریافت کرتے ہیں۔",
      pa: "خلا دی سچی کہانی! آؤ زین نال تاریاں تے سیاریاں دی سیر کریے۔",
      en: "Blast off! Zayn has a true adventure about planets, rockets, and the mysteries of deep space ready for you!",
    };
    return {
      action: {
        tool: "open_story",
        route: "/youth/stories?story=space-voyage",
        label: "Launch Space Voyage",
        icon: "🚀",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 5. "I am having trouble with my friends." -> Life & Friendship
  if (
    lower.includes("trouble with my friends") ||
    lower.includes("friend trouble") ||
    lower.includes("fight with friend") ||
    lower.includes("left out") ||
    lower.includes("excluded") ||
    utterance.includes("دوستوں سے مسئلہ") ||
    utterance.includes("لڑائی ہو گئی")
  ) {
    const replies = {
      ur: "دوستی میں اونچ نیچ ہونا قدرتی بات ہے، لیکن آپ اکیلے نہیں ہیں۔ آئیے لائف اینڈ فرینڈشپ میں مل کر راستہ تلاش کریں۔",
      pa: "دوستاں نال کدے کدے مسئلہ ہو جاندا اے، پر تسیں پریشان نہ ہووو۔ آؤ گل کریے۔",
      en: "Friendship bumps happen, and you are not alone. Let's explore feelings and gentle ways to solve it in Life & Friendship.",
    };
    return {
      action: {
        tool: "start_life_skills_mission",
        route: "/youth/emotions?world=life-friendship&topic=friendship-conflict",
        label: "Friendship Bridge",
        icon: "🤝",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 6. "Show me how computers work." -> Tech & Discovery AI & Coding Basics
  if (
    lower.includes("how computers work") ||
    lower.includes("show me computers") ||
    lower.includes("learn coding") ||
    lower.includes("ai literacy") ||
    utterance.includes("کمپیوٹر کیسے کام کرتا ہے") ||
    utterance.includes("کوڈنگ")
  ) {
    const replies = {
      ur: "کمپیوٹرز اور اے آئی کی دلچسپ دنیا! آئیے ٹیک اینڈ ڈسکوری میں دیکھیں کہ کمپیوٹر بٹس اور کوڈ کیسے کام کرتے ہیں۔",
      pa: "کمپیوٹر دی دنیا! آؤ ویکھیئے کوڈنگ کیویں ہوندی اے۔ ٹیک اینڈ ڈسکوری کھول رہیا واں!",
      en: "Computers run on curiosity and logic! Let's explore how binary codes and smart AI assistants work in Tech & Discovery!",
    };
    return {
      action: {
        tool: "start_tech_discovery",
        route: "/youth/activities?category=science&topic=how-computers-work",
        label: "Explore How Computers Work",
        icon: "💻",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 2. Math practice / Homework ("Help me with maths", "I have homework", "Maths questions")
  if (
    lower.includes("math") ||
    lower.includes("homework") ||
    lower.includes("fraction") ||
    lower.includes("addition") ||
    lower.includes("multiplication") ||
    utterance.includes("ریاضی") ||
    utterance.includes("حساب") ||
    utterance.includes("ہوم ورک") ||
    lower.includes("homework samajh")
  ) {
    const replies = {
      ur: "زبردست! آئیے مل کر ریاضی کے دلچسپ سوالات حل کرتے ہیں۔ میں آپ کا میتھ پیج کھول رہا ہوں۔",
      pa: "شاباش پیارے دوست! آؤ مل کے حساب دی پریکٹس کریے۔ میں حساب دا صفحہ کھول ریا واں۔",
      en: "Let's do some fun math together! I am opening your math practice right now.",
    };
    return {
      action: {
        tool: "start_math_practice",
        route: "/youth/activities?category=mathematics",
        label: "Open Math Practice",
        icon: "🔢",
        params: { category: "mathematics" },
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 3. Bedtime / Moral Story ("Tell me a story", "Bedtime story", "I want a story", "Kahani sunao")
  if (
    lower.includes("story") ||
    lower.includes("bedtime") ||
    lower.includes("kahani") ||
    utterance.includes("کہانی") ||
    utterance.includes("کہانیاں")
  ) {
    const replies = {
      ur: "بہت خوب! میرے پاس ایک بہت ہی پیاری اور سبق آموز کہانی ہے۔ آئیے کہانیوں کی دنیا میں چلتے ہیں۔",
      pa: "واہ جی واہ! میرے کول اک بڑی سوہنی کہانی اے۔ آؤ کہانی سنئے!",
      en: "I have a wonderful story ready for you! Opening story time right now.",
    };
    return {
      action: {
        tool: "open_story",
        route: "/youth/stories",
        label: "Open Story Reader",
        icon: "📖",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 4. Learning Games & Puzzles ("I want to play a game", "Let's play", "khed")
  if (
    lower.includes("play a game") ||
    lower.includes("want a game") ||
    lower.includes("let's play") ||
    lower.includes("play game") ||
    utterance.includes("کھیل کھیلنا") ||
    utterance.includes("کھیل") ||
    lower.includes("khed khilao") ||
    lower.includes("koi khed") ||
    utterance.includes("کھیڈ")
  ) {
    const replies = {
      ur: "کھیل کا وقت! آئیے ایک زبردست تعلیمی گیم کھیلتے ہیں۔ میں گیمز کھول رہا ہوں۔",
      pa: "کھیڈن دا ویلا آ گیا! آؤ رل کے مزے دار کھیل کھیڈیے۔ میں پیج کھول ریا واں۔",
      en: "Game time! Let's play an exciting learning adventure together!",
    };
    return {
      action: {
        tool: "start_learning_activity",
        route: "/youth/activities",
        label: "Open Learning Games",
        icon: "🎮",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 5. Visual Schedule & Routine ("What do I do next?", "Show me my day", "routine", "schedule")
  if (
    lower.includes("routine") ||
    lower.includes("schedule") ||
    lower.includes("what do i do next") ||
    lower.includes("what should i do next") ||
    lower.includes("my day") ||
    utterance.includes("روٹین") ||
    utterance.includes("شیڈول") ||
    utterance.includes("ٹائم ٹیبل")
  ) {
    const replies = {
      ur: "آئیے مل کر دیکھتے ہیں کہ آج آپ کا اگلا مرحلہ کیا ہے۔ آپ کا شیڈول حاضر ہے!",
      pa: "آؤ ویکھئے اج تہاڈے دن دا اگلا کم کیہڑا اے۔ شیڈول تہاڈے سامنے اے۔",
      en: "Let's look at your day together! Opening your visual routine now.",
    };
    return {
      action: {
        tool: "open_visual_schedule",
        route: "/youth/routines",
        label: "Open My Routine",
        icon: "📅",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 6. Feelings & Emotional Expression ("I feel sad", "I feel angry", "I am worried", "feelings")
  if (
    lower.includes("feel sad") ||
    lower.includes("feel angry") ||
    lower.includes("feel mad") ||
    lower.includes("feel worried") ||
    lower.includes("feel scared") ||
    lower.includes("upset") ||
    utterance.includes("اداس") ||
    utterance.includes("غصہ") ||
    utterance.includes("پریشان") ||
    lower.includes("khush") ||
    lower.includes("udaas")
  ) {
    const replies = {
      ur: "آپ کے جذبات بہت اہم ہیں۔ پریشان نہ ہوں، میں آپ کے ساتھ ہوں۔ آئیے احساسات کا پہیہ دیکھتے ہیں۔",
      pa: "تہاڈے دل دی گل بڑی اہم اے۔ لومی تہاڈے کول اے، آؤ پرسکون ہوئیے۔",
      en: "I'm right here with you, and it's okay to feel that way. Let's explore our feelings together.",
    };
    return {
      action: {
        tool: "open_feelings_activity",
        route: "/youth/emotions",
        label: "Open Feelings Wheel",
        icon: "💛",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 7. Calm Breaths & Quiet Sensory Time ("I want something quiet", "breathe", "calm down")
  if (
    lower.includes("something quiet") ||
    lower.includes("calm down") ||
    lower.includes("take a breath") ||
    lower.includes("bunny breath") ||
    lower.includes("belly breath") ||
    utterance.includes("پرسکون") ||
    utterance.includes("سانس") ||
    utterance.includes("سکون")
  ) {
    const replies = {
      ur: "بہت اچھا خیال ہے۔ آئیے چند نرم اور پرسکون سانسیں لیتے ہیں تاکہ ہمارا جسم اور ذہن پرسکون ہو جائے۔",
      pa: "آؤ رل کے ہولا جیا ساہ لئیے تے سکون پائیے۔",
      en: "Taking calm belly breaths helps our body feel so safe and peaceful. Let's do a gentle breathing exercise.",
    };
    return {
      action: {
        tool: "start_calm_activity",
        route: "/youth/emotions",
        label: "Start Calm Breaths",
        icon: "🌸",
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 8. Science & Dinosaurs ("Teach me about dinosaurs", "science", "space", "planets")
  if (
    lower.includes("dinosaur") ||
    lower.includes("science") ||
    lower.includes("planet") ||
    lower.includes("space") ||
    utterance.includes("سائنس") ||
    utterance.includes("ڈائنوسار")
  ) {
    const replies = {
      ur: "ڈائنوسار اور سائنس! یہ تو بہت ہی زبردست دنیا ہے۔ آئیے سائنس اور تحقیق کا صفحہ کھولتے ہیں۔",
      pa: "ڈائنوسار تے سائنس! آؤ نویاں چیزاں دی کھوج کرئیے۔",
      en: "Rawr! Dinosaurs and science mysteries are incredible! Let's explore science adventures together!",
    };
    return {
      action: {
        tool: "start_learning_activity",
        route: "/youth/activities?category=science_and_discovery",
        label: "Explore Science Activities",
        icon: "🔬",
        params: { category: "science_and_discovery" },
      },
      confirmationReply: replies[normalizedLang as "ur" | "pa" | "en"] || replies.en,
    };
  }

  // 9. Memory Game ("Memory game", "card match")
  if (lower.includes("memory game") || lower.includes("card match") || utterance.includes("یادداشت")) {
    return {
      action: {
        tool: "start_memory_game",
        route: "/youth/activities?category=memory",
        label: "Start Memory Match",
        icon: "🃏",
      },
      confirmationReply:
        normalizedLang === "ur"
          ? "آئیے دیکھتے ہیں آپ کی یادداشت کتنی تیز ہے! کارڈز کا جوڑا بنانے کا کھیل شروع ہو رہا ہے۔"
          : "Let's test your super memory! Opening your memory card match right now.",
    };
  }

  // 10. Show Learning Progress / Trophies ("How am I doing?", "My trophies", "progress")
  if (
    lower.includes("how am i doing") ||
    lower.includes("my progress") ||
    lower.includes("badges") ||
    lower.includes("trophies") ||
    lower.includes("achievements") ||
    utterance.includes("انعام") ||
    utterance.includes("ستارے")
  ) {
    return {
      action: {
        tool: "show_learning_progress",
        route: "/youth/achievements",
        label: "View My Achievements",
        icon: "🏆",
      },
      confirmationReply:
        normalizedLang === "ur"
          ? "آپ نے بہت محنت کی ہے! آئیے دیکھتے ہیں کہ آپ نے کتنے ستارے اور بیجز جیتے ہیں۔"
          : "You have been doing fantastic work! Look at all your earned trophies and stars.",
    };
  }

  // 11. Suggest Offline Activity / Drawing ("Suggest an offline activity", "build something", "drawing")
  if (
    lower.includes("offline") ||
    lower.includes("build something") ||
    lower.includes("drawing") ||
    lower.includes("craft") ||
    utterance.includes("ڈرائنگ") ||
    utterance.includes("تصویر")
  ) {
    return {
      action: {
        tool: "suggest_offline_activity",
        route: "/youth/visual-supports",
        label: "Open Drawing & Visual Tools",
        icon: "🎨",
      },
      confirmationReply:
        normalizedLang === "ur"
          ? "کاغذ اور رنگ نکالیں! آئیے ایک خوبصورت ڈرائنگ یا ماڈل بناتے ہیں۔"
          : "Hands-on creativity time! Grab some paper and pencils—let's make something amazing offline.",
    };
  }

  // 12. Ambiguous Query ("I'm bored", "What should I do?", "What can we do?")
  if (
    lower.includes("bored") ||
    lower.includes("what should i do") ||
    lower.includes("what can we do") ||
    lower.includes("kujh samajh nahi") ||
    utterance.includes("بور") ||
    utterance.includes("کیا کریں")
  ) {
    return {
      choices: [
        {
          label: normalizedLang === "ur" ? "📖 کہانی سنیں" : "📖 Listen to a Story",
          icon: "📖",
          action: {
            tool: "open_story",
            route: "/youth/stories",
            label: "Open Story Reader",
          },
        },
        {
          label: normalizedLang === "ur" ? "🎮 کھیل کھیلیں" : "🎮 Play a Fun Game",
          icon: "🎮",
          action: {
            tool: "start_learning_activity",
            route: "/youth/activities",
            label: "Open Learning Games",
          },
        },
      ],
      confirmationReply:
        normalizedLang === "ur"
          ? "کوئی بات نہیں! ہم مل کر مزہ کر سکتے ہیں۔ بتائیں، کیا آپ ایک پیاری کہانی سننا چاہتے ہیں یا کوئی کھیل کھیلنا چاہتے ہیں؟"
          : "We have lots of fun things we can do! Would you like to hear an exciting story, or play a fun game?",
    };
  }

  return {};
}

function generateCharacterReply(
  characterId: string,
  userText: string,
  lang: string,
  ageTier: string
): string {
  const lower = userText.toLowerCase();

  // 1. KAI — THE CURIOUS LEARNING GUIDE
  if (characterId === "kai") {
    if (
      lower.includes("don't understand this question") ||
      lower.includes("dont understand this question") ||
      lower.includes("don't get this question") ||
      lower.includes("not understanding this")
    ) {
      return "That's completely okay! Tricky questions are just puzzles in disguise. What is the very first sentence or number that the question mentions?";
    }

    if (
      userText.includes("مجھے یہ سوال سمجھ نہیں آ رہا") ||
      userText.includes("سوال سمجھ نہیں آ رہا") ||
      userText.includes("سوال سمجھ نہیں آیا")
    ) {
      return "کوئی بات نہیں! مشکل سوالات دیکھ کر پریشان ہونا قدرتی بات ہے۔ آئیے مل کر دیکھتے ہیں۔ سب سے پہلے بتائیں کہ سوال میں کیا معلومات دی گئی ہیں؟";
    }

    if (
      lower.includes("mainu homework samajh nahi aa reha") ||
      userText.includes("Mainu homework samajh nahi aa reha") ||
      userText.includes("ہوم ورک سمجھ نہیں") ||
      userText.includes("ہوم ورک سمجھ نئیں")
    ) {
      return "فکر نہ کرو پیارے دوست! ہوم ورک اوکھا لگ سکدا اے، پر اسیں مل کے کر لواں گے۔ سوال دا پہلا جملہ کی کہندا اے؟ مینوں دسّو۔";
    }

    if (lang === "ur") {
      return "بہت عمدہ سوال! جب ہم کوشش کرتے ہیں تو ہمارا دماغ مضبوط ہوتا ہے۔ آئیے اس کو چھوٹے حصوں میں تقسیم کر کے سمجھتے ہیں۔";
    }

    if (lang === "pa") {
      return "شاباش! سوال پچھنا ہی سکھن دا پہلا قدم اے۔ آؤ مل کے ایہدا حل لبھدے آں۔";
    }

    return "That's a fantastic thing to explore. If you had to guess the very first clue, where would you start?";
  }

  // 2. MIA — THE WARM CREATIVE GUIDE
  if (characterId === "mia") {
    if (lang === "ur") {
      if (userText.includes("کہانی") || lower.includes("story")) {
        return "ایک دفعہ کا ذکر ہے کہ ایک چھوٹے جنگل میں ایک نٹکھٹ تتلی رہتی تھی جو سب کے چہروں پر مسکراہٹ لاتی تھی۔ کیا آپ اس کے سفر کے بارے میں سننا چاہیں گے؟";
      }
      return "میں بڑی محبت سے آپ کی بات سن رہی ہوں۔ آپ جو محسوس کرتے ہیں وہ اہم ہے۔ آپ اس بارے میں کیسا محسوس کر رہے ہیں؟";
    }

    if (lang === "pa") {
      return "تہاڈی گل سن کے بڑا چنگا لگیا۔ دل دے سارے والولے میرے نال سانجھے کر سکدے او۔";
    }

    return "I'm right here listening with my whole heart. How does talking about it make your chest or shoulders feel right now?";
  }

  // 3. LUMI — THE CALM GUIDE
  if (characterId === "lumi") {
    if (lang === "ur") {
      return "آرام سے بیٹھیں۔ کندھوں کو ڈھیلا چھوڑ دیں اور ایک پرسکون سانس لیں۔ لومی آپ کے ساتھ ہے۔";
    }

    if (lang === "pa") {
      return "اک لمبا تے سوہنا ساہ لئو۔ لومی تہاڈے کول اے، کوئی جلدی نئیں، سارا سکون تہاڈا اے۔";
    }

    return "Notice your feet resting on the floor and take a nice, slow, comforting breath with me. There is no rush at all.";
  }

  // 4. ZAYN — THE ENERGETIC EXPLORER
  if (characterId === "zayn") {
    if (lang === "ur") {
      return "ارے واہ! سائنس کی دنیا تو حیرت انگیز رازوں سے بھری ہے۔ کیا آپ کو معلوم ہے کہ نیلا وہیل مچھلی کا دل ایک کار جتنا بڑا ہوتا ہے؟";
    }

    if (lang === "pa") {
      return "اوئے ہوئے! کھوج لئی میں ہر ویلے تیار آں۔ اک سوہنی پہیلی دساں یا خلا دے راز؟";
    }

    return "Discovery mode activated! The universe has so many cool mysteries. What question should our explorer mission tackle next?";
  }

  return "I'm so glad we're talking! Tell me more about that.";
}
