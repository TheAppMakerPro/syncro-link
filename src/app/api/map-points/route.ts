import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      isVisible: true,
      latitude: { not: null },
      longitude: { not: null },
    },
    select: {
      id: true,
      displayName: true,
      latitude: true,
      longitude: true,
      city: true,
      country: true,
      avatarUrl: true,
      bio: true,
      contactInfo: true,
    },
  });

  const points = users.map((u) => ({
    ...u,
    bio: u.bio.length > 300 ? u.bio.slice(0, 300) + "..." : u.bio,
  }));

  return NextResponse.json(points);
}
