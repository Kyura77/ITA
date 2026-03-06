import type { ReactNode } from "react";
interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-300">
        vazio
      </div>
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="max-w-lg text-sm text-slate-400">{description}</p>
      {action}
    </div>
  );
}

