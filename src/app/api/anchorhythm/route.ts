import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const BREATH_COUNTS: Record<string, number> = {
  "#e8e8ff": 3,   // White Star
  "#00cc66": 9,   // Emerald Heart
  "#4488cc": 18,  // Blue Sapphire
  "#9933cc": 27,  // Violet Flame
  "#daa520": 50,  // Golden Ground
};

const LAUNCH_DATE = new Date("2026-03-19");

export async function GET() {
  const users = await prisma.user.findMany({
    where: { isVisible: true },
    select: { markerColor: true },
  });

  const dailyAnchors = users.reduce((sum, user) => {
    return sum + (BREATH_COUNTS[user.markerColor] || 3);
  }, 0);

  const weeklyAnchors = dailyAnchors * 7;

  const daysSinceLaunch = Math.max(
    1,
    Math.floor((Date.now() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalToDate = dailyAnchors * daysSinceLaunch;

  return NextResponse.json({
    daily: dailyAnchors,
    weekly: weeklyAnchors,
    total: totalToDate,
    gridPoints: users.length,
    daysSinceLaunch,
  });
}
