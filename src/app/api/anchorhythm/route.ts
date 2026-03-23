import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const BREATH_COUNTS: Record<string, number> = {
  "#e8e8ff": 3,   // White Star
  "#00cc66": 9,   // Emerald Heart
  "#4488cc": 18,  // Blue Sapphire
  "#9933cc": 27,  // Violet Flame
  "#daa520": 50,  // Golden Ground
};

export async function GET() {
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;

  const users = await prisma.user.findMany({
    where: { isVisible: true },
    select: { markerColor: true, createdAt: true },
  });

  const dailyAnchors = users.reduce((sum, user) => {
    return sum + (BREATH_COUNTS[user.markerColor] || 3);
  }, 0);

  const weeklyAnchors = users.reduce((sum, user) => {
    const daysActive = Math.max(1, Math.floor((now - user.createdAt.getTime()) / msPerDay));
    const activeDaysThisWeek = Math.min(daysActive, 7);
    return sum + (BREATH_COUNTS[user.markerColor] || 3) * activeDaysThisWeek;
  }, 0);

  // Total anchors: each user contributes their daily rate × days since they joined
  const totalToDate = users.reduce((sum, user) => {
    const daysActive = Math.max(1, Math.floor((now - user.createdAt.getTime()) / msPerDay));
    return sum + (BREATH_COUNTS[user.markerColor] || 3) * daysActive;
  }, 0);

  return NextResponse.json({
    daily: dailyAnchors,
    weekly: weeklyAnchors,
    total: totalToDate,
    gridPoints: users.length,
  });
}
