# Weebly Platform V8 — Dependency Map

## 1. Frontend Core (`apps/web`)
- **Framework**: `next@14.2.33` (React 18.3.1, React DOM 18.3.1)
- **Styling**: `tailwindcss@3.4.1`, `@tailwindcss/typography`, `autoprefixer`, `postcss`
- **Iconography & Visuals**: `lucide-react@^0.378.0`
- **Audio & Animations**: Native Canvas 2D API, Web Audio API, Web Speech API (`SpeechSynthesis`, `SpeechRecognition`)
- **PWA Capabilities**: Custom Service Worker (`public/sw.js`), W3C Web Manifest (`public/manifest.webmanifest`), `IndexedDB` (via `OfflineSyncManager`)
- **Runtime**: Node.js v20+ / Vercel Edge Runtime for Middleware

## 2. Backend Core (`apps/api`)
- **Framework**: `fastapi@^0.111.0`
- **Server**: `uvicorn@^0.29.0`
- **Data Validation**: `pydantic@^2.7.0`
- **Database & ORM**: `sqlalchemy@^2.0.29`, `aiosqlite`, SQLite3 local engine
- **Authentication**: `python-jose[cryptography]`, `passlib[bcrypt]`
- **Testing**: `pytest@^8.1.1`, `pytest-asyncio@^0.23.6`, `httpx@^0.27.0`

## 3. External Network Dependencies
- **CDNs**: Zero external render-blocking font or script CDNs. All fonts are self-hosted or fallback to system sans-serif.
- **Third-Party Trackers**: Zero ad tracking or behavioral surveillance libraries.\n