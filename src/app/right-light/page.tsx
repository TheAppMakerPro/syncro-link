"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/feed/PostCard";
import PostComposer from "@/components/feed/PostComposer";
import HashtagDirectory from "@/components/feed/HashtagDirectory";
import SearchBar from "@/components/feed/SearchBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { PostWithUser } from "@/types";

export default function RightLightPage() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSession, setHasSession] = useState(false);

  const fetchPosts = useCallback(async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: "20",
    });
    if (searchTerm) params.set("search", searchTerm);

    try {
      const res = await fetch(`/api/posts?${params}`);
      const data = await res.json();
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setTotalPages(data.totalPages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    // Check if user has session
    fetch("/api/users")
      .then(() => setHasSession(true))
      .catch(() => {});
  }, [fetchPosts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPosts(search, 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchPosts]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(search, next);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-wider mb-3"
          style={{
            fontFamily: "var(--font-space)",
            textShadow: "0 0 30px rgba(255,215,0,0.3)",
          }}
        >
          The Right Light
        </h1>
        <p className="text-[#f0f0ff]/60 max-w-xl mx-auto">
          All posts set in the right light — scroll for variety, search by
          username, or browse by hashtag.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {hasSession && (
          <PostComposer onPostCreated={() => fetchPosts("", 1)} />
        )}

        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-6">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by Syncro-Link username..."
            />

            {loading && posts.length === 0 ? (
              <LoadingSpinner />
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-[#8888aa]">
                <p className="text-lg mb-2">No posts yet</p>
                <p className="text-sm">Be the first to share your light!</p>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {page < totalPages && (
                  <motion.div className="text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-2 rounded-full border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
                    >
                      {loading ? "Loading..." : "Load More Light"}
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>

          <div className="hidden md:block">
            <div className="sticky top-24">
              <HashtagDirectory />

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d0d2b]/70 backdrop-blur-xl p-6">
                <h3 className="text-amber-400 font-semibold mb-3 text-sm">Remember</h3>
                <ul className="space-y-2 text-xs text-[#8888aa]">
                  <li>No capitalism whatsoever</li>
                  <li>Be nice — no bad actors</li>
                  <li>Unite and enlight — no doom and gloom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
