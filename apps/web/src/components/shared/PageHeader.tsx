import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  variant?: "default" | "compact";
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  variant = "default",
}: PageHeaderProps) {
  const isCompact = variant === "compact";

  return (
    <section className={cn("panel-hero px-6 py-6 sm:px-8 sm:py-7", isCompact && "py-4 sm:py-5")}>
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5">
            {Icon ? <Icon className="h-3.5 w-3.5 text-cyan-300" /> : null}
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">comando atual</span>
          </div>
          <h1
            className={cn(
              "mt-4 font-display text-slate-100 sm:text-5xl",
              isCompact ? "text-3xl sm:text-4xl" : "text-4xl",
            )}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className={cn("mt-3 leading-7 text-slate-400 sm:text-base", isCompact ? "text-xs sm:text-sm" : "text-sm")}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-2 xl:justify-end">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
