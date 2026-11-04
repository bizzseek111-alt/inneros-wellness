# Weebly Platform V8 — Route Inventory & Verification Matrix

Generated: 2026-11-05 | Branch: `audit-and-repair-v8` | Status: Verified 94/94 Routes Compiled

## 1. Executive Summary
This document provides an exhaustive, automated inventory of every route currently compiled in the Next.js 14 App Router application (`apps/web`). All 94 pages compile statically or dynamically as indicated below.

## 2. Route Matrix

| Route | Type | Shell / Layout | Primary Role | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Static (○) | RootLayout / MarketingShell | Public / Prospective Families | Verified (Production) |
| `/about` | Static (○) | MarketingShell | Public / General | Verified (Brand Repaired) |
| `/accessibility` | Static (○) | MarketingShell | Public / Inclusion Advocates | Verified |
| `/adhd-support` | Static (○) | MarketingShell | Parents & Educators | Verified (Brand Repaired) |
| `/admin` | Static (○) | AdminLayout | Platform Admin | Verified |
| `/admin/curriculum` | Static (○) | AdminLayout | Curriculum Specialists | Verified (25 Depts) |
| `/admin/knowledge` | Static (○) | AdminLayout | Knowledge Engineers | Verified |
| `/admin/youth-content`| Static (○) | AdminLayout | Safeguarding Leads | Verified (Boundary Gated) |
| `/autism-support` | Static (○) | MarketingShell | Parents & Therapists | Verified (AAC Linked) |
| `/caregiver/dashboard`| Static (○) | CaregiverShell | Caregivers / Parents | Verified |
| `/check-in` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/child-safety` | Static (○) | MarketingShell | Public / Regulators | Verified (CPWB 1121) |
| `/cognitive-development`| Static (○)| MarketingShell | Parents & Teachers | Verified |
| `/companion/chat` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/companion/voice` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/contact` | Static (○) | MarketingShell | Public / Support | Verified |
| `/creative-studio` | Static (○) | YouthProvider / ChildNav | Children (Mia Studio) | Verified (New V8 Route) |
| `/dashboard` | Static (○) | AppShell / Role Bridge | Adult / Bridge | Verified (Role Bridge) |
| `/demo` | Static (○) | Public / DemoShell | General Visitors | Verified |
| `/demos` | Static (○) | MarketingShell | Families & Evaluators | Verified (6 Isolated Demos) |
| `/design-system` | Static (○) | MarketingShell | Design & Dev Team | Verified |
| `/documents` | Static (○) | MarketingShell | Punjab Govt & Schools | Verified (10 Printable Docs) |
| `/emotional-intelligence`| Static (○)| MarketingShell | Parents & Schools | Verified |
| `/explore` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/faq` | Static (○) | MarketingShell | Public / General | Verified |
| `/features` | Static (○) | MarketingShell | Public / Families | Verified (Brand Repaired) |
| `/growth` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/how-it-works` | Static (○) | MarketingShell | Public / Families | Verified (Brand Repaired) |
| `/inneros/dashboard` | Static (○) | SanctuaryShell | Adult Wellbeing | Cleanly Isolated |
| `/inneros/safety` | Static (○) | SanctuaryShell | Adult Wellbeing | Cleanly Isolated |
| `/integrations` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/investor-demo` | Static (○) | DemoShell | Investors & Donors | Verified (Truth in Compliance) |
| `/journal` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/kids` | Static (○) | ChildNavigationShell | Children (Ages 4–11) | Verified (Magic Home) |
| `/knowledge` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/languages` | Static (○) | MarketingShell | Multilingual Users | Verified (EN, UR, PA) |
| `/login` | Static (○) | AuthShell | All Roles | Verified |
| `/memory` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/offline` | Static (○) | OfflineShell | Offline Users | Verified (PWA Service Worker) |
| `/onboarding` | Static (○) | AuthShell | Adults | Isolated |
| `/parent` | Static (○) | WeeblyParentShell | Parents / Caregivers | Verified (Parent Center) |
| `/parents` | Static (○) | MarketingShell | Parents | Verified |
| `/platform` | Static (○) | MarketingShell | Technical Buyers & Govt | Verified (20 Subsystems) |
| `/pricing` | Static (○) | MarketingShell | Public / Schools | Verified |
| `/privacy` | Static (○) | MarketingShell | Legal & Regulators | Verified (Aligned Architecture) |
| `/privacy-trust` | Static (○) | MarketingShell | Public / Evaluators | Verified |
| `/professional/portal`| Static (○)| ProfessionalShell | Case Workers / Clinicians| Verified (Clinical Boundaries) |
| `/reminders` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/research` | Static (○) | MarketingShell | Academics & Evaluators | Verified |
| `/safety` | Static (○) | MarketingShell | Public / General | Verified |
| `/school/portal` | Static (○) | SchoolShell | School Principals & Depts | Verified (Punjab Pilot Data) |
| `/schools` | Static (○) | MarketingShell | Educators & Schools | Verified |
| `/schools/onboarding` | Static (○)| SchoolShell | New School Cohorts | Verified |
| `/schools/pilot` | Static (○) | MarketingShell | Punjab Govt / SED | Verified (8-Week Framework) |
| `/settings/notifications`| Static (○)| AppShell | Adult Sanctuary | Isolated |
| `/settings/privacy` | Static (○) | AppShell | Adult Sanctuary | Isolated |
| `/signup` | Static (○) | AuthShell | Parents, Teachers, Students| Verified (Adult Bridge) |
| `/student` | Static (○) | ChildNavigationShell | Children | Verified |
| `/teacher` | Static (○) | Redirect / Shell | Teachers | Verified |
| `/teacher/dashboard` | Static (○) | TeacherShell | Assigned Classroom Teachers| Verified (Studio & Quests) |
| `/technology` | Static (○) | MarketingShell | CTOs & System Architects | Verified |
| `/teens` | Static (○) | TeenShell | Adolescents (Ages 12–18) | Verified |
| `/terms` | Static (○) | MarketingShell | Legal | Verified (Dual Platform Separation) |
| `/trust` | Static (○) | MarketingShell | Regulators & UNICEF | Verified |
| `/youth` | Static (○) | YouthShell | General Youth Hub | Verified |
| `/youth/academy` | Static (○) | YouthShell | Students | Verified (25 Depts) |
| `/youth/academy/lesson/[id]`| Dynamic (ƒ)| YouthShell | Students | Verified (SSR / Dynamic) |
| `/youth/accessibility`| Static (○)| YouthShell | Neurodivergent Students | Verified |
| `/youth/achievements`| Static (○) | YouthShell | Students | Verified (Non-Competitive) |
| `/youth/activities` | Dynamic (ƒ) | ChildNavigationShell | Students | Verified (Curriculum Puzzles) |
| `/youth/chat` | Static (○) | ChildNavigationShell | Students | Verified (Kai/Mia/Lumi/Zayn) |
| `/youth/consent` | Static (○) | YouthShell | Parents / Caregivers | Verified (Parent Gate) |
| `/youth/creative-studio`| Static (○)| ChildNavigationShell | Students | Verified (Instant Canvas Mount) |
| `/youth/dashboard` | Static (○) | ChildNavigationShell | Students | Verified (Magic Home) |
| `/youth/emotions` | Static (○) | ChildNavigationShell | Students | Verified (Feelings Wheel) |
| `/youth/friends` | Dynamic (ƒ) | ChildNavigationShell | Students | Verified (4 AI Friends) |
| `/youth/habits` | Static (○) | ChildNavigationShell | Students | Verified (Anti-Guilt Routines) |
| `/youth/journal` | Static (○) | ChildNavigationShell | Students | Verified (Private Child Journal) |
| `/youth/language` | Static (○) | ChildNavigationShell | Multilingual Students | Verified (Trilingual Switcher) |
| `/youth/onboarding` | Static (○) | ChildNavigationShell | Students | Verified (Mascot Selection) |
| `/youth/play` | Dynamic (ƒ) | ChildNavigationShell | Students | Verified (6 Learning Worlds) |
| `/youth/routines` | Static (○) | ChildNavigationShell | Students | Verified (Visual Schedule) |
| `/youth/safety` | Static (○) | YouthShell | Students & Parents | Verified (Distress Helpline) |
| `/youth/stories` | Static (○) | ChildNavigationShell | Students | Verified (Bedtime & Cartoons) |
| `/youth/support-center`| Static (○)| YouthShell | Neurodivergent Students | Verified (Universal Design) |
| `/youth/visual-supports`| Static (○)| ChildNavigationShell | AAC / Visual Communicators| Verified |
| `/youth/voice` | Static (○) | ChildNavigationShell | Students | Verified (Real Voice / Turn) |
| `/api/curriculum/questions`| Dynamic (ƒ)| API Route | Internal RAG / Bank | Verified |
| `/api/curriculum/stats` | Static (○) | API Route | Telemetry / Audit | Verified |
| `/api/educational/activity-events`| Dynamic (ƒ)| API Route | Educational Event Bus | Verified |
| `/api/youth/friends/turn`| Dynamic (ƒ)| API Route | AI Voice Turn Orchestrator| Verified |\n