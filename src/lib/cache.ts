type CacheEntry<T> = { value: T; expiresAt: number };
const store = new Map<string, CacheEntry<any>>();

export function getCache<T>(key: string): T | null {
    const entry = store.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
    }
    return entry.value;
}

export function setCache<T>(key: string, value: T, ttlMs: number) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
}
