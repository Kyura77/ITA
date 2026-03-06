import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Database, Moon, RefreshCw, Search, Sparkles, SunMedium } from "lucide-react";
import { toast } from "sonner";
import { navItems } from "@/app/layout/nav";
import { useSeed } from "@/hooks/useSeed";
import { useTheme } from "@/hooks/useTheme";
import { api, ApiError } from "@/services/apiClient";
import type { AnkiSyncResult, AppSettings } from "@/types/entities";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  summary: string;
  keywords: string;
  icon: LucideIcon;
  shortcut?: string;
  run: () => Promise<void> | void;
}

function getKeyboardHint() {
  return navigator.platform.toLowerCase().includes("mac") ? "Cmd+K" : "Ctrl+K";
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const { runSeed, seeding } = useSeed();
  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get<AppSettings>("/settings"),
    staleTime: 15_000,
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
        return;
      }

      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const commands = useMemo<CommandItem[]>(() => {
    const routeCommands = navItems.map((item) => ({
      id: `route-${item.to}`,
      label: item.label,
      summary: item.summary,
      keywords: `${item.label} ${item.summary} navegar tela`,
      icon: item.icon,
      run: () => navigate(item.to),
    }));

    const extraCommands: CommandItem[] = [
      {
        id: "anki-sync",
        label: "Sincronizar Anki agora",
        summary: "Envia os cards pendentes pelo backend e atualiza o status local.",
        keywords: "anki sync flashcards revisar",
        icon: Sparkles,
        run: async () => {
          const result = await api.post<AnkiSyncResult>("/flashcards/sync-anki", {});
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["flashcards"] }),
            queryClient.invalidateQueries({ queryKey: ["integrations-status"] }),
          ]);
          toast.success(`Sync concluido: ${result.syncedCount} card(s).`);
        },
      },
      {
        id: "refresh-integrations",
        label: "Revalidar integracoes",
        summary: "Atualiza os checks reais de Ollama e Anki sem trocar de tela.",
        keywords: "refresh revalidar integracoes ollama anki",
        icon: RefreshCw,
        run: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["integrations-status"] }),
            queryClient.invalidateQueries({ queryKey: ["settings"] }),
          ]);
          toast.success("Integracoes revalidadas.");
        },
      },
      {
        id: "toggle-theme",
        label: theme === "dark" ? "Trocar para tema claro" : "Trocar para tema escuro",
        summary: "Alterna o tema visual sem sair da tela atual.",
        keywords: "tema claro escuro aparencia",
        icon: theme === "dark" ? SunMedium : Moon,
        run: () => {
          toggleTheme();
          toast.success(theme === "dark" ? "Tema claro ativado." : "Tema escuro ativado.");
        },
      },
    ];

    if (!settingsQuery.data?.seeded) {
      extraCommands.unshift({
        id: "seed",
        label: seeding ? "Rodando seed inicial" : "Rodar seed inicial",
        summary: "Preenche livros e topicos base para ligar o app de uma vez.",
        keywords: "seed inicial livros topicos base",
        icon: Database,
        run: async () => {
          await runSeed();
          toast.success("Seed inicial concluido.");
        },
      });
    }

    return [...extraCommands, ...routeCommands];
  }, [navigate, queryClient, runSeed, seeding, settingsQuery.data?.seeded, theme, toggleTheme]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCommands = commands
    .filter((item) => {
      if (!normalizedQuery) return true;
      const haystack = `${item.label} ${item.summary} ${item.keywords}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, 10);

  const firstResult = filteredCommands[0];

  async function handleRun(command: CommandItem) {
    try {
      await command.run();
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : error instanceof Error ? error.message : "Falha ao executar o comando.";
      toast.error(message);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-slate-950/75 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <div className="mx-auto mt-[10vh] w-[min(780px,calc(100vw-2rem))]" onClick={(event) => event.stopPropagation()}>
        <section className="panel-hero overflow-hidden">
          <form
            className="border-b border-white/5 px-5 py-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (firstResult) {
                void handleRun(firstResult);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-cyan-300" />
              <input
                autoFocus
                className="w-full bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-500"
                placeholder="Ir para uma tela, sincronizar Anki ou revalidar integracoes"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <span className="badge">Esc</span>
            </div>
          </form>

          <div className="max-h-[440px] space-y-2 overflow-auto p-3">
            {filteredCommands.length ? (
              filteredCommands.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="glass-strip flex w-full items-start gap-4 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/20"
                    onClick={() => void handleRun(item)}
                  >
                    <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-100">{item.label}</span>
                      <span className="mt-1 block text-sm text-slate-400">{item.summary}</span>
                    </span>
                    {item.shortcut ? <span className="badge">{item.shortcut}</span> : null}
                  </button>
                );
              })
            ) : (
              <div className="glass-strip p-5 text-sm text-slate-300">
                Nenhum comando bateu com esse texto. Tente tela, integracao, seed ou Anki.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/5 px-5 py-3 text-xs text-slate-400">
            <span>{getKeyboardHint()} abre esta paleta de qualquer tela.</span>
            <span>{theme === "dark" ? "tema escuro" : "tema claro"}</span>
          </div>
        </section>
      </div>
    </div>
  );
}