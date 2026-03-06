import { Pencil, ArrowRight } from "lucide-react";
import type { Topic } from "@/types/entities";

interface TopicRowProps {
  topic: Topic;
  onAdvance: () => void;
  onEdit: () => void;
}

export function TopicRow({ topic, onAdvance, onEdit }: TopicRowProps) {
  return (
    <tr className="border-b border-slate-800/60 transition hover:bg-slate-800/30">
      <td className="px-3 py-3 text-sm text-slate-200">{topic.area}</td>
      <td className="px-3 py-3 text-sm text-slate-100">{topic.topic}</td>
      <td className="px-3 py-3 text-sm text-slate-400">Ano {topic.yearPlan}</td>
      <td className="px-3 py-3"><span className="badge">{topic.priorityIta}</span></td>
      <td className="px-3 py-3"><span className="badge">{topic.status}</span></td>
      <td className="px-3 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </button>
          {topic.status !== "dominado" ? (
            <button type="button" className="btn-secondary" onClick={onAdvance}>
              <ArrowRight className="h-4 w-4" />
              Avancar
            </button>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
