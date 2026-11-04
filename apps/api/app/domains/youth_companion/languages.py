"""InnerOS Youth Language and Dialect Engine.

Supports:
- English (en)
- Urdu (ur - Nastaliq Arabic script)
- Roman Urdu (ur-Latn - Latin script)
- Pakistani Punjabi (pa - Shahmukhi Arabic script)
- Roman Punjabi (pa-Latn - Latin script)
- Natural Code-Switching (Urdu-English, Punjabi-English, Punjabi-Urdu)

Crucial Principle:
Natural Pakistani Punjabi phrasing validated by native speakers is strictly used,
never literal word-for-word translation, and NEVER silent substitution of Hindi or Gurmukhi.
"""

from typing import List, Dict, Optional, Tuple
from app.domains.youth_companion.schemas import YouthLanguageMeta


YOUTH_SUPPORTED_LANGUAGES: List[YouthLanguageMeta] = [
    YouthLanguageMeta(
        code="en",
        name="English",
        native_name="English",
        direction="ltr",
        script="Latin",
        stt_status="fully_supported",
        tts_status="fully_supported",
        safety_phrases_reviewed=True,
        cultural_notes="Calibrated for positive psychology, emotional naming, and non-punitive gentle pacing.",
    ),
    YouthLanguageMeta(
        code="ur",
        name="Urdu (Nastaliq)",
        native_name="اردو",
        direction="rtl",
        script="Nastaliq",
        stt_status="fully_supported",
        tts_status="fully_supported",
        safety_phrases_reviewed=True,
        cultural_notes="Nastaliq script orientation with increased line-height (2.1). Respectful informal/formal balance (Aap / Tum).",
    ),
    YouthLanguageMeta(
        code="ur-Latn",
        name="Roman Urdu",
        native_name="Roman Urdu",
        direction="ltr",
        script="Latin",
        stt_status="fully_supported_phonetic",
        tts_status="supported_via_urdu_synthesis",
        safety_phrases_reviewed=True,
        cultural_notes="Phonetic Latin transliteration widely used by Pakistani youth in digital chat.",
    ),
    YouthLanguageMeta(
        code="pa",
        name="Pakistani Punjabi (Shahmukhi)",
        native_name="پنجابی (شاہ مکھی)",
        direction="rtl",
        script="Shahmukhi",
        stt_status="supported_with_clarification",
        tts_status="unsupported_voice_fallback_text",
        safety_phrases_reviewed=True,
        cultural_notes=(
            "Native Majhi/Lahori Punjabi phrasing in Shahmukhi (Perso-Arabic script). "
            "To prevent deceptive mock audio or acoustic mismatch with Hindi/Gurmukhi synthesis, "
            "voice output is currently disabled with clear UI explanation and screen-reader/text fallback."
        ),
    ),
    YouthLanguageMeta(
        code="pa-Latn",
        name="Roman Punjabi",
        native_name="Roman Punjabi",
        direction="ltr",
        script="Latin",
        stt_status="supported_phonetic",
        tts_status="unsupported_voice_fallback_text",
        safety_phrases_reviewed=True,
        cultural_notes="Colloquial Latin transliteration of Pakistani Punjabi idioms.",
    ),
]


# Explicit Pakistani Punjabi Vocabulary & Marker Dictionaries (Native phrasing)
PUNJABI_SHAHMUKHI_MARKERS = [
    "تسی", "تسیں", "تہاڈا", "تواڈا", "مینوں", "تہانوں", "سانوں", "کی گل", "کی ہویا",
    "ایتھے", "اوکھا", "سوکھا", "ہور", "نئیں", "آؤ", "کرنا ایں", "جاندے او", "چاہندے او",
    "پیندا اے", "کیتا اے", "کی کیتا", "دسنا", "دس دیو", "سوہنا", "سوہنی", "کدی", "چنگا"
]

PUNJABI_ROMAN_MARKERS = [
    "tusi", "tusin", "menu", "mainu", "tainu", "tanu", "sanon", "ki hoya", "ki gal",
    "ethe", "aukha", "saukha", "hor", "painda", "paindi", "kita ae", "ki kita",
    "dasna", "das deo", "chahnde ho", "chahnde o", "sohna", "changay", "changa", "nai"
]

