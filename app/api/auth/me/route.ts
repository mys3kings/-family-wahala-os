import { NextRequest, NextResponse } from "next/server";
import { readSession, sessionCookie } from "../../../../lib/supabase-admin";
export async function GET(request: NextRequest) {
  const user = readSession(request.cookies.get(sessionCookie)?.value);
  return NextResponse.json({ user });
}
