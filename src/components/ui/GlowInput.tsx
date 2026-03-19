"use client";

interface GlowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function GlowInput({ label, className = "", ...props }: GlowInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold">{label}</label>
      )}
      <input
        {...props}
        className={`w-full gold-input px-4 py-3 ${className}`}
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
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold">{label}</label>
      )}
      <textarea
        {...props}
        className={`w-full gold-input px-4 py-3 min-h-[120px] resize-y ${className}`}
      />
    </div>
  );
}
