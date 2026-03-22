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
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wider mb-3"
            style={{ fontFamily: "var(--font-space)" }}
          >
            The Right Light
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            All posts set in the right light — scroll for variety, search by
            username, or browse by hashtag.
          </p>
        </div>

        <div className="space-y-6">
          {hasSession && (
            <PostComposer onPostCreated={() => fetchPosts("", 1)} />
          )}

          <div className="grid md:grid-cols-[1fr_260px] gap-6">
            <div className="space-y-5">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Syncro-Link Network Name"
              />

              {loading && posts.length === 0 ? (
                <LoadingSpinner />
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <p className="text-lg font-medium mb-1">No posts yet</p>
                  <p className="text-sm">Be the first to share your light!</p>
                </div>
              ) : (
                <>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {page < totalPages && (
                    <motion.div className="text-center pt-2">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-full bg-purple-700 text-white font-semibold text-sm hover:bg-purple-600 transition-colors disabled:opacity-40"
                      >
                        {loading ? "Loading..." : "Load More Light"}
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            <div className="hidden md:block">
              <div className="sticky top-24 space-y-4">
                <HashtagDirectory />

                <div className="gold-card p-5">
                  <h3 className="font-bold text-sm mb-2">The 3 Rules</h3>
                  <ul className="space-y-1.5 text-xs text-white/60">
                    <li>1. No capitalism whatsoever</li>
                    <li>2. Be nice — no bad actors</li>
                    <li>3. Unite and enlight — no doom and gloom</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
