"use client";

export default function StarDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/30" />
      <div className="relative h-3 w-3 rotate-45 bg-amber-500/60 shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/30" />
    </div>
  );
}
