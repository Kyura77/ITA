import { Brain, Pencil, Sparkles, Trash2, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ConceptualError } from "@/types/entities";

interface ErrorCardProps {
  errorItem: ConceptualError;
  onEdit: (item: ConceptualError) => void;
  onDelete: (item: ConceptualError) => void;
  onToggleResolved: (item: ConceptualError) => void;
  onAnalyze: (item: ConceptualError) => void;
  onGenerateCards: (item: ConceptualError) => void;
}

export function ErrorCard({ errorItem, onEdit, onDelete, onToggleResolved, onAnalyze, onGenerateCards }: ErrorCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="badge">{errorItem.severity}</span>
            <span className="badge">{errorItem.source}</span>
            <span className="badge">{errorItem.resolved ? "resolvido" : "aberto"}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-100">{errorItem.descriptionGap}</h3>
          <p className="mt-2 text-sm text-slate-400">{errorItem.context}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={() => onEdit(errorItem)}><Pencil className="h-4 w-4" /></button>
          <button type="button" className="btn-ghost" onClick={() => onDelete(errorItem)}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={() => onAnalyze(errorItem)}>
          <Brain className="h-4 w-4" />
          Analisar com IA
        </button>
        <button type="button" className="btn-secondary" onClick={() => onGenerateCards(errorItem)}>
          <Sparkles className="h-4 w-4" />
          Gerar cards
        </button>
        <button type="button" className="btn-secondary" onClick={() => onToggleResolved(errorItem)}>
          <CheckCircle2 className="h-4 w-4" />
          {errorItem.resolved ? "Reabrir" : "Marcar resolvido"}
        </button>
      </div>

      {errorItem.iaAnalysis ? (
        <div className="markdown mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <ReactMarkdown>{errorItem.iaAnalysis}</ReactMarkdown>
        </div>
      ) : null}
    </article>
  );
}
