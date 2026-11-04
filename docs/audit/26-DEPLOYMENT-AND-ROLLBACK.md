# 26 — Deployment & Rollback Strategy

- **Hosting Platform**: Vercel Serverless & Edge Network.
- **Production URL**: `https://weebly-gamma.vercel.app/`
- **Build Command**: `pnpm --filter @inneros/web build`
- **Rollback Mechanism**: Instant zero-downtime rollback to prior prebuilt deployment via Vercel CLI (`vercel rollback`).\n