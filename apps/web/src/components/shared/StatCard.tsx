import type { LucideIcon } from "lucide-react";
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
}

export function StatCard({ title, value, icon: Icon, color = "cyan", subtitle, trend }: StatCardProps) {
  return (
    <div className={cn("panel bg-gradient-to-br p-5", colorMap[color])}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {Icon ? <Icon className="h-5 w-5 text-cyan-300" /> : null}
      </div>
      {typeof trend === "number" ? (
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">
          Trend {trend > 0 ? "+" : ""}
          {trend}%
        </p>
      ) : null}
    </div>
  );
}
