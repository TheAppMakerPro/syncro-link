"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import type { MapPoint } from "@/types";

function createGlowIcon() {
  return L.divIcon({
    className: "light-marker",
    html: `<div class="light-marker-inner"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function WorldMap() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/map-points")
      .then((res) => res.json())
      .then((data) => {
        setPoints(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(255,215,0,0.05)]">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-[#0a0a1a]/80">
          <div className="text-amber-400 animate-pulse">Loading the Grid...</div>
        </div>
      )}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: "#0a0a1a" }}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={createGlowIcon()}
          >
            <Popup className="dark-popup" maxWidth={320}>
              <div className="p-1">
                <div className="flex items-center gap-3 mb-3">
                  {point.avatarUrl ? (
                    <img
                      src={point.avatarUrl}
                      alt={point.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-[#8a6d00]/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#8a6d00]/15 flex items-center justify-center text-black text-lg font-bold">
                      {point.displayName[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-black text-base">
                      {point.displayName}
                    </h3>
                    <p className="text-black text-xs">
                      {[point.city, point.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                {point.bio && (
                  <p className="text-black/70 text-sm leading-relaxed mb-2">
                    {point.bio}
                  </p>
                )}
                {point.contactInfo && (
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <p className="text-xs text-black/80">Contact:</p>
                    <p className="text-xs text-black/60 whitespace-pre-wrap">
                      {point.contactInfo}
                    </p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Point count overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
        <span className="text-amber-400 font-semibold">{points.length}</span>
        <span className="text-white/80 ml-1">
          {points.length === 1 ? "point of light" : "points of light"}
        </span>
      </div>
    </div>
  );
}
