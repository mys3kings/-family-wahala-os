import { NextRequest, NextResponse } from "next/server";
import { db, readSession, sessionCookie } from "../../../lib/supabase-admin";
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  const user = readSession(request.cookies.get(sessionCookie)?.value);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    const rows = await db(`wahala_data?username=eq.${encodeURIComponent(user.username)}&select=data`);
    return NextResponse.json({ data: rows[0]?.data || null });
  } catch (error) { console.error("Data load failed:", error); return NextResponse.json({ error: "Could not load your cloud data." }, { status: 503 }); }
}
export async function PUT(request: NextRequest) {
  const user = readSession(request.cookies.get(sessionCookie)?.value);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    const data = await request.json();
    const safe = {
      income: Number(data.income) || 0, budget: Number(data.budget) || 0,
      reqs: Array.isArray(data.reqs) ? data.reqs : [], expenses: Array.isArray(data.expenses) ? data.expenses : [],
      upcoming: Array.isArray(data.upcoming) ? data.upcoming : [], goals: Array.isArray(data.goals) ? data.goals : [],
    };
    await db(`wahala_data?username=eq.${encodeURIComponent(user.username)}`, { method: "PATCH", body: JSON.stringify({ data: safe }) });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("Data save failed:", error); return NextResponse.json({ error: "Could not save your cloud data." }, { status: 503 }); }
}
