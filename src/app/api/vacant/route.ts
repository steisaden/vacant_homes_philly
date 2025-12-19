import { NextResponse } from "next/server";
import { buildArcGisUrl } from "@/lib/arcgis";
import { normalizeArcGis } from "@/lib/normalize";
import { getCache, setCache } from "@/lib/cache";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const zip = searchParams.get("zip");
    if (!zip) return NextResponse.json({ error: "ZIP required" }, { status: 400 });

    const cacheKey = `zip:${zip}`;
    const cached = getCache(cacheKey);
    if (cached) return NextResponse.json(cached);

    try {
        const res = await fetch(buildArcGisUrl(zip));
        const json = await res.json();
        const rows = normalizeArcGis(json.features || []);

        const payload = { rows, fetchedAt: new Date().toISOString() };
        setCache(cacheKey, payload, 86400000); // 24 hours

        return NextResponse.json(payload);
    } catch (error) {
        console.error("API Proxy Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
