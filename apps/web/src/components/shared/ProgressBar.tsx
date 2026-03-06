import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: "cyan" | "emerald" | "amber" | "rose" | "purple";
  showPercentage?: boolean;
  animated?: boolean;
}

const colorMap = {
  cyan: "bg-gradient-to-r from-cyan-500 to-cyan-400",
  emerald: "bg-gradient-to-r from-emerald-500 to-emerald-400",
  amber: "bg-gradient-to-r from-amber-500 to-amber-400",
  rose: "bg-gradient-to-r from-rose-500 to-rose-400",
  purple: "bg-gradient-to-r from-purple-500 to-purple-400",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  color = "cyan",
  showPercentage = true,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
          {showPercentage && <span className="text-xs text-slate-400">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            colorMap[color],
            animated && "shadow-lg shadow-current/50",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
