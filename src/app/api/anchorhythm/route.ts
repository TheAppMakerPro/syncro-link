import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const BREATH_COUNTS: Record<string, number> = {
  "#e8e8ff": 18,   // White Star
  "#00cc66": 54,   // Emerald Heart
  "#4488cc": 108,  // Blue Sapphire
  "#9933cc": 162,  // Violet Flame
  "#daa520": 270,  // Golden Ground
};

export async function GET() {
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;

  const users = await prisma.user.findMany({
    where: { isVisible: true },
    select: { markerColor: true, createdAt: true },
  });

  const dailyAnchors = users.reduce((sum, user) => {
    return sum + (BREATH_COUNTS[user.markerColor] || 18);
  }, 0);

  const weeklyAnchors = users.reduce((sum, user) => {
    const daysActive = Math.floor((now - user.createdAt.getTime()) / msPerDay) + 1;
    const activeDaysThisWeek = Math.min(daysActive, 7);
    return sum + (BREATH_COUNTS[user.markerColor] || 18) * activeDaysThisWeek;
  }, 0);

  // Total anchors: each user contributes their daily rate × days since they joined
  // +1 to count both the join day and today
  const totalToDate = users.reduce((sum, user) => {
    const daysActive = Math.floor((now - user.createdAt.getTime()) / msPerDay) + 1;
    return sum + (BREATH_COUNTS[user.markerColor] || 18) * daysActive;
  }, 0);

  return NextResponse.json({
    daily: dailyAnchors,
    weekly: weeklyAnchors,
    total: totalToDate,
    gridPoints: users.length,
  });
}
