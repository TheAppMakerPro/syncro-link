"use client";

import { useState, useCallback } from "react";
import { usePolling } from "@/hooks/usePolling";

export default function ChatNotificationBadge() {
  const [count, setCount] = useState(0);
  const [authed, setAuthed] = useState(true);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/unread");
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.totalUnread || 0);
    } catch {
      // ignore
    }
  }, []);

  usePolling(fetchUnread, 15000, authed);

  if (!authed || count === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[16px] h-[16px] rounded-full bg-amber-500 text-[9px] font-bold text-white px-1 leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}
