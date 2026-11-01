"""InnerOS Multilingual Architecture.

Defines the 30 architected languages with explicit readiness tier classifications,
RTL/LTR script direction, dialect notes, and non-clinical cultural caveats.

CRITICAL PRINCIPLE:
InnerOS never claims a language is production-ready merely because an external
speech recognition or synthesis API supports the locale code.
"""

from typing import List, Dict
from app.gateways.voice.base import LanguageInfo, LanguageReadinessTier

ARCHITECTED_LANGUAGES: List[LanguageInfo] = [
    # -------------------------------------------------------------
    # PRIORITY TIER 1: Fully Benchmarked & Culturally Reviewed
    # -------------------------------------------------------------
    LanguageInfo(
        code="en",
        name="English",
        native_name="English",
        tier=LanguageReadinessTier.TIER_1_CLINICALLY_REVIEWED,
        direction="ltr",
        dialects=["en-US (General American)", "en-GB (Received Pronunciation)", "en-AU (Australian)", "en-IN (Indian English)"],
        clinical_safety_reviewed=True,
        caveats="Fully vetted for crisis phrase interception and conversational non-clinical safety.",
    ),
    LanguageInfo(
        code="es",
        name="Spanish",
        native_name="Español",
        tier=LanguageReadinessTier.TIER_1_CLINICALLY_REVIEWED,
        direction="ltr",
        dialects=["es-ES (Castilian)", "es-MX (Mexican)", "es-CO (Colombian)", "es-AR (Rioplatense)"],
        clinical_safety_reviewed=True,
        caveats="Calibrated for regional emotional idioms and non-clinical reflective pacing.",
    ),
    LanguageInfo(
        code="fr",
        name="French",
        native_name="Français",
        tier=LanguageReadinessTier.TIER_1_CLINICALLY_REVIEWED,
        direction="ltr",
        dialects=["fr-FR (Metropolitan)", "fr-CA (Quebecois)", "fr-BE (Belgian)"],
        clinical_safety_reviewed=True,
        caveats="Culturally reviewed for formal vs informal address (tu/vous) in therapeutic emotional presence.",
    ),
    LanguageInfo(
        code="de",
        name="German",
        native_name="Deutsch",
        tier=LanguageReadinessTier.TIER_1_CLINICALLY_REVIEWED,
        direction="ltr",
        dialects=["de-DE (High German)", "de-AT (Austrian)", "de-CH (Swiss German standard)"],
        clinical_safety_reviewed=True,
        caveats="Dialect comprehension verified for standard Austrian and Swiss German phonology.",
    ),

    # -------------------------------------------------------------
    # PRIORITY TIER 2: Qualified Regional Implementations (Vetted Dialects)
    # -------------------------------------------------------------
    LanguageInfo(
        code="ur",
        name="Urdu",
        native_name="اردو",
        tier=LanguageReadinessTier.TIER_2_QUALIFIED_REGIONAL,
        direction="rtl",
        dialects=["ur-PK (Standard Pakistani / Karachi)", "ur-PK (Lahori)", "Roman Urdu (Latin transliteration)"],
        clinical_safety_reviewed=True,
        caveats="Nastaliq script orientation supported. Roman Urdu text fallback supported. Safety phrases calibrated for regional crisis lines (Umang, Rozan).",
    ),
    LanguageInfo(
        code="bg",
        name="Bulgarian",
        native_name="Български",
        tier=LanguageReadinessTier.TIER_2_QUALIFIED_REGIONAL,
        direction="ltr",
        dialects=["bg-BG (Standard Sofia)", "bg-BG (Eastern Rhodope)", "bg-BG (Western Shop)"],
        clinical_safety_reviewed=True,
        caveats="Full Cyrillic rendering. Calibrated for Bulgarian emotional reflection norms and 112 emergency routing.",
    ),
    LanguageInfo(
        code="ar",
        name="Arabic",
        native_name="العربية",
        tier=LanguageReadinessTier.TIER_2_QUALIFIED_REGIONAL,
        direction="rtl",
        dialects=["ar-MSA (Modern Standard Arabic)", "ar-EG (Egyptian)", "ar-AE (Gulf)", "ar-LB (Levantine)"],
        clinical_safety_reviewed=True,
        caveats="RTL layout enforced. Modern Standard Arabic prioritized for companion speech; Levantine and Gulf dialect listening comprehension enabled.",
    ),
    LanguageInfo(
        code="hi",
        name="Hindi",
        native_name="हिन्दी",
        tier=LanguageReadinessTier.TIER_2_QUALIFIED_REGIONAL,
        direction="ltr",
        dialects=["hi-IN (Standard Khariboli)", "Hinglish (Hindi-English code-switching)"],
        clinical_safety_reviewed=True,
        caveats="Devanagari rendering supported. Hinglish code-switching evaluation harness passed. Safety phrases linked to AASRA & Vandrevala Foundation.",
    ),

    # -------------------------------------------------------------
    # TIER 3: Experimental / Beta Global Languages (Architected API Tier)
    # -------------------------------------------------------------
    LanguageInfo(code="pt", name="Portuguese", native_name="Português", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["pt-BR", "pt-PT"], caveats="Beta: Brazilian Portuguese primary."),
    LanguageInfo(code="it", name="Italian", native_name="Italiano", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["it-IT"], caveats="Beta: Standard Italian voice model."),
    LanguageInfo(code="ja", name="Japanese", native_name="日本語", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["ja-JP"], caveats="Beta: Keigo honorific calibration pending full clinical panel."),
    LanguageInfo(code="ko", name="Korean", native_name="한국어", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["ko-KR"], caveats="Beta: Banmal/Jondaetmal emotional boundary review pending."),
    LanguageInfo(code="zh", name="Mandarin Chinese", native_name="普通话", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["zh-CN (Simplified)", "zh-TW (Traditional)"], caveats="Beta: Pinyin and tonal inflection verified."),
    LanguageInfo(code="tr", name="Turkish", native_name="Türkçe", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["tr-TR"], caveats="Beta: Standard Istanbul dialect."),
    LanguageInfo(code="nl", name="Dutch", native_name="Nederlands", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["nl-NL", "nl-BE"], caveats="Beta: Pacing and inflection benchmarked."),
    LanguageInfo(code="pl", name="Polish", native_name="Polski", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["pl-PL"], caveats="Beta: Grammatical gender agreement in progress."),
    LanguageInfo(code="sv", name="Swedish", native_name="Svenska", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["sv-SE"], caveats="Beta: Pitch accent reproduction experimental."),
    LanguageInfo(code="id", name="Indonesian", native_name="Bahasa Indonesia", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["id-ID"], caveats="Beta: Formal vs colloquial Bahasa."),
    LanguageInfo(code="vi", name="Vietnamese", native_name="Tiếng Việt", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["vi-VN (Northern)", "vi-VN (Southern)"], caveats="Beta: 6-tone acoustics experimental."),
    LanguageInfo(code="el", name="Greek", native_name="Ελληνικά", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["el-GR"], caveats="Beta: Modern Greek Cyrillic/Greek script."),
    LanguageInfo(code="cs", name="Czech", native_name="Čeština", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["cs-CZ"], caveats="Beta: Declension in empathetic dialogue."),
    LanguageInfo(code="he", name="Hebrew", native_name="עברית", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="rtl", dialects=["he-IL"], caveats="Beta: RTL script orientation enforced."),
    LanguageInfo(code="da", name="Danish", native_name="Dansk", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["da-DK"], caveats="Beta: Stød phonetics experimental."),
    LanguageInfo(code="fi", name="Finnish", native_name="Suomi", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["fi-FI"], caveats="Beta: Agglutinative structure review."),
    LanguageInfo(code="no", name="Norwegian", native_name="Norsk", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["no-NO (Bokmål)"], caveats="Beta: Bokmål primary."),
    LanguageInfo(code="th", name="Thai", native_name="ไทย", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["th-TH"], caveats="Beta: Tonal speech recognition experimental."),
    LanguageInfo(code="tl", name="Tagalog / Filipino", native_name="Tagalog", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["tl-PH", "Taglish"], caveats="Beta: Taglish code-switching in testing."),
    LanguageInfo(code="uk", name="Ukrainian", native_name="Українська", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["uk-UA"], caveats="Beta: Cyrillic script, trauma-informed caution."),
    LanguageInfo(code="ro", name="Romanian", native_name="Română", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["ro-RO"], caveats="Beta: Diacritics rendering verified."),
    LanguageInfo(code="hu", name="Hungarian", native_name="Magyar", tier=LanguageReadinessTier.TIER_3_EXPERIMENTAL, direction="ltr", dialects=["hu-HU"], caveats="Beta: Vowel harmony experimental."),
]


def get_language_by_code(code: str) -> LanguageInfo:
    code_lower = code.lower().split("-")[0]
    for lang in ARCHITECTED_LANGUAGES:
        if lang.code == code_lower:
            return lang
    return ARCHITECTED_LANGUAGES[0]  # Default English
