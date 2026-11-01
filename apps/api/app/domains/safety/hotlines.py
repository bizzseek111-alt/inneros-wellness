"""Verified Regional Crisis Helpline Directory.
Provides emergency phone and textline resources for immediate non-clinical handoff
across the United Kingdom, European Union, Bulgaria, United States, and international jurisdictions.
"""

from typing import Dict, List, Optional
from app.domains.safety.schemas import CrisisResource

REGIONAL_CRISIS_HOTLINES: Dict[str, List[CrisisResource]] = {
    "US": [
        CrisisResource(
            country_code="US",
            country_name="United States",
            phone="988",
            text_channel="Text HOME to 741741",
            website="https://988lifeline.org",
            description="988 Suicide & Crisis Lifeline: Free, confidential 24/7 support across the US.",
            languages=["en", "es"],
            is_24_7=True,
            resource_type="crisis_helpline",
        ),
        CrisisResource(
            country_code="US",
            country_name="United States",
            phone="1-800-799-SAFE (7233)",
            text_channel="Text START to 88788",
            website="https://www.thehotline.org",
            description="National Domestic Violence Hotline: 24/7 confidential advocacy and safety planning.",
            languages=["en", "es"],
            is_24_7=True,
            resource_type="domestic_violence",
        ),
        CrisisResource(
            country_code="US",
            country_name="United States",
            phone="1-800-662-4357",
            text_channel=None,
            website="https://www.samhsa.gov/find-help/national-helpline",
            description="SAMHSA National Helpline: 24/7, 365-day-a-year treatment referral for substance use and mental disorders.",
            languages=["en", "es"],
            is_24_7=True,
            resource_type="substance_abuse",
        ),
    ],
    "GB": [
        CrisisResource(
            country_code="GB",
            country_name="United Kingdom",
            phone="111",
            text_channel="Text SHOUT to 85258",
            website="https://www.nhs.uk/nhs-services/mental-health-services/",
            description="NHS Mental Health Services (111 Option 2) and Shout 24/7 Crisis Text Line.",
            languages=["en"],
            is_24_7=True,
            resource_type="crisis_helpline",
        ),
        CrisisResource(
            country_code="GB",
            country_name="United Kingdom",
            phone="116 123",
            text_channel="Email jo@samaritans.org",
            website="https://www.samaritans.org",
            description="Samaritans UK: Free 24/7 confidential emotional support for anyone in distress.",
            languages=["en"],
            is_24_7=True,
            resource_type="crisis_helpline",
        ),
        CrisisResource(
            country_code="GB",
            country_name="United Kingdom",
            phone="0808 2000 247",
            text_channel="Live chat via nationaldahelpline.org.uk",
            website="https://www.nationaldahelpline.org.uk",
            description="National Domestic Abuse Helpline (Refuge): Free, 24/7 confidential support for women and children.",
            languages=["en"],
            is_24_7=True,
            resource_type="domestic_violence",
        ),
    ],
    "BG": [
        CrisisResource(
            country_code="BG",
            country_name="Bulgaria",
            phone="112",
            text_channel=None,
            website="https://www.mvr.bg",
            description="Единен европейски номер за спешни повиквания (112): Безплатен денонощен достъп до спешна помощ.",
            languages=["bg", "en"],
            is_24_7=True,
            resource_type="emergency",
        ),
        CrisisResource(
            country_code="BG",
            country_name="Bulgaria",
            phone="0800 88 001",
            text_channel=None,
            website="https://redcross.bg",
            description="Национална безплатна телефонна линия за психологическа подкрепа (БЧК): Анонимна помощ от специалисти.",
            languages=["bg"],
            is_24_7=True,
            resource_type="crisis_helpline",
        ),
        CrisisResource(
            country_code="BG",
            country_name="Bulgaria",
            phone="116 111",
            text_channel="Чат през 116111.bg",
            website="https://116111.bg",
            description="Национална телефонна линия за деца (ДАЗД / Асоциация Анимус): 24/7 безплатна консултация и закрила.",
            languages=["bg"],
            is_24_7=True,
            resource_type="youth",
        ),
        CrisisResource(
            country_code="BG",
            country_name="Bulgaria",
            phone="0800 1 86 76 / 02 981 76 86",
            text_channel=None,
            website="https://animusassociation.org",
            description="Гореща телефонна линия за пострадали от насилие (Фондация Асоциация Анимус): 24/7 кризисна интервенция.",
            languages=["bg"],
            is_24_7=True,
            resource_type="domestic_violence",
        ),
        CrisisResource(
            country_code="BG",
            country_name="Bulgaria",
            phone="116 123",
            text_channel=None,
            website="https://www.befrienders.org",
            description="Европейска линия за емоционална подкрепа (116 123): Безплатна психологическа помощ при криза.",
            languages=["bg", "en"],
            is_24_7=True,
            resource_type="crisis_helpline",
        ),
    ],
    "EU": [
        CrisisResource(
            country_code="EU",
            country_name="European Union",
            phone="112",
            text_channel=None,
            website="https://europa.eu/youreurope/citizens/health/emergency-services/",
            description="European Emergency Number (112): Free 24/7 ambulance, police, and medical rescue across all EU Member States.",
            languages=["en", "fr", "de", "bg", "es", "it"],
            is_24_7=True,
            resource_type="emergency",
        ),
        CrisisResource(
            country_code="EU",
            country_name="European Union",
            phone="116 123",
            text_channel=None,
            website="https://www.ifotes.org",
            description="Pan-European Emotional Support Helpline (116 123): Free, confidential listening service.",
            languages=["en", "fr", "de", "bg"],
            is_24_7=True,
            resource_type="crisis_helpline",
        ),
        CrisisResource(
            country_code="EU",
            country_name="European Union",
            phone="116 111",
            text_channel=None,
            website="https://www.childhelplineinternational.org",
            description="European Child Helpline (116 111): 24/7 protection and psychological support for young people.",
            languages=["en", "fr", "de", "bg"],
            is_24_7=True,
            resource_type="youth",
        ),
    ],
    "CA": [
        CrisisResource(
            country_code="CA",
            country_name="Canada",
            phone="988",
            text_channel="Text 686868 (Youth) or 741741 (Adults)",
            website="https://988.ca",
            description="988 Suicide Crisis Helpline: Toll-free 24/7 bilingual service across Canada.",
            languages=["en", "fr"],
            is_24_7=True,
            resource_type="crisis_helpline",
        )
    ],
    "DE": [
        CrisisResource(
            country_code="DE",
            country_name="Germany",
            phone="0800 111 0 111 / 0800 111 0 222",
            text_channel="Chat via online.telefonseelsorge.de",
            website="https://www.telefonseelsorge.de",
            description="TelefonSeelsorge: Kostenfreie, vertrauliche und anonyme Unterstützung rund um die Uhr.",
            languages=["de"],
            is_24_7=True,
            resource_type="crisis_helpline",
        )
    ],
    "FR": [
        CrisisResource(
            country_code="FR",
            country_name="France",
            phone="3114",
            text_channel="Chat via 3114.fr",
            website="https://3114.fr",
            description="3114 Numéro national de prévention du suicide: 24/7, gratuit et confidentiel.",
            languages=["fr"],
            is_24_7=True,
            resource_type="crisis_helpline",
        )
    ],
    "ES": [
        CrisisResource(
            country_code="ES",
            country_name="Spain",
            phone="024",
            text_channel=None,
            website="https://www.sanidad.gob.es/linea024",
            description="Línea 024 de atención a la conducta suicida: Gratuita, confidencial y disponible 24/7.",
            languages=["es"],
            is_24_7=True,
            resource_type="crisis_helpline",
        )
    ],
    "JP": [
        CrisisResource(
            country_code="JP",
            country_name="Japan",
            phone="0570-064-556 / 0800-888-2525",
            text_channel="Chat via telljp.com",
            website="https://telljp.com",
            description="TELL Japan Lifeline & Inochi no Denwa: Bilingual support and crisis counseling.",
            languages=["ja", "en"],
            is_24_7=True,
            resource_type="crisis_helpline",
        )
    ],
    "GLOBAL": [
        CrisisResource(
            country_code="GLOBAL",
            country_name="International",
            phone="Contact Local Emergency Services (112 in EU/BG, 999 in UK, 911 in US)",
            text_channel=None,
            website="https://www.befrienders.org",
            description="Befrienders Worldwide: Free, confidential emotional support and crisis line directory in over 30 countries.",
            languages=["en", "es", "fr", "de", "ar", "bg"],
            is_24_7=True,
            resource_type="crisis_helpline",
        ),
        CrisisResource(
            country_code="GLOBAL",
            country_name="International",
            phone="Contact Local Emergency Services",
            text_channel=None,
            website="https://findahelpline.com",
            description="Find A Helpline: Confidential support line locator across 130+ countries.",
            languages=["en", "es", "fr", "de", "ar", "bg"],
            is_24_7=True,
            resource_type="crisis_helpline",
        ),
    ],
}

COUNTRY_ALIASES = {
    "UK": "GB",
    "ENGLAND": "GB",
    "SCOTLAND": "GB",
    "WALES": "GB",
    "USA": "US",
    "UNITED STATES": "US",
    "GERMANY": "DE",
    "FRANCE": "FR",
    "SPAIN": "ES",
    "JAPAN": "JP",
    "CANADA": "CA",
    "BULGARIA": "BG",
    "БЪЛГАРИЯ": "BG",
    "EUROPE": "EU",
    "EUROPEAN UNION": "EU",
}


def get_crisis_resources(
    country_code: str = "US", resource_type: Optional[str] = None
) -> List[CrisisResource]:
    """Returns verified crisis helplines for the resolved jurisdiction, optionally prioritized by type."""
    code = (country_code or "US").strip().upper()
    resolved_code = COUNTRY_ALIASES.get(code, code)
    resources = REGIONAL_CRISIS_HOTLINES.get(resolved_code, REGIONAL_CRISIS_HOTLINES["GLOBAL"])

    if resource_type:
        # Prioritize matching resource type at the top of the list
        matched = [r for r in resources if r.resource_type == resource_type]
        others = [r for r in resources if r.resource_type != resource_type]
        return matched + others if matched else resources

    return resources
