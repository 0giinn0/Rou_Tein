"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, ListTodo, Cloud, Apple, Download } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard, href: "/" },
  { id: "tasks", label: "Tasks", icon: ListTodo, href: "/tasks" },
  { id: "weather", label: "Weather", icon: Cloud, href: "/weather" },
  { id: "nutrition", label: "Nutrition", icon: Apple, href: "/nutrition" },
  { id: "downloads", label: "Downloads", icon: Download, href: "/downloads" },
];

export function Sidebar({ currentPath, onNavigate }: { currentPath: string; onNavigate: (path: string) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-5 pointer-events-none">
      <nav className="flex items-center gap-1 glass-strong rounded-full px-2 py-2 pointer-events-auto shadow-2xl">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.href)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-cream text-ink shadow-lg"
                  : "text-muted hover:text-cream hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isActive && (
                <motion.span
                  layoutId="sidebar-label"
                  className="text-xs"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
