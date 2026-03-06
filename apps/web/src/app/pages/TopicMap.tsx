import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Network } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { StatusPill } from "@/components/shared/StatusPill";
import { TopicRow } from "@/components/topics/TopicRow";
import { TopicKanban } from "@/components/topics/TopicKanban";
import { TopicFormDialog } from "@/components/topics/TopicFormDialog";
import { normalizeNullableFields } from "@/lib/forms";
import { api, ApiError } from "@/services/apiClient";
import type { Topic } from "@/types/entities";

export default function TopicMapPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ subject: "", yearPlan: "", status: "", priorityIta: "", q: "" });
  const [view, setView] = useState<"table" | "kanban">("table");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const topicsQuery = useQuery({ queryKey: ["topics", filters], queryFn: () => api.get<Topic[]>("/topics", filters) });

  const topics = topicsQuery.data ?? [];
  const statusSummary = useMemo(
    () => ({
      backlog: topics.filter((topic) => topic.status === "nao_iniciado").length,
      active: topics.filter((topic) => topic.status === "em_andamento").length,
      deep: topics.filter((topic) => ["base_concluida", "aprofundando"].includes(topic.status)).length,
      mastered: topics.filter((topic) => topic.status === "dominado").length,
    }),
    [topics],
  );

  if (topicsQuery.isLoading && topicsQuery.data === undefined) {
    return <LoadingState title="Montando o mapa de tópicos" description="Carregando o sequenciamento por matéria, prioridade e status." />;
  }

  if (topicsQuery.isError && topicsQuery.data === undefined) {
    return (
      <ErrorState
        title="Falha ao carregar os tópicos"
        description={topicsQuery.error instanceof Error ? topicsQuery.error.message : "Não foi possível ler o mapa."}
        action={<button type="button" className="btn-primary" onClick={() => void topicsQuery.refetch()}>Tentar novamente</button>}
      />
    );
  }

  const reload = async () => {
    await queryClient.invalidateQueries({ queryKey: ["topics"] });
  };

  const handleSave = async (payload: Record<string, unknown>) => {
    const sanitized = normalizeNullableFields(payload, ["subtopic", "bookBaseId", "bookAdvancedId", "startDate", "lastReviewedAt", "ankiDeck", "notes", "prerequisites"]);
    try {
      if (editing) {
        await api.patch(`/topics/${editing.id}`, sanitized);
        toast.success("Tópico atualizado.");
      } else {
        await api.post("/topics", sanitized);
        toast.success("Tópico criado.");
      }
      setEditing(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao salvar tópico.");
    }
  };

  const handleDelete = async (topic: Topic) => {
    try {
      await api.delete(`/topics/${topic.id}`);
      toast.success("Tópico deletado.");
      setEditing(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao deletar tópico.");
    }
  };

  const handleAdvance = async (topic: Topic) => {
    try {
      await api.post(`/topics/${topic.id}/advance`);
      toast.success("Status avançado.");
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao avançar tópico.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mapa de Tópicos"
        subtitle="A edição é sempre livre. O que altera domínio mesmo é o botão Avançar com as regras de pré-requisito."
        icon={Network}
        actions={
          <>
            <div className="flex rounded-[20px] border border-slate-800 p-1">
              <button type="button" className={view === "table" ? "btn-primary" : "btn-ghost"} onClick={() => setView("table")}>Tabela</button>
              <button type="button" className={view === "kanban" ? "btn-primary" : "btn-ghost"} onClick={() => setView("kanban")}>Kanban</button>
            </div>
            <button type="button" className="btn-primary" onClick={() => { setEditing(null); setDialogOpen(true); }}>
              Novo tópico
            </button>
          </>
        }
      />
      <div className="grid gap-3 md:grid-cols-4">
        <StatusPill label="Backlog" value={`${statusSummary.backlog} tópicos`} tone="amber" />
        <StatusPill label="Em execução" value={`${statusSummary.active} tópicos`} tone="cyan" />
        <StatusPill label="Aprofundando" value={`${statusSummary.deep} tópicos`} tone="slate" />
        <StatusPill label="Dominado" value={`${statusSummary.mastered} tópicos`} tone="emerald" />
      </div>
      <section className="panel grid gap-3 p-4 md:grid-cols-5">
        <input className="input md:col-span-2" placeholder="Buscar área, tópico ou subtópico" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className="select" value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })}>
          <option value="">Matéria</option>
          <option value="matematica">Matemática</option>
          <option value="fisica">Física</option>
          <option value="quimica">Química</option>
          <option value="calculo">Cálculo</option>
        </select>
        <select className="select" value={filters.yearPlan} onChange={(e) => setFilters({ ...filters, yearPlan: e.target.value })}>
          <option value="">Ano</option>
          <option value="1">Ano 1</option>
          <option value="2">Ano 2</option>
          <option value="3">Ano 3</option>
        </select>
        <select className="select" value={filters.priorityIta} onChange={(e) => setFilters({ ...filters, priorityIta: e.target.value })}>
          <option value="">Prioridade</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
      </section>
      {topics.length ? (
        view === "table" ? (
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Tópico</th>
                  <th>Ano</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => (
                  <TopicRow key={topic.id} topic={topic} onAdvance={() => void handleAdvance(topic)} onEdit={() => { setEditing(topic); setDialogOpen(true); }} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <TopicKanban topics={topics} onAdvance={(topic) => void handleAdvance(topic)} onEdit={(topic) => { setEditing(topic); setDialogOpen(true); }} />
        )
      ) : (
        <EmptyState title="Nenhum tópico encontrado" description="O mapa precisa de seed ou cadastro manual. Os filtros também podem ter zerado a visão." action={<button type="button" className="btn-primary" onClick={() => { setEditing(null); setDialogOpen(true); }}>Criar tópico</button>} />
      )}
      <TopicFormDialog open={dialogOpen} onOpenChange={setDialogOpen} topic={editing} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}