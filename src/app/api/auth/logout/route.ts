import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("syncro-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
