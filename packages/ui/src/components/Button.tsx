import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-primary text-[var(--on-bg)] border-2 border-[var(--border)] hover:bg-[var(--primary)]/80 font-bold",
  secondary:
    "bg-transparent text-[var(--on-surface)] border-2 border-[var(--border)] hover:bg-[var(--surface)] font-bold",
  ghost:
    "bg-transparent text-[var(--muted)] hover:text-[var(--on-surface)] font-semibold",
  danger:
    "bg-[var(--error)] text-white border-2 border-[var(--border)] font-bold",
};

const sizes = {
  sm: "px-s2 py-s1 text-xs tracking-wider",
  md: "px-s3 py-s2 text-sm tracking-wider",
  lg: "px-s5 py-s3 text-base tracking-wider",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center uppercase transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
