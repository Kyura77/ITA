import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

const variantMap = {
  default: "border-white/10 bg-white/5 text-slate-300",
  accent: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  error: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  info: "border-blue-400/30 bg-blue-400/10 text-blue-200",
};

const sizeMap = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export function Badge({ children, variant = "default", size = "md", icon }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold transition-colors duration-200",
        variantMap[variant],
        sizeMap[size],
      )}
    >
      {icon}
      {children}
    </span>
  );
}
