Philadelphia Vacant Property Finder
====================================

Sleek Next.js app to search City of Philadelphia vacant property indicators by ZIP code. Backend proxies the ArcGIS REST API with validation, rate limiting, and a cached response layer.

Getting started
---------------
- Requirements: Node 18+, npm.
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build && npm start`

API
---
- Endpoint: `GET /api/vacant?zip=12345`
- Validation: server-side 5-digit ZIP check; rejects anything else with 400.
- Rate limit: defaults to 20 requests per minute per client IP; 429 with `Retry-After` on exceed. (In-memory per instance.)
- Caching: 24h TTL. Responses cached in memory and persisted to disk under `.data-cache/vacant-cache.json` (configurable via `DATA_CACHE_DIR`). Also returns cache headers (`Cache-Control: public, max-age=3600, stale-while-revalidate=86400`).
- Upstream: hits the City of Philadelphia ArcGIS Vacant Indicators FeatureServer. SSL verification is relaxed only in `NODE_ENV=development` to avoid local cert issues.

Deployment notes
----------------
- Persistent cache: mount a writable volume for `DATA_CACHE_DIR` (or the default `.data-cache`) if you want cross-restart caching. In serverless environments the cache will be memory-only per instance; consider moving to a shared store (Redis/Upstash/Vercel KV) for production.
- Rate limiting is per-instance in memory. For real multi-region protection, move the limiter to your edge/CDN or shared store.
- Monitoring/alerting: add Sentry/Logtail or similar to catch upstream errors and rate-limit abuse.
- Compliance: confirm the ArcGIS/OpenData terms for your usage and set an API key or throttling upstream if required.

Known gaps / next steps
-----------------------
- No authentication, tenancy, billing, or user accounts are wired yet.
- SLA/error UX is minimal; add user-facing downtime messaging if the upstream is unavailable.
- Mock data references in the UI should be updated if you decide to ship only live data.
