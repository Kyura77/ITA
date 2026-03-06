import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers3 } from "lucide-react";
import { toast } from "sonner";
import { FlashcardFormDialog } from "@/components/flashcards/FlashcardFormDialog";
import { FlashcardItem } from "@/components/flashcards/FlashcardItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { StatusPill } from "@/components/shared/StatusPill";
import { normalizeNullableFields } from "@/lib/forms";
import { formatIntegrationLatency, getIntegrationProviderLabel, getIntegrationTone, getIntegrationValue } from "@/lib/integrations";
import { api, ApiError } from "@/services/apiClient";
import type { AnkiSyncResult, Flashcard, IntegrationStatus } from "@/types/entities";

export default function FlashcardsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ synced: "", ankiDeck: "", q: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Flashcard | null>(null);
  const [syncPreview, setSyncPreview] = useState<AnkiSyncResult | null>(null);
  const [syncReport, setSyncReport] = useState<AnkiSyncResult | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const flashcardsQuery = useQuery({ queryKey: ["flashcards", filters], queryFn: () => api.get<Flashcard[]>("/flashcards", filters) });
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: () => api.get<{ ankiMode: "stub" | "real" }>("/settings") });
  const integrationQuery = useQuery({ queryKey: ["integrations-status"], queryFn: () => api.get<IntegrationStatus>("/integrations/status") });

  const flashcards = flashcardsQuery.data ?? [];
  const deckOptions = useMemo(() => [...new Set(flashcards.map((card) => card.ankiDeck))].sort(), [flashcards]);
  const pendingCount = flashcards.filter((card) => !card.synced).length;
  const syncedCount = flashcards.filter((card) => card.synced).length;
  const ankiProbe = integrationQuery.data?.anki;
  const syncReady = settingsQuery.data?.ankiMode === "real" && ankiProbe?.available === true;
  const operationalCopy = useMemo(() => {
    if (settingsQuery.data?.ankiMode !== "real") return "Anki em modo stub. Os cards continuam locais ate voce salvar o modo real.";
    if (!ankiProbe) return "Ainda sem diagnostico do Anki. Revalide o status antes de sincronizar.";
    if (ankiProbe.available) return `${getIntegrationProviderLabel(ankiProbe.provider)} pronto. ${ankiProbe.detail}`;
    return `Anki indisponivel. ${ankiProbe.detail}`;
  }, [ankiProbe, settingsQuery.data?.ankiMode]);

  const reload = async () => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: ["flashcards"] }), queryClient.invalidateQueries({ queryKey: ["integrations-status"] })]);
  };

  const handleSave = async (payload: Record<string, unknown>) => {
    const sanitized = normalizeNullableFields(payload, ["topicId", "bookId", "errorId"]);
    try {
      if (editing) {
        await api.patch(`/flashcards/${editing.id}`, sanitized);
        toast.success("Flashcard atualizado.");
      } else {
        await api.post("/flashcards", sanitized);
        toast.success("Flashcard criado.");
      }
      setEditing(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao salvar flashcard.");
    }
  };

  const handleDelete = async (card: Flashcard) => {
    try {
      await api.delete(`/flashcards/${card.id}`);
      toast.success("Flashcard deletado.");
      setEditing(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao deletar flashcard.");
    }
  };

  const handlePreview = async () => {
    try {
      setPreviewing(true);
      const result = await api.post<AnkiSyncResult>("/flashcards/sync-anki", { dryRun: true });
      setSyncPreview(result);
      toast.success(`Fila atual: ${result.pendingCount} card(s) pendentes.`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao simular a fila do Anki.");
    } finally {
      setPreviewing(false);
    }
  };

  const handleSync = async () => {
    try {
      if (settingsQuery.data?.ankiMode !== "real") {
        toast.error("Anki ainda esta em modo stub. Ajuste isso em Configuracoes.");
        return;
      }
      if (ankiProbe?.available === false) {
        toast.error("O Anki ainda nao foi validado. Reabra o Anki ou confira a colecao local antes de sincronizar.");
        return;
      }
      setSyncing(true);
      const result = await api.post<AnkiSyncResult>("/flashcards/sync-anki", { dryRun: false });
      setSyncReport(result);
      await reload();

      if (!result.pendingCount && !result.syncedCount && !result.duplicateCount) {
        toast("Nenhum flashcard pendente para sincronizar.");
        return;
      }
      if (result.mode === "stub") {
        toast("Anki em modo stub. Nenhum card foi enviado.");
        return;
      }
      if (result.errors.length) {
        toast.error(result.errors.join(" | "));
      } else {
        toast.success(`Sync concluido: ${result.syncedCount} enviados e ${result.duplicateCount} ja existentes.`);
      }
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao sincronizar Anki.");
    } finally {
      setSyncing(false);
    }
  };

  if (flashcardsQuery.isLoading && flashcardsQuery.data === undefined) return <LoadingState title="Carregando flashcards" description="Lendo cards locais, decks e fila de sincronizacao com o Anki." />;
  if (flashcardsQuery.isError && flashcardsQuery.data === undefined) return <ErrorState title="Falha ao carregar os flashcards" description={flashcardsQuery.error instanceof Error ? flashcardsQuery.error.message : "A leitura local falhou."} action={<button type="button" className="btn-primary" onClick={() => void flashcardsQuery.refetch()}>Tentar novamente</button>} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Flashcards" subtitle="O fluxo agora deixa claro o que esta apenas salvo localmente e o que ja cruzou a ponte para o Anki real. Nada de sync mentiroso." icon={Layers3} actions={<><button type="button" className="btn-secondary" onClick={() => void handlePreview()} disabled={previewing}>{previewing ? "Simulando..." : "Simular fila"}</button><button type="button" className="btn-secondary" onClick={() => void handleSync()} disabled={syncing || !pendingCount}>{syncing ? "Sincronizando..." : "Sync Anki"}</button><button type="button" className="btn-primary" onClick={() => { setEditing(null); setDialogOpen(true); }}>Novo card</button></>} />

      <div className="grid gap-3 md:grid-cols-4">
        <StatusPill label="Pendentes" value={`${pendingCount} cards`} tone={pendingCount ? "amber" : "slate"} />
        <StatusPill label="Sincronizados" value={`${syncedCount} cards`} tone={syncedCount ? "emerald" : "slate"} />
        <StatusPill label="Decks" value={`${deckOptions.length} decks`} tone="slate" />
        <StatusPill label="Anki" value={getIntegrationValue("Anki", ankiProbe)} tone={getIntegrationTone(ankiProbe)} detail={ankiProbe?.detail} />
      </div>

      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl"><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">operacao</p><h2 className="mt-2 text-2xl font-semibold text-slate-100">Pipeline do Anki</h2><p className="mt-2 text-sm leading-7 text-slate-400">{operationalCopy}</p></div>
          <div className="flex flex-wrap gap-2"><StatusPill label="Modo" value={settingsQuery.data?.ankiMode === "real" ? "real" : "stub"} tone={settingsQuery.data?.ankiMode === "real" ? "emerald" : "amber"} compact /><StatusPill label="Provider" value={getIntegrationProviderLabel(ankiProbe?.provider)} tone={syncReady ? "emerald" : "slate"} compact /><StatusPill label="Latencia" value={formatIntegrationLatency(ankiProbe?.responseMs)} tone="slate" compact /></div>
        </div>
        {syncPreview || syncReport ? <div className="mt-5 grid gap-4 lg:grid-cols-2">{syncPreview ? <div className="glass-strip p-4"><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">simulacao</p><p className="mt-2 text-sm text-slate-200">{syncPreview.pendingCount} card(s) aguardando envio real.</p></div> : null}{syncReport ? <div className="glass-strip p-4"><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">ultimo sync</p><p className="mt-2 text-sm text-slate-200">{syncReport.syncedCount} enviados, {syncReport.duplicateCount} duplicados, {syncReport.pendingCount} ainda pendentes.</p>{syncReport.errors.length ? <p className="mt-2 text-xs text-rose-200">{syncReport.errors.join(" | ")}</p> : null}</div> : null}</div> : null}
      </section>

      <section className="panel grid gap-3 p-4 md:grid-cols-4">
        <input className="input md:col-span-2" placeholder="Buscar frente ou verso" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
        <select className="select" value={filters.synced} onChange={(event) => setFilters({ ...filters, synced: event.target.value })}><option value="">Status sync</option><option value="true">Sincronizados</option><option value="false">Locais</option></select>
        <select className="select" value={filters.ankiDeck} onChange={(event) => setFilters({ ...filters, ankiDeck: event.target.value })}><option value="">Todos os decks</option>{deckOptions.map((deck) => <option key={deck} value={deck}>{deck}</option>)}</select>
      </section>

      {flashcards.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{flashcards.map((flashcard) => <FlashcardItem key={flashcard.id} flashcard={flashcard} onEdit={(item) => { setEditing(item); setDialogOpen(true); }} onDelete={(item) => void handleDelete(item)} />)}</div> : <EmptyState title="Nenhum flashcard por aqui" description="Gere cards a partir do diario de erros ou crie manualmente. O importante e separar revisao local de sincronizacao real." action={<button type="button" className="btn-primary" onClick={() => setDialogOpen(true)}>Criar primeiro card</button>} />}

      <FlashcardFormDialog open={dialogOpen} onOpenChange={setDialogOpen} flashcard={editing} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}
