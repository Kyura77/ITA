import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Timer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusPill } from "@/components/shared/StatusPill";
import { formatDate } from "@/lib/dates";
import { normalizeNullableFields } from "@/lib/forms";
import { api, ApiError } from "@/services/apiClient";
import type { AppSettings, Book, StudySession, Topic } from "@/types/entities";

const EMPTY = { topicId: "", topicName: "", bookId: "", date: "", durationMinutes: 50, pomodoroCount: 2, type: "teoria", notes: "", quality: 3 };

export default function StudySessionsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const sessionsQuery = useQuery({ queryKey: ["study-sessions"], queryFn: () => api.get<StudySession[]>("/study-sessions") });
  const topicsQuery = useQuery({ queryKey: ["topics"], queryFn: () => api.get<Topic[]>("/topics") });
  const booksQuery = useQuery({ queryKey: ["books"], queryFn: () => api.get<Book[]>("/books") });
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: () => api.get<AppSettings>("/settings") });

  const blockingQueries = [sessionsQuery, topicsQuery, booksQuery, settingsQuery];
  const failed = blockingQueries.find((query) => query.isError && query.data === undefined);
  const sessions = sessionsQuery.data ?? [];
  const topics = topicsQuery.data ?? [];
  const books = booksQuery.data ?? [];
  const settings = settingsQuery.data;

  useEffect(() => {
    if (!editingId) setForm(EMPTY);
  }, [editingId]);

  const selectedTopic = useMemo(() => topics.find((topic) => topic.id === form.topicId) ?? null, [form.topicId, topics]);

  if (blockingQueries.some((query) => query.isLoading && query.data === undefined)) {
    return <LoadingState title="Carregando sessões" description="Lendo tempo estudado, livros, tópicos e configuração de pomodoro." />;
  }

  if (failed) {
    return (
      <ErrorState
        title="Falha ao carregar as sessões"
        description={failed.error instanceof Error ? failed.error.message : "Não foi possível abrir o módulo de sessões."}
        action={<button type="button" className="btn-primary" onClick={() => void Promise.all(blockingQueries.map((query) => query.refetch()))}>Tentar novamente</button>}
      />
    );
  }

  const totalMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);

  const reload = async () => {
    await queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
    await queryClient.invalidateQueries({ queryKey: ["topics"] });
  };

  const submit = async () => {
    const topicName = (selectedTopic?.topic ?? form.topicName).trim();
    if (!topicName) {
      toast.error("Informe um nome para a sessão ou selecione um tópico.");
      return;
    }
    const payload = normalizeNullableFields({ ...form, topicName }, ["topicId", "bookId", "date", "notes"]);
    try {
      if (editingId) {
        await api.patch(`/study-sessions/${editingId}`, payload);
        toast.success("Sessão atualizada.");
      } else {
        await api.post("/study-sessions", payload);
        toast.success("Sessão criada.");
      }
      setEditingId(null);
      setForm(EMPTY);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao salvar sessão.");
    }
  };

  const editSession = (session: StudySession) => {
    setEditingId(session.id);
    setForm({
      topicId: session.topicId ?? "",
      topicName: session.topicName,
      bookId: session.bookId ?? "",
      date: session.date ?? "",
      durationMinutes: session.durationMinutes,
      pomodoroCount: session.pomodoroCount,
      type: session.type ?? "teoria",
      notes: session.notes ?? "",
      quality: session.quality ?? 3,
    });
  };

  const deleteSession = async (session: StudySession) => {
    try {
      await api.delete(`/study-sessions/${session.id}`);
      toast.success("Sessão deletada.");
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao deletar sessão.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sessões" subtitle="Registro real de tempo, pomodoros e qualidade sem quebrar campos opcionais." icon={Timer} />
      <div className="grid gap-3 md:grid-cols-3">
        <StatusPill label="Carga" value={`${(totalMinutes / 60).toFixed(1)}h`} tone="cyan" />
        <StatusPill label="Sessões" value={`${sessions.length} registros`} tone="slate" />
        <StatusPill label="Pomodoro" value={`${settings?.pomodoroWork ?? 25}/${settings?.pomodoroBreak ?? 5}`} tone="emerald" />
      </div>
      <section className="grid gap-4 xl:grid-cols-[1.1fr,1fr]">
        <div className="panel p-5">
          <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>Pomodoro: {settings?.pomodoroWork ?? 25}/{settings?.pomodoroBreak ?? 5}</span>
            <span>Long break: {settings?.pomodoroLongBreak ?? 15}m</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm text-slate-300">Tópico da lista</span>
              <select className="select" value={form.topicId} onChange={(e) => { const topicId = e.target.value; const topic = topics.find((item) => item.id === topicId); setForm({ ...form, topicId, topicName: topic?.topic ?? form.topicName }); }}>
                <option value="">Sem vínculo direto</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>{topic.topic}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm text-slate-300">Nome exibido da sessão</span>
              <input className="input" value={form.topicName} onChange={(e) => setForm({ ...form, topicName: e.target.value })} placeholder="Ex.: revisão de cinemática" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Livro</span>
              <select className="select" value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })}>
                <option value="">Sem livro</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Data</span>
              <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Duração (min)</span>
              <input className="input" type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Pomodoros</span>
              <input className="input" type="number" value={form.pomodoroCount} onChange={(e) => setForm({ ...form, pomodoroCount: Number(e.target.value) })} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Tipo</span>
              <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="teoria">Teoria</option>
                <option value="exercicios">Exercícios</option>
                <option value="revisao">Revisão</option>
                <option value="prova">Prova</option>
                <option value="olimpiada">Olimpíada</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Qualidade (1-5)</span>
              <input className="input" type="number" min={1} max={5} value={form.quality} onChange={(e) => setForm({ ...form, quality: Number(e.target.value) })} />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm text-slate-300">Notas</span>
              <textarea className="textarea min-h-[120px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {editingId ? <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Cancelar edição</button> : null}
            <button type="button" className="btn-primary" onClick={() => void submit()}>{editingId ? "Salvar sessão" : "Criar sessão"}</button>
          </div>
        </div>
        <div className="space-y-4">
          {sessions.length ? (
            sessions.map((session) => (
              <article key={session.id} className="panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge">{session.type ?? "livre"}</span>
                      <span className="badge">{session.durationMinutes} min</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-slate-100">{session.topicName}</h3>
                    <p className="mt-1 text-sm text-slate-400">{formatDate(session.date)} · qualidade {session.quality ?? "-"}</p>
                    {session.notes ? <p className="mt-2 text-sm text-slate-500">{session.notes}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="btn-ghost" onClick={() => editSession(session)}><Pencil className="h-4 w-4" /></button>
                    <button type="button" className="btn-ghost" onClick={() => void deleteSession(session)}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState title="Sem sessões registradas" description="Cada sessão atualiza o tempo total do tópico automaticamente no backend." />
          )}
        </div>
      </section>
    </div>
  );
}