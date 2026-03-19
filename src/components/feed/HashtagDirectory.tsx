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
    <div className="gold-card p-5">
      <h3 className="font-bold text-sm mb-3">Hashtag Directory</h3>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((ht) => (
          <Link
            key={ht.id}
            href={`/right-light/${encodeURIComponent(ht.name)}`}
            className="text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors"
          >
            #{ht.name}
            <span className="ml-1.5 text-purple-400">{ht._count.posts}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
