"use client";

import { useRef, useCallback } from "react";

interface BentoPanelProps {
  number: string;
  label: string;
  href: string;
  panelColor: string;
  fgColor: string;
  className?: string;
  widget: React.ReactNode;
  onClick: (href: string, rect: DOMRect) => void;
}

export function BentoPanel({
  number,
  label,
  href,
  panelColor,
  fgColor,
  className = "",
  widget,
  onClick,
}: BentoPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      onClick(href, rect);
    }
  }, [href, onClick]);

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`relative overflow-hidden cursor-pointer border border-[var(--border)] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{ backgroundColor: panelColor }}
    >
      {/* Giant number */}
      <div
        className="absolute top-0 left-0 leading-none font-bauhaus select-none pointer-events-none"
        style={{
          fontSize: "clamp(34px, 6vw, 55px)",
          color: fgColor,
          opacity: 0.25,
          lineHeight: 0.8,
          padding: "8px 13px",
        }}
      >
        {number}
      </div>

      {/* Widget content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4" style={{ color: fgColor }}>
        {widget}
      </div>
    </div>
  );
}
