import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </label>
      )}
      <select
        className={`px-3 py-2.5 border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--on-surface)] text-sm focus:outline-none focus:border-primary transition-colors appearance-none ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
