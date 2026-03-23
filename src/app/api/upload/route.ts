import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/upload";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const userId = await getSession();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await saveUploadedFile(file, "posts");
    if (!result) {
      return NextResponse.json({ error: "File storage not configured" }, { status: 503 });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
