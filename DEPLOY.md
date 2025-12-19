# Deployment & Runtime Requirements

## Runtime Environment
- **Node.js**: Version 18+ (LTS recommended).
- **Framework**: Next.js 14+ (App Router).

## Environment Variables
| Variable | Description | Default | Required? |
|----------|-------------|---------|-----------|
| `NODE_ENV` | Runtime mode (`development`, `production`). | `development` | Yes |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` **ONLY** in local dev if facing corporate proxy SSL issues. | `undefined` | No |
| `KV_REST_API_URL` | Vercel KV formatted Redis URL (e.g., `https://...upstash.io`). If set, storage uses Redis. | `undefined` | Optional |
| `KV_REST_API_TOKEN` | Vercel KV REST Token. Required if URL is set. | `undefined` | Optional |
| `DATA_CACHE_DIR` | Directory for filesystem cache (not used if KV is set). | `.data-cache` | No |
| `SENTRY_DSN` | Sentry Data Source Name for error tracking. | `undefined` | Optional |
| `LOGTAIL_SOURCE_TOKEN` | Logtail/BetterStack source token for remote logging. | `undefined` | Optional |

## External Dependencies
- **ArcGIS REST API**: Ensure outbound connectivity to `services.arcgis.com` on port 443.
- **Vercel KV (Redis)**: Optional. If configured, caching and rate-limiting will use this shared store. If not, it falls back to ephemeral file-system storage (not recommended for serverless).

## Deployment Platforms
- **Vercel** (Recommended): Zero-config deployment.
- **Docker**: Can be containerized using the standard Next.js Dockerfile.

## Monitoring & Logging
- **Application Logs**: API errors are logged to `stderr`. Monitor for `API Proxy Error`.
- **Performance**: Monitor `next.js` server response times.
- **Rate Limit**: Monitor 429 response codes to adjust `rateLimit.ts` thresholds.

## Security & Authentication
This MVP has **NO authentication**. It is a public-facing tool.

### To Add Authentication:
1. Wrap `src/app/api/vacant/route.ts` with NextAuth middleware.
2. Require an API key via `Authorization` header validation in the API route.
