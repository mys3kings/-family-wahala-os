import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Upstash Redis environment variables are not configured.");
  if (!client) client = new Redis({ url, token, enableTelemetry: false });
  return client;
}
