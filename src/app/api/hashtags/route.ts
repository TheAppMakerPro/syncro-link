import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const hashtags = await prisma.hashtag.findMany({
    include: {
      _count: { select: { posts: true } },
    },
    orderBy: {
      posts: { _count: "desc" },
    },
  });

  return NextResponse.json(hashtags);
}
