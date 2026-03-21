"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import GlowInput from "@/components/ui/GlowInput";
import GlowButton from "@/components/ui/GlowButton";

export default function CreateRoomModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (roomId: string) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdRoom, setCreatedRoom] = useState<{
    id: string;
    code: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create room");
      }

      const room = await res.json();
      setCreatedRoom(room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!createdRoom) return;
    await navigator.clipboard.writeText(createdRoom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h3 className="text-lg font-bold text-white">
            {createdRoom ? "Room Created!" : "Create a Room"}
          </h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdRoom ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Share this code with others so they can join{" "}
              <span className="font-semibold text-white">{createdRoom.name}</span>:
            </p>
            <div className="flex items-center justify-center gap-3 py-4">
              <span className="text-3xl font-mono font-bold text-amber-300 tracking-[0.3em]">
                {createdRoom.code}
              </span>
              <button
                onClick={copyCode}
                className="text-white/50 hover:text-amber-300 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <GlowButton onClick={() => onCreated(createdRoom.id)} variant="violet">
              Start Chatting
            </GlowButton>
          </div>
        ) : (
          <div className="space-y-4">
            <GlowInput
              label="Room Name"
              placeholder="Give your room a name..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            {error && (
              <p className="text-sm text-red-400 font-medium">{error}</p>
            )}
            <GlowButton
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              variant="violet"
            >
              {loading ? "Creating..." : "Create Room"}
            </GlowButton>
          </div>
        )}
      </motion.div>
    </div>
  );
}
