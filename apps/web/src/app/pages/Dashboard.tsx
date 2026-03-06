import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, BookMarked, Brain, FolderOpen, MonitorSmartphone, Sparkles, TimerReset, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { StatusPill } from "@/components/shared/StatusPill";
import { api, ApiError } from "@/services/apiClient";
import { useSeed } from "@/hooks/useSeed";
import { getIntegrationTone, getIntegrationValue } from "@/lib/integrations";
import { daysUntil } from "@/lib/dates";
import { isDesktopRuntime, openDesktopFolder } from "@/lib/runtime";
import type { AnkiSyncResult, AppSettings, Book, ConceptualError, Exam, Flashcard, IntegrationStatus, Olympiad, StudySession, Topic } from "@/types/entities";

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function sameDay(value: string | null | undefined, day: string) {
  return typeof value === "string" && value.slice(0, 10) === day;
}

function getStreakDays(sessions: StudySession[]) {
  const sessionDays = new Set(
    sessions
      .map((session) => session.date?.slice(0, 10))
      .filter((value): value is string => Boolean(value)),
  );

  if (!sessionDays.size) return 0;

  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!sessionDays.has(key)) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildPriorityQueue(errors: ConceptualError[], olympiads: Olympiad[], topics: Topic[], exams: Exam[]) {
  const items: Array<{ label: string; score: number; type: string }> = [];

  errors
    .filter((item) => !item.resolved)
    .forEach((item) => {
      items.push({
        label: item.descriptionGap,
        score: item.severity === "grave" ? 12 : item.severity === "moderada" ? 7 : 4,
        type: "erro",
      });
    });

  olympiads
    .filter((item) => item.status === "inscrito")
    .forEach((item) => {
      const days = daysUntil(item.date);
      if (days === null || days < 0 || days > 30) return;
      items.push({ label: `${item.name} - ${days}d`, score: days < 7 ? 14 : 8, type: "olimpiada" });
    });

  topics
    .filter((topic) => topic.yearPlan === 1 && topic.status === "nao_iniciado" && ["alta", "critica"].includes(topic.priorityIta))
    .forEach((topic) => {
      items.push({ label: topic.topic, score: topic.priorityIta === "critica" ? 10 : 6, type: "topico" });
    });

  exams
    .filter((exam) => exam.status === "planejada")
    .forEach((exam) => {
      const days = daysUntil(exam.dateReal);
      if (days === null || days < 0 || days > 45) return;
      items.push({ label: `${exam.name} - ${days}d`, score: days < 10 ? 11 : 6, type: "prova" });
    });

  return items.sort((a, b) => b.score - a.score).slice(0, 6);
}

