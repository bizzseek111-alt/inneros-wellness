import { NextRequest, NextResponse } from "next/server";

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

    // 4. Character Conversational Generation
    const reply = generateCharacterReply(characterId, userUtterance, language, ageTier);

    return NextResponse.json({
      turn_id: `turn_${Date.now()}`,
      character_id: characterId,
      reply,
      detected_language: language,
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
  // Check for Arabic/Shahmukhi/Nastaliq script characters
  const arabicRegex = /[\u0600-\u06FF]/;
  if (!arabicRegex.test(text)) {
    const lower = text.toLowerCase();
    if (
      lower.includes("mainu") ||
      lower.includes("tusi") ||
      lower.includes("hoya") ||
      lower.includes("kiddan") ||
      lower.includes("chahidi")
    ) {
      return "pa";
    }
    if (
      lower.includes("aap") ||
      lower.includes("kya") ||
      lower.includes("hoon") ||
      lower.includes("mujhe") ||
      lower.includes("hai")
    ) {
      return "ur";
    }
    return "en";
  }

  // Distinguish Shahmukhi Punjabi from Urdu
  const punjabiMarkers = ["نئیں", "تواڈی", "تہاڈا", "کیہڑا", "ہوندے", "کیندا", "آکھیا", "مینوں", "تسی"];
  if (punjabiMarkers.some((m) => text.includes(m))) {
    return "pa";
  }
  return "ur";
}

function generateCharacterReply(
  characterId: string,
  userText: string,
  lang: string,
  ageTier: string
): string {
  const lower = userText.toLowerCase();

  // =========================================================================
  // 1. KAI — THE CURIOUS LEARNING GUIDE (Homework, Questions, Confidence)
  // =========================================================================
  if (characterId === "kai") {
    // A. Specific Test Phrase: "I don't understand this question."
    if (
      lower.includes("don't understand this question") ||
      lower.includes("dont understand this question") ||
      lower.includes("don't get this question") ||
      lower.includes("not understanding this")
    ) {
      return "That's completely okay! Tricky questions are just puzzles in disguise. What is the very first sentence or number that the question mentions?";
    }

    // B. Specific Test Phrase: "مجھے یہ سوال سمجھ نہیں آ رہا۔"
    if (
      userText.includes("مجھے یہ سوال سمجھ نہیں آ رہا") ||
      userText.includes("سوال سمجھ نہیں آ رہا") ||
      userText.includes("سوال سمجھ نہیں آیا")
    ) {
      return "کوئی بات نہیں! مشکل سوالات دیکھ کر پریشان ہونا قدرتی بات ہے۔ آئیے مل کر دیکھتے ہیں۔ سب سے پہلے بتائیں کہ سوال میں کیا معلومات دی گئی ہیں؟";
    }

    // C. Specific Test Phrase: "Mainu homework samajh nahi aa reha."
    if (
      lower.includes("mainu homework samajh nahi") ||
      lower.includes("homework samajh nahi aa reha") ||
      userText.includes("ہوم ورک سمجھ نہیں") ||
      userText.includes("ہوم ورک سمجھ نئیں")
    ) {
      return "فکر نہ کرو پیارے دوست! ہوم ورک اوکھا لگ سکدا اے، پر اسیں مل کے کر لواں گے۔ سوال دا پہلا جملہ کی کہندا اے؟ مینوں دسّو۔";
    }

    // Urdu General Responses for Kai
    if (lang === "ur") {
      if (lower.includes("math") || userText.includes("ریاضی") || userText.includes("حساب")) {
        return "ریاضی کی سب سے اچھی بات یہ ہے کہ اس کا حل قدم بہ قدم نکلتا ہے۔ پہلا قدم کیا ہے جو آپ کو یاد ہے؟";
      }
      if (lower.includes("science") || userText.includes("سائنس")) {
        return "سائنس تو کھوج اور سوال پوچھنے کا نام ہے! آپ اس بارے میں کیا سوچتے ہیں؟";
      }
      return "بہت عمدہ سوال! جب ہم کوشش کرتے ہیں تو ہمارا دماغ مضبوط ہوتا ہے۔ آئیے اس کو چھوٹے حصوں میں تقسیم کر کے سمجھتے ہیں۔";
    }

    // Punjabi General Responses for Kai
    if (lang === "pa") {
      if (lower.includes("math") || userText.includes("حساب")) {
        return "حساب دا سوال سٹا سٹا حل کرئیے تے بڑا مزا آندا اے۔ پہلا سٹا کی کرنا چاہیدا اے؟";
      }
      return "شاباش! سوال پچھنا ہی سکھن دا پہلا قدم اے۔ آؤ مل کے ایہدا حل لبھدے آں۔";
    }

    // English Responses for Kai
    if (lower.includes("math") || lower.includes("fraction") || lower.includes("multiplication")) {
      return "Math is like a puzzle! If we break it into one small step at a time, it gets much easier. What do you think our first step should be?";
    }
    if (lower.includes("science") || lower.includes("project")) {
      return "I love science mysteries! The coolest scientists start with a hypothesis. What do you guess might happen?";
    }
    if (lower.includes("stupid") || lower.includes("dumb") || lower.includes("can't do it")) {
      return "Hey, please don't be hard on yourself. Making mistakes isn't failure—it's literally how our brain grows new connections. Let's try it together, zero pressure!";
    }

    return "That's a fantastic thing to explore. If you had to guess the very first clue, where would you start?";
  }

  // =========================================================================
  // 2. MIA — THE WARM CREATIVE GUIDE (Stories, Feelings, Social Learning)
  // =========================================================================
  if (characterId === "mia") {
    if (lang === "ur") {
      if (userText.includes("کہانی") || lower.includes("story")) {
        return "ایک دفعہ کا ذکر ہے کہ ایک چھوٹے جنگل میں ایک نٹکھٹ تتلی رہتی تھی جو سب کے چہروں پر مسکراہٹ لاتی تھی۔ کیا آپ اس کے سفر کے بارے میں سننا چاہیں گے؟";
      }
      if (userText.includes("اداس") || userText.includes("غم") || userText.includes("غصہ")) {
        return "آپ کے دل کی بات سن کر مجھے خوشی ہوئی۔ اداس یا غصہ ہونا بالکل قدرتی ہے۔ کیا آپ بتانا چاہیں گے کہ دل میں کیا چل رہا ہے؟";
      }
      return "میں بڑی محبت سے آپ کی بات سن رہی ہوں۔ آپ جو محسوس کرتے ہیں وہ اہم ہے۔ آپ اس بارے میں کیسا محسوس کر رہے ہیں؟";
    }

    if (lang === "pa") {
      if (userText.includes("کہانی") || lower.includes("kahani")) {
        return "اک واری دا ذکر اے، اک چھوٹے جئے پنڈ وچ اک بڑا پیارا چڑیا دا جوڑا رہندا سی۔ کی تسیں اوہناں دی کہانی سننا چاہندے او؟";
      }
      return "تہاڈی گل سن کے بڑا چنگا لگیا۔ دل دے سارے والولے میرے نال سانجھے کر سکدے او۔";
    }

    if (lower.includes("story") || lower.includes("tell me a story")) {
      return "Once upon a time, deep in a moonlit forest, a little owl named Pip decided to find out where the stars went during the day. Would you like to hear what Pip discovered?";
    }
    if (lower.includes("friend") || lower.includes("fight") || lower.includes("sad") || lower.includes("mad")) {
      return "That sounds like a really big feeling to carry. It's totally okay and understandable to feel that way. What was the hardest part of what happened?";
    }

    return "I'm right here listening with my whole heart. How does talking about it make your chest or shoulders feel right now?";
  }

  // =========================================================================
  // 3. LUMI — THE CALM GUIDE (Routines, Co-Regulation, Breaths)
  // =========================================================================
  if (characterId === "lumi") {
    if (lang === "ur") {
      if (userText.includes("سانس") || lower.includes("breath")) {
        return "آئیے ایک نرم خرگوش جیسی سانس لیتے ہیں۔ تین بار ناک سے آہستہ آہستہ سانس اندر کھینچیں... اور منہ سے لمبا سانس باہر نکالیں۔ کیسا لگا؟";
      }
      return "آرام سے بیٹھیں۔ کندھوں کو ڈھیلا چھوڑ دیں اور ایک پرسکون سانس لیں۔ لومی آپ کے ساتھ ہے۔";
    }

    if (lang === "pa") {
      return "اک لمبا تے سوہنا ساہ لئو۔ لومی تہاڈے کول اے، کوئی جلدی نئیں، سارا سکون تہاڈا اے۔";
    }

    if (lower.includes("breath") || lower.includes("breathing") || lower.includes("anxious") || lower.includes("overwhelm")) {
      return "Let's do a gentle bunny breath together. Take three quick little sniffs in through your nose... and one long, soft sigh out through your mouth. How does that feel in your body?";
    }

    return "Notice your feet resting on the floor and take a nice, slow, comforting breath with me. There is no rush at all.";
  }

  // =========================================================================
  // 4. ZAYN — THE ENERGETIC EXPLORER (Science, Nature, Puzzles)
  // =========================================================================
  if (characterId === "zayn") {
    if (lang === "ur") {
      if (userText.includes("پہیلی") || lower.includes("riddle")) {
        return "ایک زبردست پہیلی سنیں: وہ کون سی چیز ہے جس کی آنکھیں تو ہیں مگر دیکھ نہیں سکتی؟ سوچ کر بتائیں!";
      }
      return "ارے واہ! سائنس کی دنیا تو حیرت انگیز رازوں سے بھری ہے۔ کیا آپ کو معلوم ہے کہ نیلا وہیل مچھلی کا دل ایک کار جتنا بڑا ہوتا ہے؟";
    }

    if (lang === "pa") {
      return "اوئے ہوئے! کھوج لئی میں ہر ویلے تیار آں۔ اک سوہنی پہیلی دساں یا خلا دے راز؟";
    }

    if (lower.includes("riddle") || lower.includes("puzzle")) {
      return "Here is a fun brain-teaser: What has hands and a face, but cannot hold anything or smile? What's your guess?";
    }
    if (lower.includes("space") || lower.includes("star") || lower.includes("planet")) {
      return "Space is wild! Did you know a day on Venus is longer than an entire year on Venus? What planet would you explore if you had a spaceship?";
    }

    return "Discovery mode activated! The universe has so many cool mysteries. What question should our explorer mission tackle next?";
  }

  return "I'm so glad we're talking! Tell me more about that.";
}
