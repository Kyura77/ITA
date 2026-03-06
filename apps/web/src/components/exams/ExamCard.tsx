import { Pencil, Trash2 } from "lucide-react";
import type { Exam } from "@/types/entities";
import { formatDate, formatPercent, formatScore, humanizeEnum, truncateText } from "@/lib/labels";

interface ExamCardProps {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
}

export function ExamCard({ exam, onEdit, onDelete }: ExamCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="badge">{humanizeEnum(exam.board)}</span>
            <span className="badge">{humanizeEnum(exam.status)}</span>
            <span className="badge">{exam.year}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{exam.name}</h3>
            <p className="mt-2 text-sm text-slate-400">Data: {formatDate(exam.dateReal)} | Janela sugerida: ano {exam.recommendedPeriodStartYear ?? "-"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost" onClick={() => onEdit(exam)}><Pencil className="h-4 w-4" /></button>
          <button type="button" className="btn-ghost" onClick={() => onDelete(exam)}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-slate-950/35 p-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Acerto</p><p className="mt-2 text-lg font-semibold text-slate-100">{formatPercent(exam.percentCorrect)}</p></div>
        <div className="rounded-2xl border border-white/5 bg-slate-950/35 p-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Uso do tempo</p><p className="mt-2 text-lg font-semibold text-slate-100">{formatPercent(exam.percentTime)}</p></div>
        <div className="rounded-2xl border border-white/5 bg-slate-950/35 p-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Pontuacao</p><p className="mt-2 text-lg font-semibold text-slate-100">{formatScore(exam.score, exam.scoreMax)}</p></div>
      </div>

      {exam.notes ? <p className="mt-4 text-sm leading-6 text-slate-400">{truncateText(exam.notes, 180)}</p> : null}
    </article>
  );
}
