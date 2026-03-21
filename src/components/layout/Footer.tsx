"use client";

import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-12 border-t border-white/10">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <span className="text-lg font-bold tracking-[0.15em] text-white">
              SYNCRO-LINK
            </span>
          </div>
          <p className="text-white/70 text-sm max-w-md">
            Unite and Enlight. No capitalism. No bad actors. No doom and gloom.
          </p>
          <div className="flex gap-6 text-xs text-white/60">
            <span>A network, not a business</span>
            <span>·</span>
            <span>Est. 1996 in spirit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
