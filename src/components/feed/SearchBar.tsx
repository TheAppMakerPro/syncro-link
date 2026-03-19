"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search by username..." }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888aa]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d2b]/50 pl-11 pr-4 py-3 text-[#f0f0ff] placeholder-[#8888aa] outline-none transition-all duration-300 focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
      />
    </div>
  );
}
