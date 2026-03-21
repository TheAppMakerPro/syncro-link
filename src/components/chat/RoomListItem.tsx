"use client";

import type { ChatRoomWithMeta } from "@/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function RoomListItem({
  room,
  active,
  onClick,
}: {
  room: ChatRoomWithMeta;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 transition-colors rounded-xl ${
        active
          ? "bg-purple-600/30 border border-purple-400/20"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">
              {room.name}
            </h3>
            {room.unreadCount > 0 && (
              <span className="shrink-0 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-amber-500 text-[10px] font-bold text-white px-1">
                {room.unreadCount > 99 ? "99+" : room.unreadCount}
              </span>
            )}
          </div>
          {room.lastMessage ? (
            <p className="text-xs text-white/40 truncate mt-0.5">
              <span className="text-white/50 font-medium">
                {room.lastMessage.sender.displayName}:
              </span>{" "}
              {room.lastMessage.content}
            </p>
          ) : (
            <p className="text-xs text-white/30 italic mt-0.5">No messages yet</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          {room.lastMessage && (
            <span className="text-[10px] text-white/30">
              {timeAgo(room.lastMessage.createdAt)}
            </span>
          )}
          <p className="text-[10px] text-white/20 mt-0.5">
            {room.memberCount} {room.memberCount === 1 ? "member" : "members"}
          </p>
        </div>
      </div>
    </button>
  );
}
