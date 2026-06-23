import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-[var(--surface)] border border-[var(--border)] w-full max-w-lg mx-4 p-6 shadow-2xl rounded-3xl ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bauhaus tracking-tight text-[var(--on-surface)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-[var(--on-surface)] hover:border-primary transition-colors text-sm font-bold"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
