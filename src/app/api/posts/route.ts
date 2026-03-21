import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractHashtags } from "@/lib/hashtags";
import { saveUploadedFile } from "@/lib/upload";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const hashtag = searchParams.get("hashtag") || "";
  const userId = searchParams.get("userId") || "";

  const where: Record<string, unknown> = {};

  if (search) {
    where.user = { displayName: { contains: search } };
  }

  if (userId) {
    where.userId = userId;
  }

  if (hashtag) {
    where.hashtags = {
      some: { hashtag: { name: hashtag.toLowerCase() } },
    };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        user: {
          select: { id: true, displayName: true, avatarUrl: true },
        },
        hashtags: { include: { hashtag: true } },
        media: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  try {
    const sessionUserId = await getSession();
    if (!sessionUserId) {
      return NextResponse.json({ error: "Not registered" }, { status: 401 });
    }

    const formData = await request.formData();
    const content = formData.get("content") as string;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const hashtags = extractHashtags(content);

    const post = await prisma.post.create({
      data: {
        content,
        userId: sessionUserId,
        hashtags: {
          create: await Promise.all(
            hashtags.map(async (name) => {
              const ht = await prisma.hashtag.upsert({
                where: { name },
                update: {},
                create: { name },
              });
              return { hashtagId: ht.id };
            })
          ),
        },
      },
      include: {
        user: { select: { id: true, displayName: true, avatarUrl: true } },
        hashtags: { include: { hashtag: true } },
        media: true,
      },
    });

    const mediaFiles = formData.getAll("media") as File[];
    for (const file of mediaFiles) {
      if (file.size > 0) {
        const result = await saveUploadedFile(file, "posts");
        if (result) {
          await prisma.media.create({
            data: { url: result.url, type: result.type, postId: post.id, userId: sessionUserId },
          });
        }
      }
    }

    // Ensure user is visible
    await prisma.user.update({
      where: { id: sessionUserId },
      data: { isVisible: true },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
