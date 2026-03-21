"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { PostWithUser } from "@/types";

export default function HashtagPage({
  params,
}: {
  params: Promise<{ hashtag: string }>;
}) {
  const { hashtag } = use(params);
  const decodedHashtag = decodeURIComponent(hashtag);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts?hashtag=${encodeURIComponent(decodedHashtag)}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [decodedHashtag]);

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-4xl mx-auto">
        <Link
          href="/right-light"
          className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium text-sm transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all posts
        </Link>

        <h1
          className="text-3xl sm:text-4xl font-bold tracking-wider mb-1"
          style={{ fontFamily: "var(--font-space)" }}
        >
          #{decodedHashtag}
        </h1>
        <p className="text-white/50 text-sm mb-8">
          {posts.length} {posts.length === 1 ? "post" : "posts"} in the right light
        </p>

        <div className="space-y-5">
          {loading ? (
            <LoadingSpinner />
          ) : posts.length === 0 ? (
            <p className="text-center text-white/40 py-12">
              No posts with this hashtag yet.
            </p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
