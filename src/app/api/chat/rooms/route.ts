import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateRoomCode } from "@/lib/chatCode";

export async function GET() {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const memberships = await prisma.chatMember.findMany({
    where: { userId },
    include: {
      chatRoom: {
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              sender: { select: { displayName: true } },
            },
          },
          _count: { select: { members: true } },
        },
      },
    },
  });

  const rooms = memberships.map((m) => {
    const room = m.chatRoom;
    const lastMsg = room.messages[0] || null;

    return {
      id: room.id,
      name: room.name,
      code: room.code,
      createdAt: room.createdAt.toISOString(),
      memberCount: room._count.members,
      lastMessage: lastMsg
        ? {
            content: lastMsg.content,
            createdAt: lastMsg.createdAt.toISOString(),
            sender: { displayName: lastMsg.sender.displayName },
          }
        : null,
      unreadCount: 0, // computed below
      lastReadAt: m.lastReadAt,
    };
  });

  // Compute unread counts in parallel
  const unreadCounts = await Promise.all(
    memberships.map((m) =>
      prisma.message.count({
        where: {
          chatRoomId: m.chatRoomId,
          createdAt: { gt: m.lastReadAt },
          senderId: { not: userId },
        },
      })
    )
  );

  const result = rooms
    .map((r, i) => ({ ...r, unreadCount: unreadCounts[i], lastReadAt: undefined }))
    .sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.createdAt;
      const bTime = b.lastMessage?.createdAt || b.createdAt;
      return bTime.localeCompare(aTime);
    });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const name = (body.name as string)?.trim();

  if (!name) {
    return NextResponse.json({ error: "Room name is required" }, { status: 400 });
  }

  // Generate unique code with retry
  let code = generateRoomCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.chatRoom.findUnique({ where: { code } });
    if (!existing) break;
    code = generateRoomCode();
    attempts++;
  }

  const room = await prisma.chatRoom.create({
    data: {
      name,
      code,
      createdBy: userId,
      members: {
        create: { userId },
      },
    },
  });

  return NextResponse.json(
    { id: room.id, name: room.name, code: room.code, createdAt: room.createdAt.toISOString() },
    { status: 201 }
  );
}
