import { NextRequest, NextResponse } from "next/server";
import { createSession, db, hashPassword, sessionCookie } from "../../../../lib/supabase-admin";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const { username, password, fullName } = await request.json();
    const clean = String(username || "").trim().toLowerCase();
    const name = String(fullName || "").trim();
    if (!/^[a-z0-9_]{3,24}$/.test(clean)) return NextResponse.json({ error: "Username must be 3–24 characters using lowercase letters, numbers, or underscores." }, { status: 400 });
    if (name.length < 2 || name.length > 80) return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
    if (typeof password !== "string" || password.length < 8 || password.length > 128) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    const rows = await db(`wahala_users?username=eq.${encodeURIComponent(clean)}&select=username`);
    if (rows.length) return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    await db("wahala_users", { method: "POST", body: JSON.stringify({ username: clean, full_name: name, password_hash: hashPassword(password) }) });
    await db("wahala_data", { method: "POST", body: JSON.stringify({ username: clean, data: { income: 0, budget: 0, reqs: [], expenses: [], upcoming: [], goals: [] } }) });
    const response = NextResponse.json({ user: { username: clean, fullName: name } }, { status: 201 });
    response.cookies.set(sessionCookie, createSession(clean, name), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30 * 86400 });
    return response;
  } catch (error) {
    console.error("Signup failed:", error);
    return NextResponse.json({ error: "Account creation is unavailable. Check the server database setup." }, { status: 503 });
  }
}
