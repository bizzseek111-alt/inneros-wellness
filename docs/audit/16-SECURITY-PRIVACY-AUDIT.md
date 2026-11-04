# 16 — Security & Privacy Architecture Audit

- **Child Privacy Commitment**: Zero advertising, zero data brokers, zero persistent audio recordings.
- **Service Worker Isolation**: CacheStorage strictly omits `/api/*` and `/ws/*`.
- **Database Partitioning**: Adult InnerOS records and child accounts reside in strictly isolated schemas.\n