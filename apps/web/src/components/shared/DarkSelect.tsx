import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface DarkSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const DarkSelect = forwardRef<HTMLSelectElement, DarkSelectProps>(
  ({ label, error, helperText, className, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
        <select
          ref={ref}
          className={cn(
            "rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100",
            "focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20",
            "hover:border-slate-600 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-400/20",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-xs text-red-400">{error}</span>}
        {helperText && !error && <span className="text-xs text-slate-400">{helperText}</span>}
      </div>
    );
  },
);

DarkSelect.displayName = "DarkSelect";
