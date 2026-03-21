"use client";

import { useState, useCallback } from "react";
import { Plus, KeyRound } from "lucide-react";
import { usePolling } from "@/hooks/usePolling";
import RoomListItem from "./RoomListItem";
import type { ChatRoomWithMeta } from "@/types";

export default function RoomList({
  activeRoomId,
  onSelectRoom,
  onCreateRoom,
  onJoinRoom,
}: {
  activeRoomId: string | null;
  onSelectRoom: (id: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}) {
  const [rooms, setRooms] = useState<ChatRoomWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/rooms");
      if (!res.ok) return;
      const data = await res.json();
      setRooms(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  usePolling(fetchRooms, 10000);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-bold text-white mb-3">Your Rooms</h2>
        <div className="flex gap-2">
          <button
            onClick={onCreateRoom}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600/30 border border-purple-400/20 text-xs font-semibold text-purple-200 hover:bg-purple-600/40 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create
          </button>
          <button
            onClick={onJoinRoom}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-white/70 hover:bg-white/15 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" /> Join
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-white/40 animate-pulse text-sm">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-white/40 text-sm">No rooms yet</p>
            <p className="text-white/25 text-xs mt-1">
              Create a room or join one with a code
            </p>
          </div>
        ) : (
          rooms.map((room) => (
            <RoomListItem
              key={room.id}
              room={room}
              active={room.id === activeRoomId}
              onClick={() => onSelectRoom(room.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
