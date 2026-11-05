import { NextRequest, NextResponse } from "next/server";
import { createSession, db, sessionCookie, verifyPassword } from "../../../../lib/supabase-admin";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const clean = String(username || "").trim().toLowerCase();
    if (!clean || typeof password !== "string") return NextResponse.json({ error: "Wrong username or password" }, { status: 401 });
    const rows = await db(`wahala_users?username=eq.${encodeURIComponent(clean)}&select=username,full_name,password_hash`);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) return NextResponse.json({ error: "Wrong username or password" }, { status: 401 });
    const response = NextResponse.json({ user: { username: user.username, fullName: user.full_name } });
    response.cookies.set(sessionCookie, createSession(user.username, user.full_name), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30 * 86400 });
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ error: "Login service is unavailable. Check the server database setup." }, { status: 503 });
  }
}