URDU_ARABIC_MARKERS = [
    "آپ", "مجھے", "ہمیں", "کیا", "کیوں", "کیسے", "نہیں", "کر رہے ہیں", "چاہتے ہیں",
    "ہوتا ہے", "سکتا ہے", "بات", "پریشان", "خوش", "اداس", "ڈر", "سکول", "محسوس"
]

URDU_ROMAN_MARKERS = [
    "kya", "aap", "mujhe", "mera", "meri", "theek", "kaise", "bohot", "boht",
    "dil", "pareshan", "thak", "shukriya", "batao", "batayein", "acha", "achi",
    "hain", "hoon", "darr", "lagta", "lagti", "samajh", "chaliye"
]


def detect_youth_language_and_script(text: str, user_override: Optional[str] = None) -> Tuple[str, str, bool]:
    """Detects language, script, and whether code-switching is occurring.

    Returns:
        (detected_language, target_script, is_code_switched)
        e.g. ("ur", "Nastaliq", False) or ("pa", "Shahmukhi", False) or ("ur-Latn", "Latin", True)
    """
    if user_override and user_override not in ["auto", ""]:
        # If user explicitly picked an override, respect it
        script = "Latin"
        if user_override in ["ur", "pa"]:
            script = "Nastaliq" if user_override == "ur" else "Shahmukhi"
        return user_override, script, False

    if not text or not text.strip():
        return "en", "Latin", False

    lower = text.lower().strip()
    has_arabic_script = any("\u0600" <= c <= "\u06ff" for c in text)

    # 1. Arabic/Perso-Arabic script branch
    if has_arabic_script:
        # Check for Punjabi Shahmukhi specific words
        shahmukhi_hits = sum(1 for m in PUNJABI_SHAHMUKHI_MARKERS if m in text)
        if shahmukhi_hits >= 1 or any(w in text for w in ["کی ہویا", "کی کیتا", "مینوں", "تسیں", "تسی"]):
            return "pa", "Shahmukhi", False
        return "ur", "Nastaliq", False

    # 2. Latin script branch
    punjabi_roman_hits = sum(1 for m in PUNJABI_ROMAN_MARKERS if f" {m} " in f" {lower} ")
    urdu_roman_hits = sum(1 for m in URDU_ROMAN_MARKERS if f" {m} " in f" {lower} ")

    english_words = ["the", "and", "school", "friend", "teacher", "feel", "nervous", "scared", "sad", "happy", "test", "exam", "mom", "dad"]
    english_hits = sum(1 for w in english_words if f" {w} " in f" {lower} ")

    # Check for Roman Punjabi
    if punjabi_roman_hits >= 1 or any(phrase in lower for phrase in ["ki hoya", "ki kita", "menu school", "tusi daso"]):
        is_mixed = english_hits >= 1
        return "pa-Latn", "Latin", is_mixed

    # Check for Roman Urdu
    if urdu_roman_hits >= 1 or any(phrase in lower for phrase in ["kya hua", "maine kya kiya", "darr lagta", "aap batao"]):
        is_mixed = english_hits >= 1
        return "ur-Latn", "Latin", is_mixed

    # Default to English
    return "en", "Latin", False


def get_native_clarification_prompt(language: str) -> str:
    """Returns low-confidence clarification prompt in the child's native language and script."""
    prompts = {
        "ur": "معذرت، آواز صاف نہیں آئی۔ کیا آپ دوبارہ آرام سے بول سکتے ہیں یا نیچے لکھ سکتے ہیں؟",
        "ur-Latn": "Awaaz thodi saaf nahi aayi. Kya aap aaraam se dobara bol sakte hain ya neeche likh sakte hain?",
        "pa": "آواز صاف نہیں آئی جی۔ کی تسیں دوبارہ ہولی بولو گے یا تھلے لکھ دیو گے؟",
        "pa-Latn": "Awaaz saaf nahi aayi ji. Ki tusi dobara aaraam naal bolo ge ya thalle likh deo ge?",
        "en": "I want to make sure I heard you right without guessing. The sound was a bit quiet or noisy—could you say that again gently, or type it below?",
    }
    return prompts.get(language, prompts["en"])
