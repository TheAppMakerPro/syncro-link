"use client";

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a1a]">
      <div className="text-amber-400 animate-pulse">Connecting to the Grid...</div>
    </div>
  ),
});

export default function WorldGridPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-wider mb-3"
          style={{
            fontFamily: "var(--font-space)",
            textShadow: "0 0 30px rgba(255,215,0,0.3)",
          }}
        >
          World Grid Map
        </h1>
        <p className="text-[#f0f0ff]/60 max-w-xl mx-auto">
          This is the Syncro-Link index world grid map. Click on any point of
          light to view their mini bio and contact info. This is your contact
          platform. Go ahead and click on your own light and see how you shine.
        </p>
      </div>
      <div className="h-[calc(100vh-220px)] min-h-[500px] max-w-7xl mx-auto">
        <WorldMap />
      </div>
    </div>
  );
}
