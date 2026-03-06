import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  gradient?: "cyan" | "emerald" | "amber" | "rose" | "purple" | "none";
}

const gradientMap = {
  cyan: "from-cyan-500/10 to-slate-900 border-cyan-500/20",
  emerald: "from-emerald-500/10 to-slate-900 border-emerald-500/20",
  amber: "from-amber-500/10 to-slate-900 border-amber-500/20",
  rose: "from-rose-500/10 to-slate-900 border-rose-500/20",
  purple: "from-purple-500/10 to-slate-900 border-purple-500/20",
  none: "border-white/10",
};

export function AnimatedCard({
  children,
  className,
  onClick,
  interactive = false,
  gradient = "none",
}: AnimatedCardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-6 backdrop-blur-xl transition-all duration-300",
        gradientMap[gradient],
        interactive && "cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-95",
        className,
      )}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
}
