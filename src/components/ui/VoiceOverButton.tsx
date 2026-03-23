"use client";

import { useState, useRef, useCallback } from "react";

export default function VoiceOverButton() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggle = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/Meditation.mp3");
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }

    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }, [playing]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            playing
              ? "bg-white/10 border border-white/20 text-white"
              : "bg-purple-600/80 hover:bg-purple-600 text-white border border-purple-500/30"
          }`}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div>
          <p className="text-white/80 text-sm font-semibold">
            {playing ? "Playing Voice Over..." : "Listen to Voice Over"}
          </p>
          <p className="text-white/40 text-xs">
            Guided meditation audio
          </p>
        </div>
      </div>
    </div>
  );
}
