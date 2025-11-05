import { kv } from '@vercel/kv';
export async function get(key: string): Promise<string | null> {
    try {
        const value = await kv.get(key);
        return value as string | null;
    }
    catch (error) {
        console.error('KV get error:', error);
        return null;
    }
}
export async function set(key: string, value: string | object): Promise<void> {
    try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await kv.set(key, stringValue);
    }
    catch (error) {
        console.error('KV set error:', error);
        throw error;
    }
}
export async function del(key: string): Promise<void> {
    try {
        await kv.del(key);
    }
    catch (error) {
        console.error('KV del error:', error);
        throw error;
    }
}
export async function mget(keys: string[]): Promise<(string | null)[]> {
    try {
        const values = await kv.mget(...keys);
        return values as (string | null)[];
    }
    catch (error) {
        console.error('KV mget error:', error);
        return keys.map(() => null);
    }
}
export async function mset(entries: Record<string, string>): Promise<void> {
    try {
        const pipeline = kv.pipeline();
        Object.entries(entries).forEach(([key, value]) => {
            pipeline.set(key, value);
        });
        await pipeline.exec();
    }
    catch (error) {
        console.error('KV mset error:', error);
        throw error;
    }
}
export async function mdel(keys: string[]): Promise<void> {
    try {
        await kv.del(...keys);
    }
    catch (error) {
        console.error('KV mdel error:', error);
        throw error;
    }
}
export async function getByPrefix(prefix: string): Promise<string[]> {
    try {
        const keys = await kv.keys(`${prefix}*`);
        if (!keys || keys.length === 0)
            return [];
        const values = await kv.mget(...keys);
        return values.filter((v): v is string => v !== null);
    }
    catch (error) {
        console.error('KV getByPrefix error:', error);
        return [];
    }
}
