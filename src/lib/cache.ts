import { getStorage } from "./storage";

const storage = getStorage();

export async function getCache<T>(key: string): Promise<T | null> {
    return await storage.get<T>(key);
}

export async function setCache<T>(key: string, value: T, ttlMs: number) {
    await storage.set(key, value, ttlMs);
}
