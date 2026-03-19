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
        <label className="block text-sm font-medium text-[#4a3d00]">{label}</label>
      )}
      <select
        {...props}
        className={`w-full gold-input px-4 py-3 ${className}`}
      >
        {placeholder && (
          <option value="" className="bg-[#fff8dc]">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#fff8dc]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
