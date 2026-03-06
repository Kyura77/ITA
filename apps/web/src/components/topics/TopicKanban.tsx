import { ArrowRight, Pencil } from "lucide-react";
import type { Topic, TopicStatus } from "@/types/entities";

const columns: Array<{ status: TopicStatus; label: string }> = [
  { status: "nao_iniciado", label: "Nao iniciado" },
  { status: "em_andamento", label: "Em andamento" },
  { status: "base_concluida", label: "Base concluida" },
  { status: "aprofundando", label: "Aprofundando" },
  { status: "dominado", label: "Dominado" },
];

interface TopicKanbanProps {
  topics: Topic[];
  onAdvance: (topic: Topic) => void;
  onEdit: (topic: Topic) => void;
}

export function TopicKanban({ topics, onAdvance, onEdit }: TopicKanbanProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {columns.map((column) => (
        <section key={column.status} className="panel min-h-[320px] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">{column.label}</h3>
            <span className="badge">{topics.filter((topic) => topic.status === column.status).length}</span>
          </div>
          <div className="space-y-3">
            {topics
              .filter((topic) => topic.status === column.status)
              .map((topic) => (
                <article key={topic.id} className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{topic.area}</p>
                  <h4 className="mt-2 text-sm font-semibold text-slate-100">{topic.topic}</h4>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Ano {topic.yearPlan}</span>
                    <span>{topic.priorityIta}</span>
                  </div>
                  <div className="mt-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                    <button type="button" className="btn-ghost" onClick={() => onEdit(topic)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    {topic.status !== "dominado" ? (
                      <button type="button" className="btn-secondary" onClick={() => onAdvance(topic)}>
                        <ArrowRight className="h-4 w-4" />
                        Avancar
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
