# 05 — PWA Android & iOS Audit

## Configuration Details
- **Manifest**: `public/manifest.webmanifest` with `display: standalone`, `orientation: portrait-primary`, and 192x192/512x512 icons.
- **Service Worker**: `public/sw.js` precaches shell, implements Stale-While-Revalidate for static assets, and enforces strict Network-Only for `/api/*` and `/ws/*`.
- **Offline Experience**: Custom `/offline` route with local grounding exercises.
- **Device Status**: Verified on Android Chrome emulator; iOS Safari simulation passes; physical iOS device testing pending hardware availability.\n