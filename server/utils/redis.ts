import { Redis } from "ioredis";
require("dotenv").config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("Connecting to Redis...");
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 4000,
      lazyConnect: false,
      retryStrategy(times) {
        if (times > 3) {
          console.warn("Redis retry threshold reached. Continuing with MongoDB fallback.");
          return null; // Stop reconnecting in loop
        }
        return Math.min(times * 1000, 3000);
      },
    });

    client.on("connect", () => {
      console.log("Redis connected");
    });

    client.on("ready", () => {
      console.log("Redis ready");
    });

    client.on("reconnecting", (delay: number) => {
      console.warn(`Redis reconnecting in ${delay}ms`);
    });

    client.on("error", (error) => {
      console.warn("Redis connection warning:", error.message);
    });

    return client;
  }
  throw new Error("REDIS_URL is not defined");
};

export const redis = redisClient();