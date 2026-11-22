import { Redis } from "ioredis";
require("dotenv").config();

interface CacheItem {
  value: string;
  expiresAt?: number;
}

const memoryCache = new Map<string, CacheItem>();

class ResilientRedis {
  private client: Redis | null = null;
  public isReady = false;
  private hasLoggedFallback = false;

  constructor() {
    const url = process.env.REDIS_URL?.trim();

    if (url) {
      try {
        this.client = new Redis(url, {
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
          connectTimeout: 3000,
          lazyConnect: false,
          retryStrategy: (times) => {
            if (times > 1) {
              if (!this.hasLoggedFallback) {
                console.warn("Redis unavailable. Continuing seamlessly with MongoDB & in-memory cache.");
                this.hasLoggedFallback = true;
              }
              return null; // Stop reconnecting in loop
            }
            return 500;
          },
        });

        this.client.on("connect", () => {
          console.log("Redis connected");
        });

        this.client.on("ready", () => {
          this.isReady = true;
          console.log("Redis ready");
        });

        this.client.on("close", () => {
          this.isReady = false;
        });

        this.client.on("error", (error: any) => {
          this.isReady = false;
          if (error?.code === "ENOTFOUND" && !this.hasLoggedFallback) {
            console.warn(`Redis host unresolvable (${error.hostname || "unknown"}). Falling back to MongoDB.`);
            this.hasLoggedFallback = true;
          }
        });
      } catch (err: any) {
        console.warn("Redis initialization notice:", err?.message || err);
      }
    } else {
      console.log("REDIS_URL not configured. Operating with MongoDB and local session cache.");
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isReady && this.client && this.client.status === "ready") {
      try {
        return await this.client.get(key);
      } catch (_) {
        this.isReady = false;
      }
    }

    const item = memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: any, ...args: any[]): Promise<string> {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);

    let ttlMs: number | undefined = undefined;
    if (args && args.length >= 2) {
      const mode = String(args[0]).toUpperCase();
      const num = Number(args[1]);
      if (mode === "EX" && !isNaN(num)) ttlMs = num * 1000;
      if (mode === "PX" && !isNaN(num)) ttlMs = num;
    }

    memoryCache.set(key, {
      value: stringValue,
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
    });

    if (this.isReady && this.client && this.client.status === "ready") {
      try {
        return await (this.client as any).set(key, stringValue, ...args);
      } catch (_) {
        this.isReady = false;
      }
    }

    return "OK";
  }

  async del(...keys: string[]): Promise<number> {
    let deletedCount = 0;
    for (const k of keys) {
      if (memoryCache.delete(k)) deletedCount++;
    }

    if (this.isReady && this.client && this.client.status === "ready") {
      try {
        return await (this.client as any).del(...keys);
      } catch (_) {
        this.isReady = false;
      }
    }

    return deletedCount || 1;
  }
}

export const redis = new ResilientRedis() as unknown as Redis;