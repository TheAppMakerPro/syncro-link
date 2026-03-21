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

/**
 * Turn emails, phone numbers, and URLs in text into clickable links.
 */
function linkify(text: string) {
  // Match emails, phone numbers (various formats), and URLs
  const pattern = /(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})|(\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g;

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
        <a key={i} href={`mailto:${part.value}`} className="text-purple-600 underline hover:text-purple-800">
          {part.value}
        </a>
      );
    }
    if (part.type === "phone") {
      const digits = part.value.replace(/\D/g, "");
      return (
        <a key={i} href={`sms:${digits}`} className="text-purple-600 underline hover:text-purple-800">
          {part.value}
        </a>
      );
    }
    // url
    return (
      <a key={i} href={part.value} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline hover:text-purple-800">
        {part.value}
      </a>
    );
  });
}

const BIO_PREVIEW_LENGTH = 150;

function PointPopup({ point }: { point: MapPoint }) {
  const [expanded, setExpanded] = useState(false);
  const bioIsLong = point.bio.length > BIO_PREVIEW_LENGTH;
  const displayBio = expanded || !bioIsLong
    ? point.bio
    : point.bio.slice(0, BIO_PREVIEW_LENGTH) + "...";

  return (
    <div className="p-1">
      <div className="flex items-center gap-3 mb-3">
        {point.avatarUrl ? (
          <img
            src={point.avatarUrl}
            alt={point.displayName}
            className="w-11 h-11 rounded-full object-cover border border-black/10"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
            {point.displayName[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-bold text-sm">{point.displayName}</h3>
          <p className="text-xs text-black/50">
            {[point.city, point.country].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>
      {point.bio && (
        <div className="text-sm leading-relaxed mb-2">
          <span className="whitespace-pre-wrap">{linkify(displayBio)}</span>
          {bioIsLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-purple-600 hover:text-purple-800 font-medium text-xs"
            >
              {expanded ? "show less" : "read more"}
            </button>
          )}
        </div>
      )}
      {point.contactInfo && (
        <div className="border-t border-black/8 pt-2 mt-2">
          <p className="text-xs font-semibold text-black/50 mb-0.5">Contact</p>
          <p className="text-xs whitespace-pre-wrap">
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
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-gray-100">
          <div className="text-black animate-pulse font-bold">Loading the Grid...</div>
        </div>
      )}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: "#e8e8e8" }}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={createGlowIcon()}
          >
            <Popup className="dark-popup" maxWidth={320}>
              <PointPopup point={point} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Point count overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm shadow">
        <span className="text-black font-bold">{points.length}</span>
        <span className="text-black/70 ml-1">
          {points.length === 1 ? "point of light" : "points of light"}
        </span>
      </div>
    </div>
  );
}
