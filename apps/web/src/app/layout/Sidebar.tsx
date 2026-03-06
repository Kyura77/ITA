import { NavLink } from "react-router-dom";
import { Command, MonitorSmartphone, X, ChevronLeft, ChevronRight } from "lucide-react";
import { navItems } from "@/app/layout/nav";
import { cn } from "@/lib/cn";
import { isDesktopRuntime } from "@/lib/runtime";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const desktop = isDesktopRuntime();

  const content = (
    <>
      <div className="px-3 pt-4">
        <div className="panel-hero p-4">
          <div className="flex items-start justify-between gap-3">
            <div className={cn("transition-all duration-300", collapsed ? "hidden" : "block")}>
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">study cockpit</p>
              <h1 className="mt-3 font-display text-2xl text-slate-100">PROJETO ITA</h1>
              <p className="mt-2 text-sm text-slate-400">App local com IA real, sync com Anki e diagnostico de uso sem depender do navegador.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge badge-accent">{desktop ? "desktop app" : "localhost"}</span>
                <span className="badge inline-flex gap-2"><Command className="h-3.5 w-3.5" />Ctrl/Cmd+K</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-ghost hidden lg:inline-flex transition-transform duration-300 hover:scale-110"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expandir" : "Recolher"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3 pb-4">
        {navItems.map(({ to, label, summary, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-start gap-3 rounded-[22px] border px-3 py-3 transition-all duration-200",
                isActive
                  ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-400/10"
                  : "border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center",
              )
            }
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className={cn("min-w-0", collapsed && "hidden")}>
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-1 text-xs text-slate-400">{summary}</p>
            </div>
          </NavLink>
        ))}
      </nav>

      <div className={cn("space-y-3 px-3 pb-4 transition-all duration-300", collapsed && "hidden")}>
        <div className="glass-strip p-4 hover:bg-white/10 transition-colors duration-200">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">fluxo recomendado</p>
          <p className="mt-2 text-sm text-slate-200">Mapa de topicos, Diario de Erros, Feynman e Flashcards continuam sendo o nucleo do progresso real.</p>
        </div>
        <div className="glass-strip p-4 hover:bg-white/10 transition-colors duration-200">
          <div className="flex items-start gap-3">
            <MonitorSmartphone className="mt-0.5 h-4 w-4 text-cyan-300" />
            <div>
              <p className="text-sm font-semibold text-slate-100">Modo de uso</p>
              <p className="mt-1 text-sm text-slate-400">{desktop ? "Voce esta no app desktop." : "Se quiser 1 clique, use o launcher do app desktop."}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-white/5 bg-slate-950/65 backdrop-blur-2xl transition-all duration-300 lg:flex lg:flex-col",
          collapsed ? "w-[112px]" : "w-[320px]",
        )}
      >
        {content}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "block opacity-100" : "hidden opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileOpen(false)}
      >
        <aside
          className="h-full w-[88vw] max-w-[320px] border-r border-white/10 bg-slate-950/95 animate-slide-in-left"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 pt-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">study cockpit</p>
            <button type="button" className="btn-secondary" onClick={() => setMobileOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
          {content}
        </aside>
      </div>
    </>
  );
}
