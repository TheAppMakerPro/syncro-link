"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";
import type { MapPoint } from "@/types";

/**
 * Turn emails, phone numbers, and URLs in text into clickable links.
 */
function linkify(text: string) {
  const pattern =
    /(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})|(\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g;

  const parts: (string | { type: "email" | "phone" | "url"; value: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push({ type: "url", value: match[1] });
    } else if (match[2]) {
      parts.push({ type: "email", value: match[2] });
    } else if (match[3]) {
      parts.push({ type: "phone", value: match[3] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.map((part, i) => {
    if (typeof part === "string") return part;
    if (part.type === "email") {
      return (
        <a
          key={i}
          href={`mailto:${part.value}`}
          className="text-purple-400 underline hover:text-purple-300"
        >
          {part.value}
        </a>
      );
    }
    if (part.type === "phone") {
      const digits = part.value.replace(/\D/g, "");
      return (
        <a
          key={i}
          href={`sms:${digits}`}
          className="text-purple-400 underline hover:text-purple-300"
        >
          {part.value}
        </a>
      );
    }
    return (
      <a
        key={i}
        href={part.value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-400 underline hover:text-purple-300"
      >
        {part.value}
      </a>
    );
  });
}

const BIO_PREVIEW_LENGTH = 150;

function PointPanel({
  point,
  onClose,
}: {
  point: MapPoint;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const bioIsLong = point.bio.length > BIO_PREVIEW_LENGTH;
  const displayBio =
    expanded || !bioIsLong
      ? point.bio
      : point.bio.slice(0, BIO_PREVIEW_LENGTH) + "...";

  return (
    <div className="absolute inset-x-2 bottom-2 sm:inset-auto sm:top-4 sm:right-4 z-[1000] w-auto sm:w-96 max-h-[70vh] overflow-y-auto bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl text-white p-5 animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white/40 hover:text-white text-lg leading-none"
      >
        &times;
      </button>
      <div className="flex items-center gap-3 mb-3">
        {point.avatarUrl ? (
          <img
            src={point.avatarUrl}
            alt={point.displayName}
            className="w-16 h-16 rounded-full object-cover border border-white/20"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-lg">
            {point.displayName[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-bold text-sm">{point.displayName}</h3>
          <p className="text-xs text-white/50">
            {[point.city, point.country].filter(Boolean).join(", ")}
          </p>
          <a
            href="/chat"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
          >
            {point.displayName}@Syncro-Link
          </a>
        </div>
      </div>
      {point.bio && (
        <div className="text-sm leading-relaxed mb-2 text-white/80">
          <span className="whitespace-pre-wrap">{linkify(displayBio)}</span>
          {bioIsLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-purple-400 hover:text-purple-300 font-medium text-xs"
            >
              {expanded ? "show less" : "read more"}
            </button>
          )}
        </div>
      )}
      {point.contactInfo && (
        <div className="border-t border-white/10 pt-2 mt-2">
          <p className="text-xs font-semibold text-white/40 mb-0.5">Contact</p>
          <p className="text-xs text-white/80 whitespace-pre-wrap">
            {linkify(point.contactInfo)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function WorldMap() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    fetch("/api/map-points")
      .then((res) => res.json())
      .then((data) => {
        setPoints(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setDimensions({ width: el.clientWidth, height: el.clientHeight });
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Configure globe on mount
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Set initial point of view
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);

    // Configure controls
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
      controls.minDistance = 80;
      controls.maxDistance = 800;
    }
  }, [loading]);

  // Stop auto-rotate on interaction, resume after idle
  const handleInteraction = useCallback(() => {
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.autoRotate = false;
    }
    // Resume after 8 seconds of no interaction
    const timeout = setTimeout(() => {
      const c = globeRef.current?.controls();
      if (c) c.autoRotate = true;
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => handleInteraction();
    el.addEventListener("pointerdown", handler);
    el.addEventListener("wheel", handler);
    return () => {
      el.removeEventListener("pointerdown", handler);
      el.removeEventListener("wheel", handler);
    };
  }, [handleInteraction]);

  const pointColor = useCallback(
    (d: object) => (d as MapPoint).markerColor || "#e8e8ff",
    []
  );

  const pointAltitude = useCallback(() => 0.015, []);
  // Scale point radius inversely with count so the globe always sparkles
  const pointRadius = useCallback(
    () => {
      const count = points.length;
      if (count <= 10) return 0.45;
      if (count <= 50) return 0.35;
      if (count <= 200) return 0.28;
      if (count <= 1000) return 0.2;
      return 0.14;
    },
    [points.length]
  );
  const pointLat = useCallback((d: object) => (d as MapPoint).latitude, []);
  const pointLng = useCallback((d: object) => (d as MapPoint).longitude, []);

  const handlePointClick = useCallback((point: object) => {
    setSelectedPoint(point as MapPoint);
    const globe = globeRef.current;
    if (globe) {
      const p = point as MapPoint;
      globe.pointOfView({ lat: p.latitude, lng: p.longitude, altitude: 1.8 }, 800);
      const controls = globe.controls();
      if (controls) controls.autoRotate = false;
    }
  }, []);

  const flyToPoint = useCallback((point: MapPoint) => {
    setSelectedPoint(point);
    const globe = globeRef.current;
    if (globe) {
      globe.pointOfView({ lat: point.latitude, lng: point.longitude, altitude: 1.8 }, 800);
      const controls = globe.controls();
      if (controls) controls.autoRotate = false;
    }
    // Scroll the globe into view
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const filteredPoints = useMemo(() => {
    if (!searchQuery.trim()) return points;
    const q = searchQuery.toLowerCase();
    return points.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q)
    );
  }, [points, searchQuery]);

  const pointLabel = useCallback(
    (d: object) => {
      const p = d as MapPoint;
      const bio = p.bio ? (p.bio.length > 100 ? p.bio.slice(0, 100) + '...' : p.bio) : '';
      return `<div style="
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(12px);
        color: white;
        padding: 8px 14px;
        border-radius: 12px;
        font-size: 13px;
        border: 1px solid rgba(255,255,255,0.15);
        pointer-events: none;
        max-width: 280px;
      ">
        <b>${p.displayName}</b>
        <div style="color: rgba(255,255,255,0.5); font-size: 11px;">${[p.city, p.country].filter(Boolean).join(", ")}</div>
        ${bio ? `<div style="color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 4px; line-height: 1.4;">${bio}</div>` : ''}
      </div>`;
    },
    []
  );

  const globeImageUrl = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
  const bumpImageUrl = "https://unpkg.com/three-globe/example/img/earth-topology.png";

  return (
    <>
      {/* Globe */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(100,100,255,0.08)]"
        style={{ background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)", height: "calc(100vh - 300px)", minHeight: "500px" }}
      >
        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center">
            <div className="text-white/60 animate-pulse font-bold">
              Loading the Grid...
            </div>
          </div>
        )}

        {dimensions.width > 0 && (
          <Globe
            ref={globeRef as React.MutableRefObject<GlobeMethods | undefined>}
            width={dimensions.width}
            height={dimensions.height}
            globeImageUrl={globeImageUrl}
            bumpImageUrl={bumpImageUrl}
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#6366f1"
            atmosphereAltitude={0.25}
            pointsData={points}
            pointLat={pointLat}
            pointLng={pointLng}
            pointColor={pointColor}
            pointAltitude={pointAltitude}
            pointRadius={pointRadius}
            pointLabel={pointLabel}
            onPointClick={handlePointClick}
            animateIn={true}
          />
        )}

        {/* Point count overlay */}
        <div className="absolute top-4 left-4 z-[1000] bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/10">
          <span className="text-white font-bold">{points.length}</span>
          <span className="text-white/60 ml-1">
            {points.length === 1 ? "point of light" : "points of light"}
          </span>
        </div>

        {/* Selected point detail panel */}
        {selectedPoint && (
          <PointPanel
            point={selectedPoint}
            onClose={() => setSelectedPoint(null)}
          />
        )}
      </div>

      {/* Directory list */}
      {points.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4 gap-4">
            <h2 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-space)" }}>
              Directory
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or location..."
              className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25 w-full max-w-xs"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPoints.map((point) => (
              <button
                key={point.id}
                onClick={() => flyToPoint(point)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                  ${selectedPoint?.id === point.id
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/15"
                  }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_2px]"
                  style={{
                    backgroundColor: point.markerColor || "#e8e8ff",
                    boxShadow: `0 0 8px 2px ${point.markerColor || "#e8e8ff"}66`,
                  }}
                />
                {point.avatarUrl ? (
                  <img
                    src={point.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-xs shrink-0">
                    {point.displayName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{point.displayName}</p>
                  <p className="text-xs text-white/40 truncate">
                    {[point.city, point.country].filter(Boolean).join(", ")}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {searchQuery && filteredPoints.length === 0 && (
            <p className="text-center text-white/30 text-sm py-6">No matches found</p>
          )}
        </div>
      )}
    </>
  );
}
