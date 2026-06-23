"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState("/");

  return (
    <div className="min-h-screen bg-ink pb-24">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {children}
      </div>
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath} />
    </div>
  );
}
