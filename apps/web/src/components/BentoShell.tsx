"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BentoGrid } from "./BentoGrid";
import { ZoomTransition } from "./ZoomTransition";

interface BentoShellProps {
  children: React.ReactNode;
}

export function BentoShell({ children }: BentoShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [zoomSource, setZoomSource] = useState<DOMRect | null>(null);
  const [transitionHref, setTransitionHref] = useState<string | null>(null);
  const transitioning = useRef(false);

  const isBento = pathname === "/";

  const handlePanelClick = useCallback(
    (href: string, rect: DOMRect) => {
      if (transitioning.current) return;
      transitioning.current = true;
      setZoomSource(rect);
      setTransitionHref(href);
      setTimeout(() => {
        router.push(href);
        transitioning.current = false;
      }, 300);
    },
    [router]
  );

  const handleBack = useCallback(() => {
    transitioning.current = true;
    setZoomSource(null);
    setTransitionHref(null);
    router.push("/");
    setTimeout(() => {
      transitioning.current = false;
    }, 350);
  }, [router]);

  // Page label mapping
  const pageLabels: Record<string, string> = {
    "/tasks": "Tasks",
    "/weather": "Weather",
    "/nutrition": "Nutrition",
  };

  if (isBento) {
    return (
      <div className="h-screen w-screen overflow-hidden p-2 md:p-3" style={{ backgroundColor: "var(--bg)" }}>
        <div className="h-full w-full max-w-[1400px] mx-auto">
          <BentoGrid onNavigate={handlePanelClick} />
        </div>
      </div>
    );
  }

  // Zoomed view
  return (
    <ZoomTransition sourceRect={zoomSource} onBack={handleBack} label={pageLabels[pathname] || ""}>
      {children}
    </ZoomTransition>
  );
}
