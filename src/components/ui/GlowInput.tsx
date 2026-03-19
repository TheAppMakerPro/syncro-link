"use client";

interface GlowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function GlowInput({ label, className = "", ...props }: GlowInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#f0f0ff]/80">{label}</label>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border border-white/10 bg-[#0d0d2b]/50 px-4 py-3 text-[#f0f0ff] placeholder-[#8888aa] outline-none transition-all duration-300 focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(255,215,0,0.15)] ${className}`}
      />
    </div>
  );
}

export function GlowTextarea({
  label,
  className = "",
  ...props
}: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#f0f0ff]/80">{label}</label>
      )}
      <textarea
        {...props}
        className={`w-full rounded-xl border border-white/10 bg-[#0d0d2b]/50 px-4 py-3 text-[#f0f0ff] placeholder-[#8888aa] outline-none transition-all duration-300 focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(255,215,0,0.15)] min-h-[120px] resize-y ${className}`}
      />
    </div>
  );
}
