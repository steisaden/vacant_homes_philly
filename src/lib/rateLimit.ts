import { getStorage } from "./storage";

const storage = getStorage();

type Bucket = { count: number; resetAt: number };

export async function rateLimit(ip: string, limit: number, windowMs: number) {
    const now = Date.now();
    const key = `rate:${ip}`;

    const bucket = await storage.get<Bucket>(key);

    if (!bucket || now > bucket.resetAt) {
        await storage.set(key, { count: 1, resetAt: now + windowMs }, windowMs);
        return { ok: true, retryAfterMs: windowMs };
    }

    if (bucket.count >= limit) {
        return { ok: false, retryAfterMs: bucket.resetAt - now };
    }

    // Increment
    await storage.set(key, { ...bucket, count: bucket.count + 1 }, bucket.resetAt - now);
    return { ok: true, retryAfterMs: bucket.resetAt - now };
}
