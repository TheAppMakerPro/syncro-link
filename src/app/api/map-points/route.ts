import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getApproxCoords } from "@/lib/geocode";

export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      isVisible: true,
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
      markerColor: true,
    },
  });

  const points = users
    .map((u) => {
      // If user already has coordinates, use them directly.
      if (u.latitude != null && u.longitude != null) {
        return {
          ...u,
          isApproximate: false,
        };
      }

      // Fall back to city/country-based approximate coordinates.
      if (u.country) {
        const approx = getApproxCoords(u.country, u.city);
        if (approx) {
          return {
            ...u,
            latitude: approx.latitude,
            longitude: approx.longitude,
            isApproximate: true,
          };
        }
      }

      // No coordinates and no recognisable country — skip this user.
      return null;
    })
    .filter(Boolean);

  return NextResponse.json(points);
}
