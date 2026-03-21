"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Users, ArrowLeft, LogOut } from "lucide-react";

interface RoomDetails {
  id: string;
  name: string;
  code: string;
  memberCount: number;
  members: { id: string; displayName: string; avatarUrl: string | null }[];
}

export default function RoomHeader({
  roomId,
  onBack,
  onLeave,
}: {
  roomId: string;
  onBack?: () => void;
  onLeave: () => void;
}) {
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    fetch(`/api/chat/rooms/${roomId}`)
      .then((r) => r.json())
      .then(setRoom)
      .catch(() => {});
  }, [roomId]);

  const copyCode = async () => {
    if (!room) return;
    await navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!confirm("Leave this room? You can rejoin with the code.")) return;
    const res = await fetch(`/api/chat/rooms/${roomId}`, { method: "DELETE" });
    if (res.ok) onLeave();
  };

  if (!room) {
    return (
      <div className="h-14 border-b border-white/10 flex items-center px-4">
        <div className="text-white/40 animate-pulse text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-white/10 px-4 py-3 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-white truncate">{room.name}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-300 transition-colors font-mono"
            >
              {room.code}
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          <Users className="w-4 h-4" />
          <span>{room.memberCount}</span>
        </button>
        <button
          onClick={handleLeave}
          className="text-white/30 hover:text-red-400 transition-colors"
          title="Leave room"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {showMembers && (
        <div className="border-b border-white/10 px-4 py-3 bg-white/5">
          <p className="text-xs text-white/40 font-semibold mb-2">Members</p>
          <div className="flex flex-wrap gap-2">
            {room.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1"
              >
                {m.avatarUrl ? (
                  <img
                    src={m.avatarUrl}
                    alt=""
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-purple-500/40 flex items-center justify-center text-[8px] font-bold text-white">
                    {m.displayName[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-white/70">{m.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
