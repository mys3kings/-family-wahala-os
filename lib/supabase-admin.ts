import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const URL = process.env.SUPABASE_URL || "https://buizhlesqyzdobydlzoz.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SESSION_SECRET = process.env.AUTH_SESSION_SECRET;
const COOKIE = "wahala_session";

export function requireConfig() {
  if (!KEY || !SESSION_SECRET) throw new Error("Server setup is incomplete. Set SUPABASE_SERVICE_ROLE_KEY and AUTH_SESSION_SECRET.");
}

export async function db(path: string, init: RequestInit = {}) {
  requireConfig();
  const response = await fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY!, Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json", Prefer: "return=representation", ...init.headers,
    },
    cache: "no-store",
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Database request failed (${response.status}): ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : null;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}
export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, expected] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}
function sign(value: string) { return createHmac("sha256", SESSION_SECRET!).update(value).digest("hex"); }
export function createSession(username: string, fullName: string) {
  requireConfig();
  const payload = Buffer.from(JSON.stringify({ username, fullName, exp: Date.now() + 30 * 86400000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function readSession(token?: string | null) {
  if (!token || !SESSION_SECRET) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload), "hex");
  const supplied = Buffer.from(signature, "hex");
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.username || !data.fullName || data.exp < Date.now()) return null;
    return { username: String(data.username), fullName: String(data.fullName) };
  } catch { return null; }
}
export const sessionCookie = COOKIE;
