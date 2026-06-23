import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2.5 border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--on-surface)] text-sm placeholder:text-[var(--subtle)] focus:outline-none focus:border-primary transition-colors ${
          error ? "border-[var(--error)]" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-medium text-[var(--error)]">{error}</span>
      )}
    </div>
  );
}
