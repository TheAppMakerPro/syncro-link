"use client";

export default function StarDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8a6d00]/30" />
      <div className="relative h-3 w-3 rotate-45 bg-[#8a6d00]/50 shadow-[0_0_10px_rgba(138,109,0,0.3)]" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8a6d00]/30" />
    </div>
  );
}
