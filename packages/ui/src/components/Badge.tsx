import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "error";
  className?: string;
}

const colors = {
  default: "bg-[var(--surface-variant)] text-[var(--on-surface)] border border-[var(--border)]",
  primary: "bg-primary text-[var(--on-bg)] border border-primary",
  success: "bg-[var(--green)]/20 text-[var(--green)] border border-[var(--green)]/40",
  error: "bg-[var(--error)]/20 text-[var(--error)] border border-[var(--error)]/40",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
