import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/cn";

const colorMap = {
  blue: "from-sky-500/20 to-slate-900 border-sky-500/20 text-sky-200",
  green: "from-emerald-500/20 to-slate-900 border-emerald-500/20 text-emerald-200",
  red: "from-rose-500/20 to-slate-900 border-rose-500/20 text-rose-200",
  purple: "from-fuchsia-500/20 to-slate-900 border-fuchsia-500/20 text-fuchsia-200",
  amber: "from-amber-500/20 to-slate-900 border-amber-500/20 text-amber-200",
  cyan: "from-cyan-500/20 to-slate-900 border-cyan-500/20 text-cyan-200",
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: keyof typeof colorMap;
  subtitle?: string;
  trend?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "cyan",
  subtitle,
  trend,
  interactive = false,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "panel bg-gradient-to-br p-6 transition-all duration-300",
        colorMap[color],
        interactive && "cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-95",
      )}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-lg bg-white/10 p-3">
            <Icon className="h-5 w-5 text-cyan-300" />
          </div>
        ) : null}
      </div>
      {typeof trend === "number" ? (
        <div className="mt-4 flex items-center gap-1">
          {trend > 0 ? (
            <ArrowUp className="h-3 w-3 text-emerald-400" />
          ) : trend < 0 ? (
            <ArrowDown className="h-3 w-3 text-rose-400" />
          ) : null}
          <p className={cn("text-xs uppercase tracking-[0.16em]", trend > 0 ? "text-emerald-400" : trend < 0 ? "text-rose-400" : "text-slate-400")}>
            {trend > 0 ? "+" : ""}
            {trend}%
          </p>
        </div>
      ) : null}
    </div>
  );
}
