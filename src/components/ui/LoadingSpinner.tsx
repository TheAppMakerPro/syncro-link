"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative h-12 w-12">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#8a6d00]"
            style={{
              transform: `rotate(${i * 45}deg) translateY(16px)`,
              opacity: 1 - i * 0.1,
              animation: `spin-fade 1s ${i * 0.125}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
