import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const memberships = await prisma.chatMember.findMany({
    where: { userId },
    select: { chatRoomId: true, lastReadAt: true },
  });

  if (memberships.length === 0) {
    return NextResponse.json({ totalUnread: 0, rooms: {} });
  }

  const counts = await Promise.all(
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

  const rooms: Record<string, number> = {};
  let totalUnread = 0;
  memberships.forEach((m, i) => {
    rooms[m.chatRoomId] = counts[i];
    totalUnread += counts[i];
  });

  return NextResponse.json({ totalUnread, rooms });
}
