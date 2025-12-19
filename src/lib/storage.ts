import fs from "node:fs";
import path from "node:path";

export interface StorageAdapter {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
    delete(key: string): Promise<void>;
}

export class MemoryAdapter implements StorageAdapter {
    private store = new Map<string, { value: unknown; expiresAt: number }>();

    async get<T>(key: string): Promise<T | null> {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value as T;
    }

    async set<T>(key: string, value: T, ttlMs: number = 0): Promise<void> {
        this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key);
    }
}

export class FileSystemAdapter implements StorageAdapter {
    private memoryStore = new Map<string, { value: unknown; expiresAt: number }>();
    private cacheDir: string;
    private cacheFile: string;
    private hasHydrated = false;

    constructor() {
        this.cacheDir = process.env.DATA_CACHE_DIR || ".data-cache";
        this.cacheFile = path.join(this.cacheDir, "vacant-cache.json");
    }

    private hydrate() {
        if (this.hasHydrated) return;
        this.hasHydrated = true;

        try {
            if (!fs.existsSync(this.cacheFile)) return;
            const raw = fs.readFileSync(this.cacheFile, "utf-8");
            const parsed = JSON.parse(raw);

            for (const [key, entry] of Object.entries(parsed) as [string, { value: unknown; expiresAt: number }][]) {
                if (Date.now() < entry.expiresAt) {
                    this.memoryStore.set(key, entry);
                }
            }
        } catch (error) {
            console.warn("Cache hydrate failed:", error);
        }
    }

    private persist() {
        try {
            fs.mkdirSync(this.cacheDir, { recursive: true });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const serializable: Record<string, any> = {};
            for (const [k, v] of this.memoryStore.entries()) {
                serializable[k] = v;
            }
            fs.writeFileSync(this.cacheFile, JSON.stringify(serializable));
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.warn("Cache persist failed:", error);
            }
        }
    }

    async get<T>(key: string): Promise<T | null> {
        this.hydrate();
        const entry = this.memoryStore.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.memoryStore.delete(key);
            return null;
        }
        return entry.value as T;
    }

    async set<T>(key: string, value: T, ttlMs: number = 0): Promise<void> {
        this.hydrate();

        // Naive cleanup
        if (this.memoryStore.size >= 1000) {
            for (const [k, v] of this.memoryStore.entries()) {
                if (Date.now() > v.expiresAt) this.memoryStore.delete(k);
            }
        }

        this.memoryStore.set(key, { value, expiresAt: Date.now() + ttlMs });
        this.persist();
    }

    async delete(key: string): Promise<void> {
        this.hydrate();
        this.memoryStore.delete(key);
        this.persist();
    }
}

export class RedisAdapter implements StorageAdapter {
    private url: string;
    private token: string;

    constructor(url: string, token: string) {
        this.url = url;
        this.token = token;
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const res = await fetch(`${this.url}/get/${key}`, {
                headers: { Authorization: `Bearer ${this.token}` },
                cache: 'no-store'
            });
            const data = await res.json();
            if (!data.result) return null;
            // Vercel KV usually returns the string/object. 
            return (typeof data.result === 'string' ? JSON.parse(data.result) : data.result) as T;
        } catch (e) {
            console.error("Redis get error:", e);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttlMs: number = 0): Promise<void> {
        try {
            const command = ttlMs > 0 ? `set/${key}?ex=${Math.ceil(ttlMs / 1000)}` : `set/${key}`;
            await fetch(`${this.url}/${command}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${this.token}` },
                body: JSON.stringify(value),
                cache: 'no-store'
            });
        } catch (e) {
            console.error("Redis set error:", e);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await fetch(`${this.url}/del/${key}`, {
                headers: { Authorization: `Bearer ${this.token}` },
                cache: 'no-store'
            });
        } catch (e) {
            console.error("Redis delete error:", e);
        }
    }
}

export function getStorage(): StorageAdapter {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        return new RedisAdapter(process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN);
    }

    if (process.env.NODE_ENV === "production") {
        console.warn("WARNING: Running in production without shared cache (Vercel KV). Falls back to instance-local memory/disk, which may be ineffective in serverless.");
    }

    return new FileSystemAdapter();
}

