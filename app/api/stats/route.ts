import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "../../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const suppliedKey = request.nextUrl.searchParams.get("key");
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || !suppliedKey || suppliedKey !== adminKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const total = await getRedis().get<number>("total_visits");
    return NextResponse.json({ total_visits: Number(total || 0) });
  } catch (error) {
    console.error("Stats unavailable:", error);
    return NextResponse.json({ error: "Stats unavailable" }, { status: 503 });
  }
}
