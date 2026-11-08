# Weebly V9 — Checkpoint 1: Audit, Inventory & Baseline

Branch: `redesign-v9` (from `main` @ `16a0c25`, = production `weebly-ohkk35941`)
Date: 2026-11-08

## 1. Real architecture

| Layer | Reality |
|---|---|
| Frontend | Next.js 14.2 App Router, React 18, Tailwind 3, framer-motion 11, lucide icons. pnpm monorepo (`apps/web`). |
| Backend | FastAPI + SQLAlchemy (`apps/api`), 18 domains, 42 tables, SQLite locally. **Not deployed anywhere.** |
| Hosting | Vercel builds only `apps/web`. **Zero environment variables configured** in the Vercel project. |
| Next API routes (actually live) | `/api/youth/friends/turn`, `/api/educational/activity-events`, `/api/curriculum/questions`, `/api/curriculum/stats` |

## 2. Critical findings (block any "verified" claim)

1. **Backend unreachable in production.** `api-client.ts` falls back to `http://127.0.0.1:8000` because `NEXT_PUBLIC_API_URL` is unset. Every portal call through `apiClient` (parent, teacher, admin CMS, academy, auth, journal, etc.) fails in visitors' browsers. Pages render, but data/save operations do not work live.
2. **No LLM in production.** `/api/youth/friends/turn` returns template replies (asked "what is 2+3", Kai replied with a generic prompt). No OpenAI / ElevenLabs / Azure keys exist. Voice = browser Web Speech only.
3. **Learning events are not persisted.** `/api/educational/activity-events` stores events in serverless memory; they disappear on cold start. The child → activity → parent report chain cannot be reliably demonstrated live.
4. **Prior reports overstated status.** The V8 reconciliation report listed per-route response times that were not measured, and several docs pages mark features "LIVE AND VERIFIED" that depend on the undeployed backend. These must be corrected (see §6).
5. **CI workflow removed.** To push without the `workflow` OAuth scope, `.github/workflows/ci.yml` was stripped from git history last session. Backup branch `main-backup-with-workflows` still has it; it needs restoring via a token with `workflow` scope.
6. **InnerOS copy on Weebly-facing pages:** research, privacy, terms, contact, faq, about, safety, privacy-trust, signup, login, onboarding, settings/*, dashboard, design-system (15 pages). Root `package.json` description and root layout metadata still describe an adult wellbeing product.

## 3. Route inventory (92 pages) and proposed disposition

**Public marketing (keep, redesign):** `/` `/how-it-works` `/parents` `/schools` `/schools/pilot` `/schools/onboarding` `/research` `/technology` `/platform` `/trust` `/child-safety` `/accessibility` `/languages` `/pricing` `/demos` `/documents` `/contact` `/faq` `/about` `/privacy` `/terms` `/creative-studio`

**Duplicates to merge via redirect:**
- `/features`, `/explore` → `/platform`
- `/demo`, `/investor-demo` → `/demos`
- `/safety`, `/privacy-trust` → `/trust` (adult equivalents live under `/inneros/*`)
- `/kids`, `/youth`, `/student` → `/youth/dashboard`
- `/teacher` → `/teacher/dashboard`
- `/adhd-support`, `/autism-support`, `/cognitive-development`, `/emotional-intelligence` → sections of a single `/wellbeing` page (review wording for clinical claims first)

**Child (ChildNavigationShell, Home/Talk/Play):** `/youth/dashboard` `/youth/friends` `/youth/voice` `/youth/play` `/youth/activities` `/youth/creative-studio` `/youth/stories` `/youth/emotions` `/youth/routines` `/youth/academy(/lesson/[id])`
**Child pages still on old YouthShell (migrate):** chat, journal, habits, language, achievements, safety, consent, accessibility, visual-supports, support-center, onboarding. `consent` belongs in Parent Center, not the child app.
**Teen:** `/teens` (needs its own shell decision).
**Adult portals:** `/parent` `/caregiver/dashboard` (merge into /parent) `/teacher/dashboard` `/school/portal` `/professional/portal` `/admin` `/admin/curriculum` `/admin/knowledge` `/admin/youth-content`
**Auth:** `/login` `/signup` `/onboarding` `/offline`
**InnerOS adult (preserve, isolate):** `/inneros/dashboard` `/inneros/safety` `/dashboard` `/check-in` `/journal` `/growth` `/memory` `/reminders` `/companion/*` `/integrations` `/knowledge` `/settings/*`
**Internal:** `/design-system` (noindex)

## 4. Roles
child, teen, parent/caregiver, teacher, school admin, professional, platform admin, adult InnerOS user. Enforcement exists in FastAPI + `middleware.ts` route tiers, but with no deployed backend, production role isolation is currently only client-side/UI.

## 5. Regression baseline (passing on `16a0c25`)
- `frontend.test.mjs` 25/25, `pilot-readiness.test.mjs` 9/9, `v8-production-reconciliation.test.mjs` 7/7 — these are **static source-file assertions**, not browser tests.
- `pytest apps/api/tests` 262/262 — backend logic, local only.
- `next build` 94/94 pages.
- Missing: Playwright E2E, axe accessibility, Lighthouse, visual regression.

## 6. Decisions needed from the owner (blockers)
1. **Backend hosting** — deploy FastAPI (Render / Railway / Fly / Cloud Run) with managed Postgres, *or* move the needed endpoints into Next.js route handlers + a hosted DB (Vercel Postgres/Neon/Supabase). Without one of these, portals cannot save data.
2. **AI/voice keys** — which provider(s) to configure (OpenAI, ElevenLabs, Azure Speech). Keys must be set by the owner in Vercel; they will never be committed.
3. **Staging** — use Vercel Preview deployments of `redesign-v9`; production untouched until approval.
4. **CI** — re-authorise `gh auth refresh -s workflow` so CI can be restored.

## 7. Staged plan (checkpoints 2–10)
| CP | Scope | Exit criteria |
|---|---|---|
| 2 | Design tokens (`design-system/weebly-v9`), fonts (display + body + Noto Nastaliq Urdu), 3 previewable homepage concepts at `/design-system/concepts/{a,b,c}`, chosen system, core components (Button, Nav, Section, Card variants, Stat, Tabs, Dialog, Table, Form fields) | Concepts screenshot-reviewed; contrast checks pass |
| 3 | Homepage (12 sections) + global header/footer/mobile nav + redirects | Playwright smoke + axe on `/` |
| 4 | Public page families via shared templates | All public routes render, metadata, sitemap/robots |
| 5 | Kids Magic Home, talk screen, six worlds; migrate remaining YouthShell pages | Child flows E2E; reduced-motion/sensory modes |
| 6 | Shared AdminShell; Parent/Teacher/School/Professional/Admin | Role-guard tests |
| 7 | Backend deployment + DB + real event persistence + LLM/voice adapters (depends on §6 decisions) | Child→activity→parent report E2E against live API |
| 8 | Demos, docs, institutional pages; correct all readiness claims | Claims registry matches reality |
| 9 | PWA, safe areas, performance measurement | Lighthouse numbers recorded (real) |
| 10 | Full QA, preview release, rollback plan, production promotion on approval | All blocking defects closed |

Rollback point for every checkpoint: a tagged commit on `redesign-v9`; production stays on `16a0c25` until explicit approval.
