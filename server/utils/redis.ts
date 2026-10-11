import {Redis} from "ioredis";
require("dotenv").config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("Connecting to Redis...");
        const client = new Redis(process.env.REDIS_URL);

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
            console.error("Redis connection error:", error.message);
        });

        return client;
    }
    throw new Error("REDIS_URL is not defined");
}

export const redis = redisClient();