import { Outlet } from "react-router-dom";
import { useMemo, useState } from "react";
import { Sidebar } from "@/app/layout/Sidebar";
import { Header } from "@/app/layout/Header";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { cn } from "@/lib/cn";
import { isDesktopRuntime } from "@/lib/runtime";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const desktop = useMemo(() => isDesktopRuntime(), []);

  return (
    <div className="min-h-screen text-slate-100">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      <div className={cn("transition-[padding-left] duration-300", collapsed ? "lg:pl-[112px]" : "lg:pl-[320px]")}>
        <Header
          collapsed={collapsed}
          isDesktop={desktop}
          onToggleCollapsed={() => setCollapsed((current) => !current)}
          onToggleMobile={() => setMobileOpen((current) => !current)}
          onOpenCommandPalette={() => setCommandOpen(true)}
        />

        <main className="px-4 pb-12 pt-28 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1520px] animate-fade-up">
            {desktop ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-cyan-400/15 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100 shadow-[0_18px_40px_rgba(8,145,178,0.12)]">
                <span>Modo desktop ativo. A API sobe por tras do app e os atalhos locais ficam disponiveis.</span>
                <span className="badge border-transparent bg-slate-950/40 text-cyan-100">Ctrl/Cmd+K</span>
              </div>
            ) : null}

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}