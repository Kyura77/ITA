import { Pencil, Trash2 } from "lucide-react";
import type { Book } from "@/types/entities";
import { humanizeEnum, truncateText } from "@/lib/labels";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const progress = Math.max(0, Math.min(100, book.progressPercent));
  const progressTone = progress >= 75 ? "from-emerald-400 to-cyan-300" : progress >= 35 ? "from-cyan-400 to-sky-300" : "from-amber-400 to-rose-300";

  return (
    <article className="panel flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{humanizeEnum(book.subject)}</p>
          <h3 className="text-lg font-semibold text-slate-100">{book.title}</h3>
          <p className="text-sm text-slate-400">{book.author}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost" onClick={() => onEdit(book)}><Pencil className="h-4 w-4" /></button>
          <button type="button" className="btn-ghost text-rose-300" onClick={() => onDelete(book)}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="badge">{humanizeEnum(book.status)}</span>
        <span className="badge">{humanizeEnum(book.phase)}</span>
        <span className="badge">{humanizeEnum(book.priority)}</span>
        {book.defaultAnkiDeck ? <span className="badge">Deck {book.defaultAnkiDeck}</span> : null}
      </div>

      <p className="text-sm leading-6 text-slate-400">{truncateText(book.notes, 120) || "Sem observacoes salvas para este livro."}</p>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800">
          <div className={`h-2 rounded-full bg-gradient-to-r ${progressTone}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
}
