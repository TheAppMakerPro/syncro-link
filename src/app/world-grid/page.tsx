"use client";

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a1a] rounded-2xl">
      <div className="text-amber-400 animate-pulse">Connecting to the Grid...</div>
    </div>
  ),
});

export default function WorldGridPage() {
  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wider mb-3 text-[#1a1200]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            World Grid Map
          </h1>
          <p className="text-[#4a3d00] max-w-xl mx-auto">
            This is the Syncro-Link index world grid map. Click on any point of
            light to view their mini bio and contact info. Go ahead and click on
            your own light and see how you shine.
          </p>
        </div>
        <div className="h-[calc(100vh-300px)] min-h-[500px]">
          <WorldMap />
        </div>
      </div>
    </div>
  );
}
