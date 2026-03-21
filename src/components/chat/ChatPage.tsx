"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import RoomList from "./RoomList";
import RoomHeader from "./RoomHeader";
import MessageThread from "./MessageThread";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";
import type { MessageWithSender } from "@/types";

export default function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [loading, setLoading] = useState(true);
  const notifPermissionRef = useRef(false);

  // Get current user
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => {
        if (r.ok) return r.json();
        return null;
      })
      .then((data) => {
        if (data?.id) setCurrentUserId(data.id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Request notification permission
  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default" &&
      !notifPermissionRef.current
    ) {
      notifPermissionRef.current = true;
      // Small delay so it doesn't feel aggressive
      const t = setTimeout(() => {
        Notification.requestPermission();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleNewMessages = useCallback(
    (messages: MessageWithSender[]) => {
      if (
        typeof Notification === "undefined" ||
        Notification.permission !== "granted" ||
        document.hasFocus()
      ) {
        return;
      }

      const latest = messages[messages.length - 1];
      if (!latest) return;

      new Notification(`${latest.sender.displayName}`, {
        body: latest.content.slice(0, 100),
        tag: `chat-${selectedRoom}`,
      });
    },
    [selectedRoom]
  );

  const handleRoomCreated = (roomId: string) => {
    setShowCreate(false);
    setSelectedRoom(roomId);
  };

  const handleRoomJoined = (roomId: string) => {
    setShowJoin(false);
    setSelectedRoom(roomId);
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
  };

  if (loading) {
    return (
      <div className="content-panel h-[calc(100vh-140px)] flex items-center justify-center">
        <p className="text-white/40 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="content-panel h-[calc(100vh-140px)] flex flex-col items-center justify-center gap-4">
        <MessageSquare className="w-12 h-12 text-white/20" />
        <p className="text-white/50 text-sm">
          You need to be registered to use chat.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="content-panel h-[calc(100vh-140px)] flex overflow-hidden !p-0">
        {/* Room list sidebar */}
        <div
          className={`${
            selectedRoom ? "hidden md:flex" : "flex"
          } flex-col w-full md:w-80 md:border-r border-white/10 shrink-0`}
        >
          <RoomList
            activeRoomId={selectedRoom}
            onSelectRoom={setSelectedRoom}
            onCreateRoom={() => setShowCreate(true)}
            onJoinRoom={() => setShowJoin(true)}
          />
        </div>

        {/* Message area */}
        <div
          className={`${
            selectedRoom ? "flex" : "hidden md:flex"
          } flex-col flex-1 min-w-0`}
        >
          {selectedRoom ? (
            <>
              <RoomHeader
                roomId={selectedRoom}
                onBack={() => setSelectedRoom(null)}
                onLeave={handleLeaveRoom}
              />
              <MessageThread
                key={selectedRoom}
                roomId={selectedRoom}
                currentUserId={currentUserId}
                onNewMessages={handleNewMessages}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <MessageSquare className="w-12 h-12 text-white/10" />
              <p className="text-white/30 text-sm">
                Select a room or create one to start chatting
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <CreateRoomModal
            onClose={() => setShowCreate(false)}
            onCreated={handleRoomCreated}
          />
        )}
        {showJoin && (
          <JoinRoomModal
            onClose={() => setShowJoin(false)}
            onJoined={handleRoomJoined}
          />
        )}
      </AnimatePresence>
    </>
  );
}
