"use client";

interface GlowSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function GlowSelect({ label, options, placeholder, className = "", ...props }: GlowSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#f0f0ff]/80">{label}</label>
      )}
      <select
        {...props}
        className={`w-full rounded-xl border border-white/10 bg-[#0d0d2b]/50 px-4 py-3 text-[#f0f0ff] outline-none transition-all duration-300 focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(255,215,0,0.15)] ${className}`}
      >
        {placeholder && (
          <option value="" className="bg-[#0d0d2b]">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0d0d2b]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
