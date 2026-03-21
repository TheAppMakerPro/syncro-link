"use client";

import type { MessageWithSender } from "@/types";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (diffDays === 0) return time;
  if (diffDays === 1) return `Yesterday ${time}`;
  if (diffDays < 7) return `${d.toLocaleDateString([], { weekday: "short" })} ${time}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })} ${time}`;
}

export default function MessageBubble({
  message,
  isOwn,
}: {
  message: MessageWithSender;
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            {message.sender.avatarUrl ? (
              <img
                src={message.sender.avatarUrl}
                alt=""
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px] font-bold text-white">
                {message.sender.displayName[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-xs text-white/50 font-medium">
              {message.sender.displayName}
            </span>
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isOwn
              ? "bg-purple-600/40 backdrop-blur-sm border border-purple-400/20 text-white"
              : "bg-white/10 backdrop-blur-sm border border-white/10 text-white/90"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <p
          className={`text-[10px] text-white/30 mt-1 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
