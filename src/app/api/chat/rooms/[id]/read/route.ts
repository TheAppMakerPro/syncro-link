import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
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

  await prisma.chatMember.update({
    where: { userId_chatRoomId: { userId, chatRoomId: id } },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
