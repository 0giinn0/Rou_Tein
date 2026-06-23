"use client";

import { useEffect, useRef, useState } from "react";

interface ZoomTransitionProps {
  sourceRect: DOMRect | null;
  children: React.ReactNode;
  onBack: () => void;
  label: string;
}

export function ZoomTransition({ sourceRect, children, onBack, label }: ZoomTransitionProps) {
  const [phase, setPhase] = useState<"entering" | "entered" | "exiting">("entering");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === "entering") {
      const timer = setTimeout(() => setPhase("entered"), 400);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleBack = () => {
    setPhase("exiting");
    setTimeout(() => onBack(), 350);
  };

  // Initial zoom from source rect
  const isEntering = phase === "entering";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "var(--bg)" }}>
      {/* Back button */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--on-surface)] transition-colors"
        >
          <span className="text-sm leading-none">←</span>
          Back
        </button>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--subtle)] ml-auto">
          {label}
        </span>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{
          animation: isEntering ? "fade-in 300ms ease-out 150ms forwards" : "none",
          opacity: isEntering ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
