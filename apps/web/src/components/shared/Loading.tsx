import { cn } from "@/lib/cn";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "emerald" | "amber" | "rose";
  text?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const colorMap = {
  cyan: "border-cyan-500 border-t-cyan-300",
  emerald: "border-emerald-500 border-t-emerald-300",
  amber: "border-amber-500 border-t-amber-300",
  rose: "border-rose-500 border-t-rose-300",
};

export function Loading({
  size = "md",
  color = "cyan",
  text,
}: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={cn(
          "rounded-full border-4 border-transparent animate-spin",
          sizeMap[size],
          colorMap[color],
        )}
      />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
}
