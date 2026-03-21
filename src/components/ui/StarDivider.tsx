"use client";

export default function StarDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-6 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
      <div className="relative h-2.5 w-2.5 rotate-45 bg-white/30 rounded-[1px]" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
    </div>
  );
}
