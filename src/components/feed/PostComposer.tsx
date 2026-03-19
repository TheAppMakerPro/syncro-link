"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { GlowTextarea } from "@/components/ui/GlowInput";

interface PostComposerProps {
  onPostCreated: () => void;
}

export default function PostComposer({ onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("content", content);
      const res = await fetch("/api/posts", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post");
      }
      setContent("");
      onPostCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d2b]/70 backdrop-blur-xl p-6">
      <h3 className="text-amber-400 font-semibold mb-3">Share Your Light</h3>
      {error && (
        <p className="text-red-400 text-sm mb-3">{error}</p>
      )}
      <GlowTextarea
        placeholder="Post something positive to the RIGHT LIGHT... use #hashtags to categorize."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
