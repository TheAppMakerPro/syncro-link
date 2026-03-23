"use client";

import { useEffect, useState } from "react";

interface AnchorData {
  daily: number;
  weekly: number;
  total: number;
  gridPoints: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 1500;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

export default function AnchorhythmPage() {
  const [data, setData] = useState<AnchorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/anchorhythm")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/icons/app-icon.png"
            alt="Syncro-Link"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.3)]"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wider mb-3"
            style={{ fontFamily: "var(--font-space)" }}
          >
            The Anchorhythm
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            The pulse of the grid. Real-time frequency anchors being set by
            lightworkers worldwide.
          </p>
        </div>

        {/* Three fields */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-white/40 animate-pulse font-medium">
              Reading the grid...
            </div>
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Daily */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 sm:p-8 text-center">
              <div
                className="text-3xl sm:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <AnimatedNumber value={data.daily} />
              </div>
              <p className="text-white/50 text-sm font-medium uppercase tracking-wider">
                Daily Anchors
              </p>
              <p className="text-white/30 text-xs mt-2">
                Frequency anchors set today
              </p>
            </div>

            {/* Weekly */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 sm:p-8 text-center">
              <div
                className="text-3xl sm:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <AnimatedNumber value={data.weekly} />
              </div>
              <p className="text-white/50 text-sm font-medium uppercase tracking-wider">
                Weekly Anchors
              </p>
              <p className="text-white/30 text-xs mt-2">
                Frequency anchors set this week
              </p>
            </div>

            {/* Total */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] backdrop-blur-sm p-6 sm:p-8 text-center">
              <div
                className="text-3xl sm:text-4xl font-bold text-emerald-300 mb-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <AnimatedNumber value={data.total} />
              </div>
              <p className="text-emerald-400/70 text-sm font-medium uppercase tracking-wider">
                Total to Date
              </p>
              <p className="text-white/30 text-xs mt-2">
                Worldwide frequency anchors since launch
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-white/40">
            Unable to read the grid. Please try again.
          </div>
        )}

        {/* Grid points count */}
        {data && (
          <div className="text-center mt-8">
            <p className="text-white/40 text-sm">
              <span className="text-white font-bold">{data.gridPoints}</span>{" "}
              {data.gridPoints === 1 ? "point of light" : "points of light"} on
              the grid
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
