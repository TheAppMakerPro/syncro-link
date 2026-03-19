import { put } from "@vercel/blob";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export async function saveUploadedFile(
  file: File,
  subdir: "avatars" | "posts"
): Promise<{ url: string; type: "image" | "video" }> {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM");
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be under 10MB");
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    throw new Error("Video must be under 50MB");
  }

  const ext = file.name.split(".").pop() || (isImage ? "jpg" : "mp4");
  const filename = `${subdir}/${crypto.randomUUID()}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    type: isImage ? "image" : "video",
  };
}
