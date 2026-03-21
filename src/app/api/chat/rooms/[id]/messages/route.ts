import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
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

  const url = new URL(request.url);
  const since = url.searchParams.get("since");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);

  const where: Record<string, unknown> = { chatRoomId: id };
  if (since) {
    where.createdAt = { gt: new Date(since) };
  }

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: since ? "asc" : "desc" },
    take: limit,
    include: {
      sender: { select: { id: true, displayName: true, avatarUrl: true } },
    },
  });

  // When doing initial load (no since), reverse so oldest is first
  const result = since ? messages : messages.reverse();

  return NextResponse.json(
    result.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      sender: m.sender,
    }))
  );
}

export async function POST(
  request: NextRequest,
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

  const body = await request.json();
  const content = (body.content as string)?.trim();

  if (!content) {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      content,
      chatRoomId: id,
      senderId: userId,
    },
    include: {
      sender: { select: { id: true, displayName: true, avatarUrl: true } },
    },
  });

  // Update sender's lastReadAt
  await prisma.chatMember.update({
    where: { userId_chatRoomId: { userId, chatRoomId: id } },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json(
    {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
    },
    { status: 201 }
  );
}
