import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  actions?: ReactNode;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  actions,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full mx-4 rounded-[24px] border border-white/10 bg-slate-900 shadow-xl animate-fade-up",
          sizeMap[size],
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-display text-xl text-slate-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
        {actions && (
          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
