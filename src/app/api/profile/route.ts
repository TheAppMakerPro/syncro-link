import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export async function GET() {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: {
          hashtags: { include: { hashtag: true } },
          media: true,
        },
        orderBy: { createdAt: "desc" },
      },
      media: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  const isFormData = contentType.includes("multipart/form-data");

  let body: Record<string, unknown>;
  let avatarFile: File | null = null;

  if (isFormData) {
    const formData = await request.formData();
    body = {};
    for (const [key, value] of formData.entries()) {
      if (key === "avatar" && value instanceof File) {
        avatarFile = value;
      } else {
        body[key] = value;
      }
    }
  } else {
    body = await request.json();
  }

  const allowedFields = [
    "displayName",
    "country",
    "region",
    "city",
    "latitude",
    "longitude",
    "contactInfo",
    "bio",
    "markerColor",
  ];

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      if (field === "latitude" || field === "longitude") {
        const parsed = body[field] !== "" && body[field] !== null
          ? parseFloat(String(body[field]))
          : null;
        data[field] = parsed !== null && !isNaN(parsed) ? parsed : null;
      } else {
        data[field] = body[field];
      }
    }
  }

  // Handle avatar upload
  if (avatarFile && avatarFile.size > 0) {
    const result = await saveUploadedFile(avatarFile, "avatars");
    if (result) {
      data.avatarUrl = result.url;
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: {
      posts: {
        include: {
          hashtags: { include: { hashtag: true } },
          media: true,
        },
        orderBy: { createdAt: "desc" },
      },
      media: true,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE() {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await prisma.user.delete({ where: { id: userId } });

  const response = NextResponse.json({ success: true });
  response.cookies.set("syncro-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
