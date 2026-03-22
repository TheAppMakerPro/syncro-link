"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Globe2, Map } from "lucide-react";
import type { MapPoint } from "@/types";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center rounded-2xl" style={{ height: "calc(100vh - 300px)", minHeight: "500px", background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)" }}>
      <div className="text-white/50 animate-pulse font-medium">Connecting to the Grid...</div>
    </div>
  ),
});

const FlatMap = dynamic(() => import("@/components/map/FlatMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center rounded-2xl" style={{ height: "calc(100vh - 300px)", minHeight: "500px", background: "#0a0a2e" }}>
      <div className="text-white/50 animate-pulse font-medium">Loading Map...</div>
    </div>
  ),
});

export default function WorldGridPage() {
  const [view, setView] = useState<"globe" | "flat">("globe");
  const [points, setPoints] = useState<MapPoint[]>([]);

  useEffect(() => {
    fetch("/api/map-points")
      .then((res) => res.json())
      .then(setPoints)
      .catch(() => {});
  }, []);

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wider mb-3"
            style={{ fontFamily: "var(--font-space)" }}
          >
            World Grid Map
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Click on any point of light on the world grid maps below and the mini bio and direct message contact information for any local or worldwide light workers will pop up.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-full bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setView("globe")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                view === "globe"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <Globe2 className="w-4 h-4" />
              3D Globe
            </button>
            <button
              onClick={() => setView("flat")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                view === "flat"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <Map className="w-4 h-4" />
              Street Map
            </button>
          </div>
        </div>

        {view === "globe" ? <WorldMap /> : <FlatMap points={points} />}
      </div>
    </div>
  );
}
