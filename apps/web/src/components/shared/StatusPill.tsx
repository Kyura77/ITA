import { cn } from "@/lib/cn";

export type StatusTone = "slate" | "cyan" | "emerald" | "amber" | "rose";

const toneMap: Record<StatusTone, string> = {
  slate: "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
  cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15",
  emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15",
  rose: "border-rose-400/20 bg-rose-400/10 text-rose-200 hover:bg-rose-400/15",
};

const dotMap: Record<StatusTone, string> = {
  slate: "bg-slate-300",
  cyan: "bg-cyan-300",
  emerald: "bg-emerald-300",
  amber: "bg-amber-300",
  rose: "bg-rose-300",
};

interface StatusPillProps {
  label: string;
  value: string;
  tone?: StatusTone;
  detail?: string;
  compact?: boolean;
  animated?: boolean;
}

export function StatusPill({
  label,
  value,
  tone = "slate",
  detail,
  compact = false,
  animated = false,
}: StatusPillProps) {
  return (
    <div
      title={detail}
      className={cn(
        "rounded-[20px] border px-4 py-3 shadow-sm transition-all duration-200",
        toneMap[tone],
        compact && "px-3 py-2",
        animated && "hover:shadow-md hover:scale-105",
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn("status-dot", dotMap[tone], animated && "animate-pulse")} />
        <div className="min-w-0">
          <p className="truncate text-[10px] uppercase tracking-[0.22em] opacity-70">{label}</p>
          <p className="truncate text-sm font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
