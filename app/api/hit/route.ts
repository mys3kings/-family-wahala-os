import { NextResponse } from "next/server";
import { getRedis } from "../../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const requestedDay = typeof body?.date === "string" ? body.date : "";
    const day = /^\d{4}-\d{2}-\d{2}$/.test(requestedDay) ? requestedDay : new Date().toISOString().slice(0, 10);
    const redis = getRedis();
    await Promise.all([
      redis.incr("total_visits"),
      redis.incr(`visits:${day}`),
    ]);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Visit counter unavailable:", error);
    return NextResponse.json({ error: "Visit counter unavailable" }, { status: 503 });
  }
}
