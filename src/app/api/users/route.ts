import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractHashtags } from "@/lib/hashtags";
import { saveUploadedFile } from "@/lib/upload";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const displayName = formData.get("displayName") as string;
    const country = formData.get("country") as string;
    const region = (formData.get("region") as string) || "";
    const city = (formData.get("city") as string) || "";
    const latStr = formData.get("latitude") as string;
    const lngStr = formData.get("longitude") as string;
    const contactInfo = (formData.get("contactInfo") as string) || "";
    const bio = (formData.get("bio") as string) || "";
    const firstPostContent = formData.get("firstPostContent") as string;
    const avatar = formData.get("avatar") as File | null;

    if (!displayName || !country || !firstPostContent) {
      return NextResponse.json(
        { error: "Display name, country, and first Right Light post are required" },
        { status: 400 }
      );
    }

    const latitude = latStr ? parseFloat(latStr) : null;
    const longitude = lngStr ? parseFloat(lngStr) : null;

    let avatarUrl: string | null = null;
    if (avatar && avatar.size > 0) {
      const result = await saveUploadedFile(avatar, "avatars");
      if (result) avatarUrl = result.url;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        displayName,
        country,
        region,
        city,
        latitude,
        longitude,
        contactInfo,
        bio,
        avatarUrl,
        isVisible: true,
      },
    });

    // Create first post with hashtags
    const hashtags = extractHashtags(firstPostContent);
    const post = await prisma.post.create({
      data: {
        content: firstPostContent,
        userId: user.id,
        hashtags: {
          create: await Promise.all(
            hashtags.map(async (name) => {
              const hashtag = await prisma.hashtag.upsert({
                where: { name },
                update: {},
                create: { name },
              });
              return { hashtagId: hashtag.id };
            })
          ),
        },
      },
    });

    // Handle post media
    const mediaFiles = formData.getAll("media") as File[];
    for (const file of mediaFiles) {
      if (file.size > 0) {
        const result = await saveUploadedFile(file, "posts");
        if (result) {
          await prisma.media.create({
            data: { url: result.url, type: result.type, postId: post.id, userId: user.id },
          });
        }
      }
    }

    const token = await createSessionToken(user.id);
    const response = NextResponse.json({ user, post }, { status: 201 });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Registration failed: ${message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  const users = await prisma.user.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      displayName: true,
      country: true,
      city: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
  return NextResponse.json(users);
}
