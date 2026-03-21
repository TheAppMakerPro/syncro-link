"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import GlowInput from "@/components/ui/GlowInput";
import GlowButton from "@/components/ui/GlowButton";

export default function JoinRoomModal({
  onClose,
  onJoined,
}: {
  onClose: () => void;
  onJoined: (roomId: string) => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to join room");
      }

      const room = await res.json();
      onJoined(room.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md gold-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Join a Room</h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <GlowInput
            label="Room Code"
            placeholder="Enter the 6-character code..."
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            maxLength={6}
            className="text-center font-mono text-lg tracking-[0.3em] uppercase"
          />
          {error && (
            <p className="text-sm text-red-400 font-medium">{error}</p>
          )}
          <GlowButton
            onClick={handleJoin}
            disabled={code.trim().length < 6 || loading}
            variant="violet"
          >
            {loading ? "Joining..." : "Join Room"}
          </GlowButton>
        </div>
      </motion.div>
    </div>
  );
}
