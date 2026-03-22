"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { PostWithUser } from "@/types";

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostCard({ post }: { post: PostWithUser }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gold-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        {post.user.avatarUrl ? (
          <img
            src={post.user.avatarUrl}
            alt={post.user.displayName}
            className="w-10 h-10 rounded-full object-cover border border-black/10"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
            {post.user.displayName[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-sm">{post.user.displayName}</p>
          <a
            href="/chat"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
          >
            {post.user.displayName}@Syncro-Link
          </a>
          <p className="text-xs text-white/40">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      <div className="leading-relaxed whitespace-pre-wrap mb-4">
        {post.content}
      </div>

      {post.media.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.media.map((m) =>
            m.type === "image" ? (
              <img
                key={m.id}
                src={m.url}
                alt=""
                className="rounded-lg w-full object-cover max-h-64 border border-black/5"
              />
            ) : (
              <video
                key={m.id}
                src={m.url}
                controls
                className="rounded-lg w-full max-h-64 border border-black/5"
              />
            )
          )}
        </div>
      )}

      {post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {post.hashtags.map(({ hashtag }) => (
            <Link
              key={hashtag.id}
              href={`/right-light/${encodeURIComponent(hashtag.name)}`}
              className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors"
            >
              #{hashtag.name}
            </Link>
          ))}
        </div>
      )}
    </motion.article>
  );
}
