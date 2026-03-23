import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email as string)?.trim().toLowerCase();
    const password = body.password as string;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always run bcrypt compare to prevent timing attacks that reveal
    // whether an email exists in the database
    const dummyHash = "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWX.YZ";
    const valid = await bcrypt.compare(password, user?.password || dummyHash);

    if (!user || !user.password || !valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user.id);
    const response = NextResponse.json({
      id: user.id,
      displayName: user.displayName,
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
