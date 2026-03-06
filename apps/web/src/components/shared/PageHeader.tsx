import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, icon: Icon, actions }: PageHeaderProps) {
  return (
    <section className="panel-hero px-6 py-6 sm:px-8 sm:py-7">
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="badge badge-accent">
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            comando atual
          </div>
          <h1 className="mt-4 font-display text-4xl text-slate-100 sm:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2 xl:justify-end">{actions}</div> : null}
      </div>
    </section>
  );
}
