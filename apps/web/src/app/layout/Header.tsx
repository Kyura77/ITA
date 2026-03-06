import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Moon, PanelLeftClose, PanelLeftOpen, Search, Settings2, SunMedium } from "lucide-react";
import { getActiveNavItem } from "@/app/layout/nav";
import { StatusPill } from "@/components/shared/StatusPill";
import { useTheme } from "@/hooks/useTheme";
import { getIntegrationTone, getIntegrationValue } from "@/lib/integrations";
import { cn } from "@/lib/cn";
import { api } from "@/services/apiClient";
import type { IntegrationStatus } from "@/types/entities";

interface HeaderProps {
  collapsed: boolean;
  isDesktop: boolean;
  onToggleCollapsed: () => void;
  onToggleMobile: () => void;
  onOpenCommandPalette: () => void;
}

function getKeyboardHint() {
  return navigator.platform.toLowerCase().includes("mac") ? "Cmd+K" : "Ctrl+K";
}

export function Header({ collapsed, isDesktop, onToggleCollapsed, onToggleMobile, onOpenCommandPalette }: HeaderProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const currentItem = getActiveNavItem(location.pathname);
  const keyboardHint = useMemo(() => getKeyboardHint(), []);
  const integrationQuery = useQuery({
    queryKey: ["integrations-status"],
    queryFn: () => api.get<IntegrationStatus>("/integrations/status"),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
  const formattedDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  return (
    <header className={cn("fixed right-0 top-0 z-30 border-b border-white/5 bg-slate-950/55 backdrop-blur-2xl", collapsed ? "lg:left-[112px]" : "lg:left-[320px]")}>
      <div className="flex min-h-[94px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button type="button" className="btn-secondary hidden lg:inline-flex" onClick={onToggleCollapsed}>
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <button type="button" className="btn-secondary lg:hidden" onClick={onToggleMobile}>
              <PanelLeftOpen className="h-4 w-4" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{isDesktop ? "app local" : "browser local"}</p>
                <span className="badge border-transparent bg-white/5 text-slate-300">{isDesktop ? "desktop ready" : "localhost"}</span>
              </div>
              <h1 className="mt-1 font-display text-3xl text-slate-100">{currentItem.label}</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">{currentItem.summary} · {formattedDate}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={onOpenCommandPalette}>
              <Search className="h-4 w-4" />
              {keyboardHint}
            </button>
            <Link to="/settings" className="btn-secondary hidden md:inline-flex">
              <Settings2 className="h-4 w-4" />
              Ajustes
            </Link>
            <button type="button" className="btn-secondary" onClick={toggleTheme}>
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Claro" : "Escuro"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {integrationQuery.data ? (
            <>
              <StatusPill label="IA" value={getIntegrationValue("Ollama", integrationQuery.data.ai)} tone={getIntegrationTone(integrationQuery.data.ai)} detail={integrationQuery.data.ai.detail} compact />
              <StatusPill label="Anki" value={getIntegrationValue("Anki", integrationQuery.data.anki)} tone={getIntegrationTone(integrationQuery.data.anki)} detail={integrationQuery.data.anki.detail} compact />
              <StatusPill label="Modo" value={isDesktop ? "app nativo" : "web local"} tone="slate" compact />
            </>
          ) : integrationQuery.isError ? (
            <StatusPill label="API" value="diagnostico indisponivel" tone="rose" detail="A rota de status das integracoes nao respondeu." compact />
          ) : (
            <StatusPill label="Sistema" value="checando integracoes" tone="slate" compact />
          )}
        </div>
      </div>
    </header>
  );
}