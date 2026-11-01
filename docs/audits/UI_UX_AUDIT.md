# InnerOS UI/UX and Design System Audit

**Date:** November 1, 2026  
**Auditor:** Principal Product Designer, Accessibility Specialist & UX Researcher  
**Design Evaluation:** InnerOS Baseline Design System ("Sanctuary Dark")  

---

## 1. Executive UX Diagnosis

The initial visual execution of InnerOS suffers from a fundamental misalignment with its product mission:
- **Product Mission:** A comforting, reassuring, emotionally safe personal wellbeing companion.
- **Current Visual Reality:** A **dark, technical, dense, high-contrast cybersecurity dashboard** that resembles an enterprise SOC console or devtools profiler rather than a warm personal sanctuary.

```
+-------------------------------------------------------------------------+
|                  CORE DESIGN TENSIONS IN CURRENT UI                     |
+-------------------------------------------------------------------------+
| What Wellbeing Users Need             | What Current UI Provides        |
+---------------------------------------+---------------------------------+
| Warm, welcoming, bright, soft space   | Oppressive pitch-black midnight |
| Plain human language & reassurance    | Cryptographic & legal acronyms  |
| Spacious, calm, readable typography   | 9-10px tiny monospace metadata  |
| Simple, clear primary actions         | 15+ competing navigation links  |
| Gentle, dignified memory review       | Alarming warning banners & math |
+-------------------------------------------------------------------------+
```

---

## 2. Granular UX & Visual Deficiencies

### 2.1 Oppressive, Overly Dark Palette
- **Problem:** Canvas background is hardcoded to near-black (`#070b14`), surface to `#0b111e`, and cards to `#101828`. While marketed as "midnight sanctuary," in practice it feels cold, heavy, and melancholic—the opposite of an uplifting, warm, healing environment.
- **Broken Theme Switching:** Although a `.light` theme exists in `theme.css`, components throughout the app heavily utilize hardcoded Tailwind classes like `bg-midnight-950`, `border-white/[0.08]`, and `text-ivory-100`. As a result, switching to Light Mode produces broken, high-contrast visual artifacts where dark cards remain dark on light backgrounds.

### 2.2 Tiny Fonts & Readability Failures
- **Microscopic Metadata:** Widespread use of `text-[9px]`, `text-[10px]`, and `text-[11px]` for tags, timestamps, and confidence scores.
- **Low Contrast Muted Text:** Classes such as `text-zinc-500` and `text-ivory-400/60` on dark backgrounds fail WCAG 2.2 AA contrast standards (measured at 2.8:1 to 3.4:1 against the required 4.5:1 for normal text).
- **Line Length & Spacing:** Paragraphs in cards are frequently cramped with tight line heights (`leading-snug`), increasing cognitive fatigue for emotionally distressed users.

### 2.3 Intimidating Technical Terminology
The user interface exposes internal engineering, cryptography, and regulatory jargon directly to everyday consumers:
- **`AES-256 HKDF` / `AES-256-GCM`:** Displayed prominently on headers, cards, and memory badges. To a user seeking emotional relief, this is intimidating and clinical.
- **`GDPR Art. 17` / `Export (Art. 20)`:** Privacy actions are labeled with EU statutory citations rather than plain human terms like *"Forget this"* or *"Download my data"*.
- **`Tentative AI Hypothesis (85% Confidence)`:** Mathematical confidence scoring turns human self-reflection into a machine-learning classification test.
- **`Nuclear Purge` with required typed confirmation `"PURGE MY MEMORY"`:** Extreme, aggressive terminology that heightens user stress during emotional vulnerability.

### 2.4 Deep Dive: The `/memory` Experience
The current `/memory` screen is the primary offender of technical intimidation:
1. **Primary Screen is a Complex SVG Topology Graph:** Instead of showing what the companion remembers in a readable list, the user is immediately confronted with a 2D network canvas with directed Bezier curves, coordinate calculations, and topological edge types (`mitigates`, `triggers`, `anchors`).
2. **Alarming Staged Suggestions Banner:** Staged memories appear in an amber alert box with a pulsating `AlertTriangle` warning icon and text stating: *"Tentative AI Hypothesis Awaiting Confirmation"*. This triggers cognitive alarms and feels like a security breach or error.
3. **Inspector Drawer Clutter:** Selecting a node opens a drawer displaying "Trust Score", "Certainty: Tentative (<0.85)", "Envelope ID", and mathematical arrows (`→ triggers`, `← mitigates`).

### 2.5 Navigation & Information Architecture Overload
- **Overcrowded Sidebar:** Current desktop sidebar contains 15+ distinct destinations divided into 4 groups (`Sanctuary Living`, `Inner Growth`, `Wisdom & Memory`, `Agency & Privacy`). This causes choice paralysis.
- **Unclear Primary Hierarchy:** Users arriving at `/dashboard` are confronted with 6 different action buttons, multiple bento cards, and competing visual anchors.
- **Mobile Drawer Clutter:** On mobile, opening the navigation reveals a massive scrolling list without an optimized bottom navigation bar for quick access.

### 2.6 Voice Experience Visual Friction
- **Voice Screen (`/companion/voice`):** While the central orb animation is technically sophisticated, the screen is surrounded by technical latency indicators, language audio profile stats, SNR dB meters, and clinical disclaimer badges that distract from a calm conversational presence.

---

## 3. Accessibility Evaluation (WCAG 2.2 AA)

| Criterion | Evaluation Status | Identified Issue & Location |
| :--- | :--- | :--- |
| **1.4.3 Contrast (Minimum)** | **FAIL** | Microscopic labels in `text-zinc-500` and `text-ivory-400` on `#0b111e` have contrast ratios below 3.5:1. |
| **2.4.7 Focus Visible** | **PARTIAL** | Custom buttons in SVG canvas and dropdowns lack visible high-contrast focus rings for keyboard navigation. |
| **2.5.5 Target Size** | **FAIL** | Multiple tags and action pills have touch target heights under 28px, failing the 44x44px mobile requirement. |
| **3.1.2 Language of Parts** | **PASS** | `dir="rtl"` and language attributes set properly on root container. |
| **2.2.2 Pause, Stop, Hide** | **PASS** | Reduced-motion mode toggles off pulsing animations in CSS. |
