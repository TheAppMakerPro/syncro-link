"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePolling } from "@/hooks/usePolling";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import type { MessageWithSender } from "@/types";

export default function MessageThread({
  roomId,
  currentUserId,
  onNewMessages,
}: {
  roomId: string;
  currentUserId: string;
  onNewMessages?: (messages: MessageWithSender[]) => void;
}) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);

  // Track scroll position
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    isAtBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // Initial load
  useEffect(() => {
    setMessages([]);
    setLoading(true);
    fetch(`/api/chat/rooms/${roomId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
        setTimeout(scrollToBottom, 50);
      })
      .catch(() => setLoading(false));
  }, [roomId]);

  // Poll for new messages
  const pollMessages = useCallback(async () => {
    if (messages.length === 0 && loading) return;

    const lastTime =
      messages.length > 0
        ? messages[messages.length - 1].createdAt
        : new Date(0).toISOString();

    try {
      const res = await fetch(
        `/api/chat/rooms/${roomId}/messages?since=${encodeURIComponent(lastTime)}`
      );
      if (!res.ok) return;
      const newMsgs: MessageWithSender[] = await res.json();

      if (newMsgs.length > 0) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const unique = newMsgs.filter((m) => !ids.has(m.id));
          return unique.length > 0 ? [...prev, ...unique] : prev;
        });

        // Mark as read
        fetch(`/api/chat/rooms/${roomId}/read`, { method: "PUT" }).catch(() => {});

        // Notify parent for browser notifications
        const othersMessages = newMsgs.filter((m) => m.sender.id !== currentUserId);
        if (othersMessages.length > 0 && onNewMessages) {
          onNewMessages(othersMessages);
        }

        if (isAtBottom.current) {
          setTimeout(scrollToBottom, 50);
        }
      }
    } catch {
      // ignore polling errors
    }
  }, [roomId, messages, loading, currentUserId, onNewMessages]);

  usePolling(pollMessages, 3000, !loading);

  const handleSend = async (content: string) => {
    const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) return;
    const msg: MessageWithSender = await res.json();

    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      return ids.has(msg.id) ? prev : [...prev, msg];
    });
    setTimeout(scrollToBottom, 50);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/40 animate-pulse">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/40 text-sm">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender.id === currentUserId}
            />
          ))
        )}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
}
