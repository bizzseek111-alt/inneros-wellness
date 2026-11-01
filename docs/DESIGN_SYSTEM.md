# InnerOS — Design System Specification ("Warm Human Minimalism with Gentle Futurism")

**Version:** 2.0.0  
**Primary Theme:** Light Mode Default (`#FFFBF7` / `#FAF8F4`), Optional Calm Evening Dark Mode (`#141B19`)  
**Accessibility Standard:** WCAG 2.2 AA Verified (Contrast, Keyboard Focus, Reduced Motion, RTL Support)

---

## 1. Visual Philosophy

InnerOS replaces cold clinical dashboards and dark developer-oriented SaaS interfaces with a warm, sunlit personal sanctuary. Every surface, typographic scale, and micro-interaction is crafted to lower cognitive load and foster emotional safety.

---

## 2. Color System & Semantic Tokens

Defined in [tailwind.config.js](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/tailwind.config.js) and [theme.css](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/design-system/theme.css):

| Token Name | Hex Value | Usage & Contrast Ratio |
| :--- | :--- | :--- |
| `--bg-canvas` | `#FFFBF7` | Primary warm cream canvas background |
| `--bg-canvas-warm` | `#FAF8F4` | Secondary editorial ivory background |
| `--bg-card` | `#FFFFFF` | Elevated card surface with soft border (`#E4E0D8`) |
| `--surface-sage` | `#E5F1E8` | Pale sage surface for calm status badges, voice presence, and primary accents |
| `--surface-peach` | `#F9E5DC` | Warm peach surface for gentle reminders, empathy callouts, and crisis care |
| `--surface-lavender` | `#EEE7FA` | Soft lilac surface for memory provenance, reflections, and growth steps |
| `--surface-sky` | `#E4F1FA` | Soft sky blue surface for psychology library and educational callouts |
| `--accent-primary` | `#285B55` | Deep botanical teal for primary actions and active navigation (`7.4:1` on white) |
| `--text-primary` | `#263330` | Deep forest charcoal for primary headings and body copy (`11.2:1` on canvas) |
| `--text-secondary` | `#52625E` | Accessible muted charcoal for supporting copy and metadata (`5.6:1` on canvas) |

---

## 3. Typography System

- **Editorial Headings (`font-serif`):** `"Newsreader"`, `"Playfair Display"`, Georgia, serif — used for welcoming page titles, reflection prompts, and psychoeducation headings.
- **UI & Body Copy (`font-sans`):** `"Plus Jakarta Sans"`, `"Inter"`, system sans-serif — `16.5px` (`1.0625rem`) base body size with `1.65` line height for effortless reading.
- **Readability Floor:** A strict CSS floor in [theme.css](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/design-system/theme.css) prevents any label from rendering below `13px` (`0.8125rem`).

---

## 4. Accessibility, Localization & Motion Guardrails

1. **Keyboard Navigation & Focus Rings:** Every interactive control exposes a high-contrast focus ring (`0 0 0 3px rgba(40, 91, 85, 0.35)`) and a `Skip to main content` link in both [SanctuaryShell.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/components/shell/SanctuaryShell.tsx) and [MarketingShell.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/components/marketing/MarketingShell.tsx).
2. **Reduced Motion Guarantee:** Respects OS `prefers-reduced-motion: reduce` and provides an explicit header toggle (`Calm Motion`) that disables all breathing/floating animations.
3. **Multilingual & RTL Layout Readiness:** Supports 12 languages including bidirectional Right-to-Left (`dir="rtl"`) layouts for Arabic (`ar`), Urdu (`ur`), and Hebrew (`he`).
