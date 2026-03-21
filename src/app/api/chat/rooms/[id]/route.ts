import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  // Verify membership
  const member = await prisma.chatMember.findUnique({
    where: { userId_chatRoomId: { userId, chatRoomId: id } },
  });
  if (!member) {
    return NextResponse.json({ error: "Not a member of this room" }, { status: 403 });
  }

  const room = await prisma.chatRoom.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: { select: { id: true, displayName: true, avatarUrl: true } },
        },
      },
      _count: { select: { members: true, messages: true } },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: room.id,
    name: room.name,
    code: room.code,
    createdAt: room.createdAt.toISOString(),
    createdBy: room.createdBy,
    memberCount: room._count.members,
    messageCount: room._count.messages,
    members: room.members.map((m) => ({
      ...m.user,
      joinedAt: m.joinedAt.toISOString(),
    })),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const member = await prisma.chatMember.findUnique({
    where: { userId_chatRoomId: { userId, chatRoomId: id } },
  });
  if (!member) {
    return NextResponse.json({ error: "Not a member of this room" }, { status: 403 });
  }

  // Remove membership
  await prisma.chatMember.delete({
    where: { userId_chatRoomId: { userId, chatRoomId: id } },
  });

  // If no members left, delete the room entirely
  const remaining = await prisma.chatMember.count({ where: { chatRoomId: id } });
  if (remaining === 0) {
    await prisma.chatRoom.delete({ where: { id } });
  }

  return NextResponse.json({ success: true });
}
