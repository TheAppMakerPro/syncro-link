import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const code = (body.code as string)?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "Room code is required" }, { status: 400 });
  }

  const room = await prisma.chatRoom.findUnique({ where: { code } });
  if (!room) {
    return NextResponse.json({ error: "No room found with that code" }, { status: 404 });
  }

  // Check if already a member (idempotent)
  const existing = await prisma.chatMember.findUnique({
    where: { userId_chatRoomId: { userId, chatRoomId: room.id } },
  });

  if (!existing) {
    await prisma.chatMember.create({
      data: { userId, chatRoomId: room.id },
    });
  }

  return NextResponse.json({
    id: room.id,
    name: room.name,
    code: room.code,
    createdAt: room.createdAt.toISOString(),
  });
}
