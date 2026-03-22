"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPoint } from "@/types";

const BIO_PREVIEW_LENGTH = 150;

function linkifyText(text: string): string {
  return text.replace(
    /(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})|(\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g,
    (match, url, email, phone) => {
      if (url) return `<a href="${url}" target="_blank" rel="noopener" style="color:#a78bfa;text-decoration:underline">${url}</a>`;
      if (email) return `<a href="mailto:${email}" style="color:#a78bfa;text-decoration:underline">${email}</a>`;
      if (phone) return `<a href="sms:${phone.replace(/\D/g, "")}" style="color:#a78bfa;text-decoration:underline">${phone}</a>`;
      return match;
    }
  );
}

export default function FlatMap({ points }: { points: MapPoint[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-white/10"
      style={{ height: "calc(100vh - 300px)", minHeight: "500px" }}
    >
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={19}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: "#e8e8e8" }}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {points.map((point) => {
          const color = point.markerColor || "#e8e8ff";
          const bioPreview = point.bio.length > BIO_PREVIEW_LENGTH
            ? point.bio.slice(0, BIO_PREVIEW_LENGTH) + "..."
            : point.bio;

          return (
            <CircleMarker
              key={point.id}
              center={[point.latitude, point.longitude]}
              radius={8}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.9,
                color: color,
                weight: 2,
                opacity: 0.6,
              }}
            >
              <Popup maxWidth={300}>
                <div style={{ color: "#1a1a2e", fontFamily: "Inter, system-ui, sans-serif" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    {point.avatarUrl ? (
                      <img
                        src={point.avatarUrl}
                        alt={point.displayName}
                        style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }}
                      />
                    ) : (
                      <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: "#e8e0f0", display: "flex", alignItems: "center",
                        justifyContent: "center", fontWeight: 700, color: "#6b21a8", fontSize: 18
                      }}>
                        {point.displayName[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{point.displayName}</div>
                      <div style={{ fontSize: 11, color: "#666" }}>
                        {[point.city, point.country].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </div>
                  {point.bio && (
                    <div
                      style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}
                      dangerouslySetInnerHTML={{ __html: linkifyText(bioPreview) }}
                    />
                  )}
                  {point.contactInfo && (
                    <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: 6, marginTop: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#999", marginBottom: 2 }}>Contact</div>
                      <div
                        style={{ fontSize: 12, whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{ __html: linkifyText(point.contactInfo) }}
                      />
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Point count overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/10">
        <span className="text-white font-bold">{points.length}</span>
        <span className="text-white/60 ml-1">
          {points.length === 1 ? "point of light" : "points of light"}
        </span>
      </div>
    </div>
  );
}
