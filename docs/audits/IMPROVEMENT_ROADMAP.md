# InnerOS Improvement Roadmap & Remediation Blueprint

**Date:** November 1, 2026  
**Concept:** "Warm Human Minimalism with Gentle Futurism"  
**Goal:** Transform InnerOS from a dark, technical, cybersecurity-style dashboard into an emotionally comforting, accessible, light, and modern wellbeing sanctuary.  

---

## 1. Prioritized Remediation Framework

```
+-------------------------------------------------------------------------+
|                         PRIORITIZATION MATRIX                           |
+-------------------------------------------------------------------------+
| P0: Critical Safety, Privacy & Deceptive Claims                         |
|     - Strip misleading "AES-256 HKDF" and "GDPR Article" badges.        |
|     - Remove pseudo-scientific "85% Confidence" scores on memories.     |
|     - Soften alarming warning banners on staged suggestions.            |
|     - Ensure crisis & safety hotline access remains unobstructed.       |
+-------------------------------------------------------------------------+
| P1: Broken User Journeys & Accessibility (WCAG 2.2 AA)                  |
|     - Default to Warm Light Mode (#FAF8F4 canvas, #263330 primary text).|
|     - Eliminate hardcoded dark utility classes causing broken themes.   |
|     - Boost font sizes (body 16-18px, eliminate 9-10px micro-labels).   |
|     - Implement simplified 6-item primary navigation + mobile nav bar.  |
|     - Fix touch target sizes to minimum 44x44px.                        |
+-------------------------------------------------------------------------+
| P2: Core Screen Redesigns & Design System Standardization               |
|     - Redesign /memory: "Things I Remember" friendly card/list default; |
|       make Life Graph an optional secondary tab.                        |
|     - Redesign Home (/dashboard): peaceful greeting, prominent Talk CTA,|
|       today's gentle check-in, unobtrusive daily reflection card.       |
|     - Redesign Voice Companion (/companion/voice): soft breathing orb.  |
|     - Redesign Chat (/companion/chat): warm, spacious message bubbles.  |
|     - Standardize all remaining routes with refined design tokens.      |
+-------------------------------------------------------------------------+
| P3: Infrastructure & Backend Enhancements (Post-Redesign)               |
|     - Synchronize localStorage journal/growth with FastAPI backend.     |
|     - Wire PostgreSQL database using existing SQL migrations.           |
|     - Implement production JWT session authentication.                  |
+-------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Execution Plan

### Phase 1: Design Tokens & Component Primitives (P1/P2)
1. **Refine Design Tokens:**
   - Primary Canvas: `#FAF8F4` (Warm Alabaster).
   - Card Surfaces: `#FFFFFF` with soft diffused borders (`rgba(38, 51, 48, 0.08)`).
   - Accents: Soft Sage (`#E8F1EB`), Warm Peach (`#F7E7E2`), Gentle Lavender (`#EDE8F5`), Deep Forest/Teal Accent (`#285B55`).
   - Text Hierarchy: Primary `#263330` (high readability, 11.2:1 contrast ratio), Secondary `#5A6864`.
2. **Standardize Shared Primitives:**
   - `Button.tsx`: Soft rounded corners, generous 44px height, warm hover states.
   - `Card.tsx`: Warm white with gentle shadows, eliminating heavy dark borders.
   - `Badge.tsx`: Plain language tags with accessible contrast.
   - `Input.tsx` & `Slider.tsx`: Comfortable sizes, clear focus rings.

### Phase 2: Navigation & Shell Overhaul (P1)
1. **Simplified Primary Navigation:**
   - **Desktop Sidebar:**
     - Primary: *Home*, *Talk*, *My Journal*, *My Growth*, *Explore*, *My Space*.
     - Secondary: *Reminders*, *Memories*, *Connected Apps*, *Privacy*, *Settings*, *Help and Support*.
   - **Mobile Bottom Navigation:**
     - 4 high-frequency destinations (*Home*, *Talk*, *Journal*, *Memories*) + accessible *More* sheet.
2. **Accessible Top Header:**
   - Uncluttered brand identity with gentle breathing pulse.
   - Discreet crisis care link and language switcher.

### Phase 3: Home & Talk Redesign (P2)
1. **Home Experience (`/dashboard`):**
   - Welcoming, personalized greeting without overwhelming analytics.
   - Prominent, inviting "Talk to your companion" dual-entry card (Voice & Text).
   - Gentle optional emotional check-in prompt.
   - Daily reflection snippet and today's user-approved reminders.
2. **Voice Companion (`/companion/voice`):**
   - Soft gradient companion orb with subtle ambient movement.
   - Clear listening, thinking, and speaking states.
   - Calm, accessible microphone and transcript controls.
   - AI identity clearly visible.
3. **Chat Interface (`/companion/chat`):**
   - Spacious, soothing layout with readable 16–17px body typography.
   - Plain-language mode selection (*Just Listen*, *Help Me Understand*, etc.).

### Phase 4: Memory Experience Redesign (`/memory`) (P0/P2)
1. **Default "Things I Remember" View:**
   - Friendly list/card organization grouped by meaningful life domains (*My Routines*, *Important People*, *Personal Values*, *Current Goals*).
   - Strip all `AES-256 HKDF`, `GDPR Art. 17`, and `Confidence: 85%` labels.
   - Plain language action buttons: *Review*, *Edit*, *Forget*.
2. **Staged Suggestions Review:**
   - Replace the pulsating red/amber alarm banner with a calm, friendly prompt:  
     *"A few things you mentioned that you might like me to remember."*
3. **Optional Life Graph Visualization:**
   - Move SVG graph behind an optional secondary tab (*"View connections"*), ensuring the default user journey is simple and readable.

### Phase 5: Complete Route Standardization (P2)
- Apply the warm, bright, accessible design system across all remaining 14 routes:
  - `/check-in`: Gentle emotion wheel and somatic check.
  - `/journal`: Distraction-free, warm writing space.
  - `/growth`: Peaceful goal horizons and encouragement.
  - `/reminders`: Calming reminder list with anti-guilt reassurance.
  - `/knowledge`: Clear, readable psychology cards without dense academic clutter.
  - `/integrations`: Transparent, friendly connected app cards.
  - `/settings/notifications`: Clear quiet hours scheduler.
  - `/settings/privacy`: Plain-language privacy controls with dedicated technical info.
  - `/safety`: Reassuring, clear crisis resources.
  - `/onboarding`: Welcoming registration and consent flow.

---

## 3. Verification & Sign-Off Criteria

1. **Accessibility Validation:** All pages pass automated axe-core/WCAG 2.2 AA contrast checks.
2. **Build & Test Integrity:** Zero TypeScript errors, zero lint warnings, and all 137 backend API tests passing.
3. **Visual Verification:** Browser verification and side-by-side screenshots demonstrating the complete transformation to *Warm Human Minimalism with Gentle Futurism*.
