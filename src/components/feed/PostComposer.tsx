"use client";

import { useState, useRef } from "react";
import { Send, ImagePlus, X } from "lucide-react";
import { GlowTextarea } from "@/components/ui/GlowInput";

interface PostComposerProps {
  onPostCreated: () => void;
}

export default function PostComposer({ onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const newFiles = [...files, ...selected].slice(0, 4); // max 4 files
    setFiles(newFiles);

    const newPreviews = newFiles.map((f) => ({
      url: URL.createObjectURL(f),
      type: f.type.startsWith("video/") ? "video" : "image",
    }));
    setPreviews(newPreviews);

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index].url);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("content", content);
      for (const file of files) {
        fd.append("media", file);
      }
      const res = await fetch("/api/posts", { method: "POST", body: fd });
      if (!res.ok) {
        let msg = "Failed to post";
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch {
          msg = `Server error (${res.status})`;
        }
        throw new Error(msg);
      }
      setContent("");
      setFiles([]);
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      onPostCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gold-card p-6">
      <h3 className="font-bold mb-3">Share Your Light</h3>
      {error && (
        <p className="text-red-600 text-sm font-medium mb-3">{error}</p>
      )}
      <GlowTextarea
        placeholder="Post something positive to the Right Light."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />

      {/* File previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {previews.map((preview, i) => (
            <div key={i} className="relative group">
              {preview.type === "image" ? (
                <img
                  src={preview.url}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover border border-white/10"
                />
              ) : (
                <video
                  src={preview.url}
                  className="w-20 h-20 rounded-lg object-cover border border-white/10"
                />
              )}
              <button
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors text-sm"
          >
            <ImagePlus className="w-4 h-4" />
            Add Photo / Video
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && files.length === 0)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-700 text-white font-semibold text-sm hover:bg-purple-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
