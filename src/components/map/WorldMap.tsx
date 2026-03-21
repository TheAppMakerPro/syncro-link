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
    <div className="absolute top-4 right-4 z-[1000] w-80 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl text-white p-5 animate-fade-in">
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
            className="w-12 h-12 rounded-full object-cover border border-white/20"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-lg">
            {point.displayName[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-bold text-sm">{point.displayName}</h3>
          <p className="text-xs text-white/50">
            {[point.city, point.country].filter(Boolean).join(", ")}
          </p>
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
      controls.minDistance = 150;
      controls.maxDistance = 600;
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
    (d: object) => (d as MapPoint).markerColor || "#ff4500",
    []
  );

  const pointAltitude = useCallback(() => 0.01, []);
  const pointRadius = useCallback(() => 0.35, []);
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

  const pointLabel = useCallback(
    (d: object) => {
      const p = d as MapPoint;
      return `<div style="
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(12px);
        color: white;
        padding: 6px 12px;
        border-radius: 10px;
        font-size: 13px;
        border: 1px solid rgba(255,255,255,0.1);
        pointer-events: none;
      ">
        <b>${p.displayName}</b>
        <div style="color: rgba(255,255,255,0.5); font-size: 11px;">${[p.city, p.country].filter(Boolean).join(", ")}</div>
      </div>`;
    },
    []
  );

  const globeImageUrl = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
  const bumpImageUrl = "https://unpkg.com/three-globe/example/img/earth-topology.png";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(100,100,255,0.08)]"
      style={{ background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)" }}
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
  );
}
