"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { HashtagWithCount } from "@/types";

export default function HashtagDirectory() {
  const [hashtags, setHashtags] = useState<HashtagWithCount[]>([]);

  useEffect(() => {
    fetch("/api/hashtags")
      .then((res) => res.json())
      .then(setHashtags)
      .catch(() => {});
  }, []);

  if (hashtags.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d2b]/70 backdrop-blur-xl p-6">
      <h3 className="text-[#f0f0ff] font-semibold mb-4">Hashtag Directory</h3>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((ht) => (
          <Link
            key={ht.id}
            href={`/right-light/${encodeURIComponent(ht.name)}`}
            className="text-sm px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors border border-amber-500/10 hover:border-amber-500/30"
          >
            #{ht.name}
            <span className="ml-2 text-xs text-amber-400/50">{ht._count.posts}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
