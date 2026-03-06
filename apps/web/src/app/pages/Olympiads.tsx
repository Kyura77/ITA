import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Medal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { StatusPill } from "@/components/shared/StatusPill";
import { formatDate, formatScore, humanizeEnum, truncateText } from "@/lib/labels";
import { api, ApiError } from "@/services/apiClient";
import type { Olympiad } from "@/types/entities";

const EMPTY = {
  name: "",
  type: "OBMEP",
  year: new Date().getFullYear(),
  phase: "1fase",
  date: "",
  score: 0,
  scoreMax: 0,
  medal: "nenhuma",
  status: "inscrito",
  notes: "",
};

export default function OlympiadsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Olympiad | null>(null);
  const [filters, setFilters] = useState({ type: "", status: "", q: "" });
  const [form, setForm] = useState(EMPTY);
  const olympiadsQuery = useQuery({ queryKey: ["olympiads"], queryFn: () => api.get<Olympiad[]>("/olympiads") });
  const olympiads = olympiadsQuery.data ?? [];

  useEffect(() => {
    if (!editing) setForm(EMPTY);
  }, [editing]);

  const filteredOlympiads = useMemo(() => olympiads.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.q) {
      const query = filters.q.toLowerCase();
      return item.name.toLowerCase().includes(query) || (item.notes ?? "").toLowerCase().includes(query);
    }
    return true;
  }), [filters, olympiads]);

  const activeCount = filteredOlympiads.filter((item) => item.status === "inscrito").length;
  const medalCount = filteredOlympiads.filter((item) => item.medal && item.medal !== "nenhuma").length;
  const resultsCount = filteredOlympiads.filter((item) => item.status === "resultado").length;
  const nextDate = filteredOlympiads.map((item) => item.date).filter((value): value is string => Boolean(value)).sort()[0] ?? null;

  const reload = async () => {
    await queryClient.invalidateQueries({ queryKey: ["olympiads"] });
  };

  const submit = async () => {
    try {
      if (editing) {
        await api.patch(`/olympiads/${editing.id}`, form);
        toast.success("Olimpiada atualizada.");
      } else {
        await api.post("/olympiads", form);
        toast.success("Olimpiada criada.");
      }
      setEditing(null);
      setForm(EMPTY);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao salvar olimpiada.");
    }
  };

  const editOlympiad = (item: Olympiad) => {
    setEditing(item);
    setForm({
      name: item.name,
      type: item.type,
      year: item.year,
      phase: item.phase ?? "1fase",
      date: item.date ?? "",
      score: item.score ?? 0,
      scoreMax: item.scoreMax ?? 0,
      medal: item.medal ?? "nenhuma",
      status: item.status,
      notes: item.notes ?? "",
    });
  };

  const deleteOlympiad = async (item: Olympiad) => {
    try {
      await api.delete(`/olympiads/${item.id}`);
      toast.success("Olimpiada deletada.");
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao deletar olimpiada.");
    }
  };

  if (olympiadsQuery.isLoading && olympiadsQuery.data === undefined) {
    return <LoadingState title="Carregando olimpiadas" description="Buscando fases, datas e resultados paralelos ao plano principal." />;
  }

  if (olympiadsQuery.isError && olympiadsQuery.data === undefined) {
    return <ErrorState title="Falha ao carregar olimpiadas" description={olympiadsQuery.error instanceof Error ? olympiadsQuery.error.message : "A API local nao respondeu como esperado."} action={<button type="button" className="btn-primary" onClick={() => void olympiadsQuery.refetch()}>Tentar novamente</button>} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Olimpiadas" subtitle="Sua trilha paralela precisa ter dono: data, fase, status e medalha. Sem isso, a preparacao olimpica some do radar e vira memoria vaga." icon={Medal} />

      <div className="grid gap-3 md:grid-cols-4">
        <StatusPill label="Ativas" value={`${activeCount} inscritas`} tone={activeCount ? "cyan" : "slate"} />
        <StatusPill label="Resultados" value={`${resultsCount} divulgados`} tone={resultsCount ? "emerald" : "slate"} />
        <StatusPill label="Medalhas" value={`${medalCount} registros`} tone={medalCount ? "amber" : "slate"} />
        <StatusPill label="Proxima data" value={nextDate ? formatDate(nextDate) : "-"} tone={nextDate ? "amber" : "slate"} />
      </div>

      <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">cadastro</p><h2 className="mt-2 text-2xl font-semibold text-slate-100">Painel da olimpiada</h2></div>{editing ? <span className="badge">Edicao</span> : <span className="badge">Nova entrada</span>}</div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2"><span className="text-sm text-slate-300">Nome</span><input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label className="grid gap-2"><span className="text-sm text-slate-300">Tipo</span><select className="select" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="OBMEP">OBMEP</option><option value="OBF">OBF</option><option value="OBQ">OBQ</option><option value="OBM">OBM</option><option value="OBI">OBI</option><option value="OBFEP">OBFEP</option><option value="outra">Outra</option></select></label>
            <label className="grid gap-2"><span className="text-sm text-slate-300">Ano</span><input className="input" type="number" value={form.year} onChange={(event) => setForm({ ...form, year: Number(event.target.value) })} /></label>
            <label className="grid gap-2"><span className="text-sm text-slate-300">Fase</span><select className="select" value={form.phase} onChange={(event) => setForm({ ...form, phase: event.target.value })}><option value="1fase">1a fase</option><option value="2fase">2a fase</option><option value="3fase">3a fase</option><option value="final">Final</option></select></label>
            <label className="grid gap-2"><span className="text-sm text-slate-300">Status</span><select className="select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="inscrito">Inscrito</option><option value="realizada">Realizada</option><option value="resultado">Resultado</option></select></label>
            <label className="grid gap-2"><span className="text-sm text-slate-300">Data</span><input className="input" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
            <label className="grid gap-2"><span className="text-sm text-slate-300">Medalha</span><select className="select" value={form.medal} onChange={(event) => setForm({ ...form, medal: event.target.value })}><option value="nenhuma">Nenhuma</option><option value="honra_ao_merito">Honra ao merito</option><option value="bronze">Bronze</option><option value="prata">Prata</option><option value="ouro">Ouro</option></select></label>
            <label className="grid gap-2"><span className="text-sm text-slate-300">Score</span><input className="input" type="number" value={form.score} onChange={(event) => setForm({ ...form, score: Number(event.target.value) })} /></label>
            <label className="grid gap-2"><span className="text-sm text-slate-300">Score max</span><input className="input" type="number" value={form.scoreMax} onChange={(event) => setForm({ ...form, scoreMax: Number(event.target.value) })} /></label>
            <label className="grid gap-2 md:col-span-2"><span className="text-sm text-slate-300">Notas</span><textarea className="textarea min-h-[120px]" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
          </div>
          <div className="mt-4 flex justify-end gap-2">{editing ? <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancelar edicao</button> : null}<button type="button" className="btn-primary" onClick={() => void submit()}>{editing ? "Salvar olimpiada" : "Criar olimpiada"}</button></div>
        </div>

        <div className="space-y-4">
          <section className="panel grid gap-3 p-4 md:grid-cols-3">
            <input className="input md:col-span-3" placeholder="Buscar nome ou notas" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
            <select className="select" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}><option value="">Tipo</option><option value="OBMEP">OBMEP</option><option value="OBF">OBF</option><option value="OBQ">OBQ</option><option value="OBM">OBM</option><option value="OBI">OBI</option><option value="OBFEP">OBFEP</option><option value="outra">Outra</option></select>
            <select className="select" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Status</option><option value="inscrito">Inscrito</option><option value="realizada">Realizada</option><option value="resultado">Resultado</option></select>
            <button type="button" className="btn-secondary" onClick={() => setFilters({ type: "", status: "", q: "" })}>Limpar</button>
          </section>

          {filteredOlympiads.length ? filteredOlympiads.map((item) => <article key={item.id} className="panel p-5"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2"><span className="badge">{item.type}</span><span className="badge">{humanizeEnum(item.status)}</span><span className="badge">{humanizeEnum(item.medal ?? "nenhuma")}</span></div><h3 className="mt-3 text-lg font-semibold text-slate-100">{item.name}</h3><p className="mt-2 text-sm text-slate-400">{item.year} | {humanizeEnum(item.phase ?? "-")} | {formatDate(item.date)}</p><p className="mt-2 text-sm text-slate-400">Score: {formatScore(item.score, item.scoreMax)}</p>{item.notes ? <p className="mt-2 text-sm text-slate-500">{truncateText(item.notes, 180)}</p> : null}</div><div className="flex gap-2"><button type="button" className="btn-ghost" onClick={() => editOlympiad(item)}><Pencil className="h-4 w-4" /></button><button type="button" className="btn-ghost" onClick={() => void deleteOlympiad(item)}><Trash2 className="h-4 w-4" /></button></div></div></article>) : <EmptyState title="Nenhuma olimpiada encontrada" description="Cadastre inscricoes e resultados para manter essa frente visivel no plano semanal." />}
        </div>
      </section>
    </div>
  );
}
