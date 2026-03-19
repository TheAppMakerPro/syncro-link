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
    <div className="gold-card p-6">
      <h3 className="text-[#1a1200] font-semibold mb-4">Hashtag Directory</h3>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((ht) => (
          <Link
            key={ht.id}
            href={`/right-light/${encodeURIComponent(ht.name)}`}
            className="text-sm px-4 py-2 rounded-full bg-[#8a6d00]/10 text-[#6b4f00] hover:bg-[#8a6d00]/20 transition-colors border border-[#8a6d00]/15 hover:border-[#8a6d00]/30"
          >
            #{ht.name}
            <span className="ml-2 text-xs text-[#8a7a40]">{ht._count.posts}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
