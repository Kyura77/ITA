import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ExamCard } from "@/components/exams/ExamCard";
import { ExamFormDialog } from "@/components/exams/ExamFormDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { StatusPill } from "@/components/shared/StatusPill";
import { formatPercent } from "@/lib/labels";
import { api, ApiError } from "@/services/apiClient";
import type { Exam } from "@/types/entities";

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ board: "", year: "", status: "", q: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);

  const examsQuery = useQuery({ queryKey: ["exams", filters], queryFn: () => api.get<Exam[]>("/exams", filters) });

  const exams = examsQuery.data ?? [];
  const completed = exams.filter((exam) => exam.status === "realizada");
  const planned = exams.filter((exam) => exam.status === "planejada").length;
  const averageCorrect = useMemo(() => completed.length ? completed.reduce((sum, exam) => sum + (exam.percentCorrect ?? 0), 0) / completed.length : null, [completed]);
  const averageTime = useMemo(() => completed.length ? completed.reduce((sum, exam) => sum + (exam.percentTime ?? 0), 0) / completed.length : null, [completed]);
  const hasFilters = Object.values(filters).some(Boolean);

  const reload = async () => {
    await queryClient.invalidateQueries({ queryKey: ["exams"] });
  };

  const handleSave = async (payload: Record<string, unknown>) => {
    try {
      if (editing) {
        await api.patch(`/exams/${editing.id}`, payload);
        toast.success("Prova atualizada.");
      } else {
        await api.post("/exams", payload);
        toast.success("Prova criada.");
      }
      setEditing(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao salvar prova.");
    }
  };

  const handleDelete = async (exam: Exam) => {
    try {
      await api.delete(`/exams/${exam.id}`);
      toast.success("Prova deletada.");
      setEditing(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao deletar prova.");
    }
  };

  if (examsQuery.isLoading && examsQuery.data === undefined) {
    return <LoadingState title="Carregando provas" description="Lendo cronograma, metricas de tempo e historico de desempenho." />;
  }

  if (examsQuery.isError && examsQuery.data === undefined) {
    return <ErrorState title="Falha ao carregar provas" description={examsQuery.error instanceof Error ? examsQuery.error.message : "A API local nao respondeu como esperado."} action={<button type="button" className="btn-primary" onClick={() => void examsQuery.refetch()}>Tentar novamente</button>} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Provas" subtitle="Aqui voce mede disciplina de tempo, qualidade de acerto e o quanto sua janela de provas esta realmente organizada. Sem isso, simulados viram decoracao." icon={ClipboardList} actions={<>{hasFilters ? <button type="button" className="btn-secondary" onClick={() => setFilters({ board: "", year: "", status: "", q: "" })}>Limpar filtros</button> : null}<button type="button" className="btn-primary" onClick={() => { setEditing(null); setDialogOpen(true); }}>Nova prova</button></>} />

      <div className="grid gap-3 md:grid-cols-4">
        <StatusPill label="Agenda" value={`${planned} planejadas`} tone={planned ? "amber" : "slate"} />
        <StatusPill label="Historico" value={`${completed.length} realizadas`} tone={completed.length ? "emerald" : "slate"} />
        <StatusPill label="Acerto medio" value={formatPercent(averageCorrect)} tone={averageCorrect != null && averageCorrect >= 70 ? "emerald" : averageCorrect != null ? "amber" : "slate"} />
        <StatusPill label="Uso medio" value={formatPercent(averageTime)} tone={averageTime != null && averageTime <= 100 ? "cyan" : averageTime != null ? "amber" : "slate"} />
      </div>

      <section className="panel grid gap-3 p-4 md:grid-cols-4">
        <input className="input md:col-span-2" placeholder="Buscar prova" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
        <select className="select" value={filters.board} onChange={(event) => setFilters({ ...filters, board: event.target.value })}><option value="">Banca</option><option value="AFA">AFA</option><option value="IME_1fase">IME 1a fase</option><option value="IME_2fase">IME 2a fase</option><option value="ITA_1fase">ITA 1a fase</option><option value="ITA_2fase">ITA 2a fase</option></select>
        <div className="grid gap-3 sm:grid-cols-2"><select className="select" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Status</option><option value="planejada">Planejada</option><option value="realizada">Realizada</option></select><input className="input" type="number" placeholder="Ano" value={filters.year} onChange={(event) => setFilters({ ...filters, year: event.target.value })} /></div>
      </section>

      {exams.length ? <div className="grid gap-4 xl:grid-cols-2">{exams.map((exam) => <ExamCard key={exam.id} exam={exam} onEdit={(item) => { setEditing(item); setDialogOpen(true); }} onDelete={(item) => void handleDelete(item)} />)}</div> : <EmptyState title="Nenhuma prova registrada" description={hasFilters ? "Nenhuma prova bate com os filtros atuais." : "Cadastre simulados, ITA, IME e outras bancas para construir uma regua util de evolucao."} action={<button type="button" className="btn-primary" onClick={() => { setEditing(null); setDialogOpen(true); }}>Criar primeira prova</button>} />}

      <ExamFormDialog open={dialogOpen} onOpenChange={setDialogOpen} exam={editing} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}
