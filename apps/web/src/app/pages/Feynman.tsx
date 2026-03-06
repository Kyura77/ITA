import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusPill } from "@/components/shared/StatusPill";
import { getIntegrationTone, getIntegrationValue } from "@/lib/integrations";
import { api, ApiError } from "@/services/apiClient";
import type { FeynmanSession, IntegrationStatus, Topic } from "@/types/entities";

export default function FeynmanPage() {
  const queryClient = useQueryClient();
  const [topicId, setTopicId] = useState("");
  const [explanation, setExplanation] = useState("");
  const topicsQuery = useQuery({ queryKey: ["topics"], queryFn: () => api.get<Topic[]>("/topics") });
  const sessionsQuery = useQuery({ queryKey: ["feynman-sessions", topicId], queryFn: () => api.get<FeynmanSession[]>("/feynman-sessions", topicId ? { topicId } : undefined) });
  const integrationQuery = useQuery({ queryKey: ["integrations-status"], queryFn: () => api.get<IntegrationStatus>("/integrations/status") });

  const topics = topicsQuery.data ?? [];
  const sessions = sessionsQuery.data ?? [];
  const selectedTopic = useMemo(() => topics.find((topic) => topic.id === topicId) ?? null, [topicId, topics]);

  if ((topicsQuery.isLoading && topicsQuery.data === undefined) || (sessionsQuery.isLoading && sessionsQuery.data === undefined)) {
    return <LoadingState title="Preparando a avaliação Feynman" description="Carregando tópicos, histórico de tentativas e o estado da IA local." />;
  }

  if (topicsQuery.isError && topicsQuery.data === undefined) {
    return (
      <ErrorState
        title="Falha ao carregar os tópicos"
        description={topicsQuery.error instanceof Error ? topicsQuery.error.message : "Não foi possível abrir a etapa Feynman."}
        action={<button type="button" className="btn-primary" onClick={() => void topicsQuery.refetch()}>Tentar novamente</button>}
      />
    );
  }

  const submit = async () => {
    if (!selectedTopic || !explanation.trim()) {
      toast.error("Selecione um tópico e escreva a explicação.");
      return;
    }

    try {
      const result = await api.post<FeynmanSession>("/feynman-sessions", {
        topicId: selectedTopic.id,
        topicName: selectedTopic.topic,
        explanation,
      });
      setExplanation("");
      if (result.mode === "real") {
        toast.success("Sessão avaliada com IA real.");
      } else {
        toast("Sessão registrada com stub local. A nota ainda é útil para treino, mas não veio do modelo real.");
      }
      await queryClient.invalidateQueries({ queryKey: ["feynman-sessions"] });
      await queryClient.invalidateQueries({ queryKey: ["topics"] });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao avaliar explicação.");
    }
  };

  if (!topics.length) {
    return <EmptyState title="Sem tópicos para explicar" description="Cadastre ou seede tópicos antes de usar o fluxo Feynman." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Feynman" subtitle="Explique um tópico com suas palavras. A aprovação local continua exigindo nota 8 ou mais." icon={Brain} />
      <div className="grid gap-3 md:grid-cols-3">
        <StatusPill label="IA" value={getIntegrationValue("Ollama", integrationQuery.data?.ai)} tone={getIntegrationTone(integrationQuery.data?.ai)} detail={integrationQuery.data?.ai.detail} />
        <StatusPill label="Tentativas" value={`${sessions.length} sessões`} tone="slate" />
        <StatusPill label="Selecionado" value={selectedTopic ? selectedTopic.topic : "nenhum tópico"} tone="cyan" />
      </div>
      <section className="grid gap-4 xl:grid-cols-[1.1fr,1fr]">
        <div className="panel p-5">
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Tópico</span>
            <select className="select" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              <option value="">Selecione um tópico</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.subject} · {topic.topic}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 grid gap-2">
            <span className="text-sm text-slate-300">Sua explicação</span>
            <textarea className="textarea min-h-[280px]" value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Explique como se estivesse ensinando a um colega..." />
          </label>
          <div className="mt-4 flex justify-end">
            <button type="button" className="btn-primary" onClick={() => void submit()}>
              Avaliar
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {sessions.length ? (
            sessions.map((session) => (
              <article key={session.id} className="panel p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="badge">tentativa {session.attemptNumber}</span>
                  <span className="badge">nota {session.iaScore ?? "-"}</span>
                  <span className="badge">{session.approved ? "aprovado" : "revisar"}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-100">{session.topicName}</h3>
                {session.iaFeedback ? (
                  <div className="markdown mt-4 rounded-[24px] border border-slate-800 p-4">
                    <ReactMarkdown>{session.iaFeedback}</ReactMarkdown>
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <EmptyState title="Sem tentativas ainda" description="As sessões Feynman ficam aqui com score, feedback e histórico por tópico." />
          )}
        </div>
      </section>
    </div>
  );
}