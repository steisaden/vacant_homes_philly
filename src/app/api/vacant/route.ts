import { NextResponse } from "next/server";
import { buildArcGisUrl } from "@/lib/arcgis";
import { normalizeArcGis } from "@/lib/normalize";
import { getCache, setCache } from "@/lib/cache";

import { rateLimit } from "@/lib/rateLimit";
import { monitor } from "@/lib/monitor";

const ZIP_REGEX = /^\d{5}$/;
const CACHE_TTL_MS = 86_400_000; // 24 hours
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

// FIX: Disable SSL verification for local dev (fixes "unable to get local issuer certificate")
if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET(req: Request) {
    // 1. Rate Limit
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const { ok, retryAfterMs } = await rateLimit(clientIp, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS);
    if (!ok) {
        return NextResponse.json(
            { error: "Too many requests" },
            {
                status: 429,
                headers: { "Retry-After": Math.ceil((retryAfterMs ?? RATE_LIMIT_WINDOW_MS) / 1000).toString() },
            },
        );
    }

    const { searchParams } = new URL(req.url);
    const zip = searchParams.get("zip")?.trim();

    // 2. Input Validation
    if (!zip || !ZIP_REGEX.test(zip)) {
        return NextResponse.json({ error: "Invalid ZIP code format" }, { status: 400 });
    }

    const cacheKey = `zip:${zip}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        return NextResponse.json(cached, {
            headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
        });
    }

    try {
        const res = await fetch(buildArcGisUrl(zip), {
            next: { revalidate: CACHE_TTL_MS / 1000 },
        });
        const json = await res.json();
        const rows = normalizeArcGis(json.features || []);

        const payload = { rows, fetchedAt: new Date().toISOString() };
        await setCache(cacheKey, payload, CACHE_TTL_MS);

        return NextResponse.json(payload, {
            headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
        });
    } catch (error) {
        monitor.captureException(error, { zip });
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