const subjectLabels: Record<string, string> = {
  matematica: "Matematica",
  fisica: "Fisica",
  quimica: "Quimica",
  calculo: "Calculo",
};

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const desktop = isDesktopRuntime();
  const today = useMemo(() => isoToday(), []);
  const { seeding, runSeed } = useSeed();
  const [syncingAnki, setSyncingAnki] = useState(false);

  const booksQuery = useQuery({ queryKey: ["books"], queryFn: () => api.get<Book[]>("/books") });
  const topicsQuery = useQuery({ queryKey: ["topics"], queryFn: () => api.get<Topic[]>("/topics") });
  const errorsQuery = useQuery({ queryKey: ["errors"], queryFn: () => api.get<ConceptualError[]>("/errors") });
  const sessionsQuery = useQuery({ queryKey: ["study-sessions"], queryFn: () => api.get<StudySession[]>("/study-sessions") });
  const examsQuery = useQuery({ queryKey: ["exams"], queryFn: () => api.get<Exam[]>("/exams") });
  const olympiadsQuery = useQuery({ queryKey: ["olympiads"], queryFn: () => api.get<Olympiad[]>("/olympiads") });
  const flashcardsQuery = useQuery({ queryKey: ["flashcards"], queryFn: () => api.get<Flashcard[]>("/flashcards") });
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: () => api.get<AppSettings>("/settings") });
  const integrationsQuery = useQuery({ queryKey: ["integrations-status"], queryFn: () => api.get<IntegrationStatus>("/integrations/status") });

  const blockingQueries = [booksQuery, topicsQuery, errorsQuery, sessionsQuery, examsQuery, olympiadsQuery, flashcardsQuery, settingsQuery];
  const books = booksQuery.data ?? [];
  const topics = topicsQuery.data ?? [];
  const errors = errorsQuery.data ?? [];
  const sessions = sessionsQuery.data ?? [];
  const exams = examsQuery.data ?? [];
  const olympiads = olympiadsQuery.data ?? [];
  const flashcards = flashcardsQuery.data ?? [];
  const settings = settingsQuery.data;
  const integrations = integrationsQuery.data;
  const loading = blockingQueries.some((query) => query.isLoading && query.data === undefined);
  const failed = blockingQueries.find((query) => query.isError && query.data === undefined);

  const todaySessions = useMemo(() => sessions.filter((session) => sameDay(session.date, today)), [sessions, today]);
  const todayMinutes = todaySessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const todayPomodoros = todaySessions.reduce((sum, session) => sum + session.pomodoroCount, 0);
  const streakDays = useMemo(() => getStreakDays(sessions), [sessions]);
  const pendingFlashcards = flashcards.filter((card) => !card.synced).length;
  const unresolvedErrors = errors.filter((item) => !item.resolved);
  const activeTopics = topics.filter((topic) => topic.status === "em_andamento").length;
  const criticalBacklog = topics.filter((topic) => topic.status === "nao_iniciado" && topic.priorityIta === "critica").length;

  const subjectSummary = useMemo(
    () => (["matematica", "fisica", "quimica", "calculo"] as const).map((subject) => {
      const subjectTopics = topics.filter((topic) => topic.subject === subject);
      const mastered = subjectTopics.filter((topic) => topic.status === "dominado").length;
      const active = subjectTopics.filter((topic) => topic.status === "em_andamento").length;
      const completion = subjectTopics.length ? Math.round((mastered / subjectTopics.length) * 100) : 0;
      return {
        key: subject,
        label: subjectLabels[subject],
        total: subjectTopics.length,
        mastered,
        active,
        completion,
      };
    }),
    [topics],
  );

  const priorityQueue = useMemo(() => buildPriorityQueue(errors, olympiads, topics, exams), [errors, olympiads, topics, exams]);

  const nextMove = useMemo(() => {
    const graveError = unresolvedErrors.find((item) => item.severity === "grave");
    if (graveError) {
      return {
        title: "Fechar um erro grave antes do proximo bloco",
        description: `"${graveError.descriptionGap}" ainda esta aberto e pode contaminar as proximas listas.`,
        cta: "Abrir Diario de Erros",
        to: "/error-diary",
      };
    }

    const criticalTopic = topics.find((topic) => topic.status === "nao_iniciado" && topic.priorityIta === "critica");
    if (criticalTopic) {
      return {
        title: "Destravar um topico critico agora",
        description: `${criticalTopic.topic} ainda nao foi iniciado e esta marcado como critico no plano.`,
        cta: "Abrir Mapa de Topicos",
        to: "/topic-map",
      };
    }

    const upcomingExam = exams.find((exam) => exam.status === "planejada" && (() => {
      const days = daysUntil(exam.dateReal);
      return days !== null && days >= 0 && days <= 14;
    })());
    if (upcomingExam) {
      return {
        title: "Preparar a prova mais proxima",
        description: `${upcomingExam.name} entrou na janela de 14 dias e merece bloco dedicado.`,
        cta: "Ir para Provas",
        to: "/exams",
      };
    }

    return {
      title: "Registrar o bloco de hoje",
      description: `Seu ritmo base esta em ${settings?.pomodoroWork ?? 25} min por pomodoro. Registre o estudo para o painel responder melhor.`,
      cta: "Abrir Sessoes",
      to: "/study-sessions",
    };
  }, [exams, settings?.pomodoroWork, topics, unresolvedErrors]);

  const upcomingAgenda = useMemo(() => {
    const examItems = exams
      .map((item) => ({ kind: "prova", label: item.name, days: daysUntil(item.dateReal) }))
      .filter((item) => item.days !== null && item.days >= 0)
      .map((item) => ({ ...item, days: item.days as number }));

    const olympiadItems = olympiads
      .map((item) => ({ kind: "olimpiada", label: item.name, days: daysUntil(item.date) }))
      .filter((item) => item.days !== null && item.days >= 0)
      .map((item) => ({ ...item, days: item.days as number }));

    return [...examItems, ...olympiadItems].sort((a, b) => a.days - b.days).slice(0, 4);
  }, [exams, olympiads]);

  const lastSession = sessions[0] ?? null;
  const totalStudyHours = (sessions.reduce((sum, session) => sum + session.durationMinutes, 0) / 60).toFixed(1);

  async function syncAnkiNow() {
    try {
      setSyncingAnki(true);
      const result = await api.post<AnkiSyncResult>("/flashcards/sync-anki", {});
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["flashcards"] }),
        queryClient.invalidateQueries({ queryKey: ["integrations-status"] }),
      ]);
      toast.success(`Anki atualizado: ${result.syncedCount} card(s) enviados.`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao sincronizar o Anki.");
    } finally {
      setSyncingAnki(false);
    }
  }

  async function openFolder(kind: "project" | "anki") {
    const opened = await openDesktopFolder(kind);
    if (!opened) {
      toast("Esse atalho existe apenas no app desktop.");
    }
  }

  if (loading) {
    return <LoadingState title="Montando o cockpit local" description="Carregando livros, topicos, erros, sessoes, provas e cards para montar a visao de uso real." />;
  }

  if (failed) {
    return (
      <ErrorState
        title="Falha ao carregar o dashboard"
        description={failed.error instanceof Error ? failed.error.message : "A API local nao respondeu como esperado."}
        action={
          <button type="button" className="btn-primary" onClick={() => void Promise.all(blockingQueries.map((query) => query.refetch()))}>
            Tentar novamente
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Control Room"
        subtitle="O foco aqui e decidir o proximo bloco com base no que esta travando o progresso de verdade, nao no que parece mais bonito na lista."
        icon={MonitorSmartphone}
        actions={
          <>
            <button type="button" className="btn-secondary" onClick={() => void syncAnkiNow()} disabled={syncingAnki || pendingFlashcards === 0}>
              <Sparkles className="h-4 w-4" />
              {syncingAnki ? "Sincronizando..." : pendingFlashcards > 0 ? `Sync Anki (${pendingFlashcards})` : "Anki em dia"}
            </button>
            <Link to={nextMove.to} className="btn-primary">
              {nextMove.cta}
            </Link>
          </>
        }
      />

      <section className="panel-hero p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="IA" value={getIntegrationValue("Ollama", integrations?.ai)} tone={getIntegrationTone(integrations?.ai)} detail={integrations?.ai.detail} compact />
              <StatusPill label="Anki" value={getIntegrationValue("Anki", integrations?.anki)} tone={getIntegrationTone(integrations?.anki)} detail={integrations?.anki.detail} compact />
              <StatusPill label="Modo" value={desktop ? "desktop" : "browser"} tone="slate" compact />
              <StatusPill label="Seed" value={settings?.seeded ? "base pronta" : "base vazia"} tone={settings?.seeded ? "emerald" : "amber"} compact />
            </div>

            <h2 className="mt-5 font-display text-3xl text-slate-100 sm:text-4xl">{nextMove.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">{nextMove.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={nextMove.to} className="btn-primary">
                {nextMove.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/flashcards" className="btn-secondary">
                Abrir Flashcards
              </Link>
              {desktop ? (
                <>
                  <button type="button" className="btn-secondary" onClick={() => void openFolder("project") }>
                    <FolderOpen className="h-4 w-4" />
                    Pasta do projeto
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => void openFolder("anki") }>
                    <FolderOpen className="h-4 w-4" />
                    Pasta do Anki
                  </button>
                </>
              ) : null}
            </div>

            {!topics.length ? (
              <div className="mt-6">
                <button type="button" className="btn-primary" onClick={() => void runSeed()} disabled={seeding}>
                  {seeding ? "Rodando seed..." : "Rodar seed inicial"}
                </button>
              </div>
            ) : null}
          </div>

          <div className="glass-strip p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">agora</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[20px] border border-white/5 bg-slate-950/35 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">tempo hoje</p>
                <p className="mt-2 text-3xl font-semibold text-slate-100">{(todayMinutes / 60).toFixed(1)}h</p>
                <p className="mt-2 text-sm text-slate-400">{todayPomodoros} pomodoros registrados no dia.</p>
              </div>
              <div className="rounded-[20px] border border-white/5 bg-slate-950/35 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">sequencia</p>
                <p className="mt-2 text-3xl font-semibold text-slate-100">{streakDays}d</p>
                <p className="mt-2 text-sm text-slate-400">Dias consecutivos com pelo menos uma sessao registrada.</p>
              </div>
              <div className="rounded-[20px] border border-white/5 bg-slate-950/35 p-4 sm:col-span-2 xl:col-span-1">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">proxima janela</p>
                {upcomingAgenda.length ? (
                  <div className="mt-3 space-y-2">
                    {upcomingAgenda.map((item) => (
                      <div key={`${item.kind}-${item.label}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 px-3 py-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.kind}</p>
                        </div>
                        <span className="badge">{item.days}d</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">Sem prova ou olimpiada agendada no radar imediato.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Livros concluidos" value={books.filter((book) => book.status === "concluido").length} icon={BookMarked} color="cyan" />
        <StatCard title="Topicos dominados" value={topics.filter((topic) => topic.status === "dominado").length} icon={Brain} color="green" />
        <StatCard title="Horas totais" value={totalStudyHours} subtitle="soma real das sessoes" icon={TimerReset} color="amber" />
        <StatCard title="Erros abertos" value={unresolvedErrors.length} subtitle="o que ainda contamina a pratica" icon={TriangleAlert} color="red" />
        <StatCard title="Cards pendentes" value={pendingFlashcards} subtitle="fila antes do sync real" icon={Sparkles} color="cyan" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr,1fr]">
        <section className="panel p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">progresso por materia</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-100">Linha de frente</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill label="ativos" value={String(activeTopics)} tone="cyan" compact />
              <StatusPill label="criticos" value={String(criticalBacklog)} tone={criticalBacklog > 0 ? "rose" : "emerald"} compact />
            </div>
          </div>

          {topics.length ? (
            <div className="space-y-4">
              {subjectSummary.map((item) => (
                <article key={item.key} className="glass-strip p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-100">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.mastered}/{item.total} dominados - {item.active} em andamento
                      </p>
                    </div>
                    <span className="badge">{item.completion}%</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950/70">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300 transition-all duration-500" style={{ width: `${item.completion}%` }} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sem topicos disponiveis"
              description="Rode o seed inicial ou comece a cadastrar manualmente para enxergar o progresso por materia."
              action={
                <button type="button" className="btn-primary" onClick={() => void runSeed()} disabled={seeding}>
                  {seeding ? "Rodando seed..." : "Rodar seed"}
                </button>
              }
            />
          )}
        </section>

        <section className="panel p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">radar de hoje</p>
          <div className="mt-4 space-y-3">
            {priorityQueue.length ? (
              priorityQueue.map((item, index) => (
                <div key={`${item.type}-${item.label}-${index}`} className="glass-strip p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{item.type}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-100">{item.label}</p>
                    </div>
                    <span className="badge">score {item.score}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Sem urgencia forte ainda. Cadastre erros, provas ou datas de olimpiada para alimentar a fila.</p>
            )}
          </div>

          <div className="mt-6 rounded-[24px] border border-white/5 bg-slate-950/35 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">ultimo registro</p>
            {lastSession ? (
              <>
                <p className="mt-2 text-sm font-semibold text-slate-100">{lastSession.topicName}</p>
                <p className="mt-1 text-sm text-slate-400">{lastSession.durationMinutes} min - {lastSession.pomodoroCount} pomodoros</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-400">Nenhuma sessao registrada ainda.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
