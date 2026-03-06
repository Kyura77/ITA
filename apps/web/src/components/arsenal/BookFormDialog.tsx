import { useEffect, useState, type FormEvent } from "react";
import type { Book, BookPhase, BookPriority, Subject } from "@/types/entities";
import { DialogShell } from "@/components/shared/DialogShell";

const EMPTY = {
  title: "",
  author: "",
  subject: "geral" as Subject,
  phase: "base" as BookPhase,
  priority: "recomendado" as BookPriority,
  progressPercent: 0,
  notes: "",
  defaultAnkiDeck: "",
  recommendedOrder: "",
};

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  onSave: (payload: typeof EMPTY) => Promise<void>;
  onDelete?: (book: Book) => Promise<void>;
}

export function BookFormDialog({ open, onOpenChange, book, onSave, onDelete }: BookFormDialogProps) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      book
        ? {
            title: book.title,
            author: book.author,
            subject: book.subject,
            phase: book.phase,
            priority: book.priority,
            progressPercent: book.progressPercent,
            notes: book.notes ?? "",
            defaultAnkiDeck: book.defaultAnkiDeck ?? "",
            recommendedOrder: book.recommendedOrder ?? "",
          }
        : EMPTY,
    );
  }, [book, open]);

  const close = () => onOpenChange(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      close();
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogShell
      open={open}
      title={book ? "Editar livro" : "Novo livro"}
      description="Status e calculado automaticamente a partir do progresso."
      onClose={close}
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            {book && onDelete ? (
              <button type="button" className="btn-secondary text-rose-300" onClick={() => void onDelete(book).then(close)}>
                Deletar
              </button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={close}>
              Cancelar
            </button>
            <button type="submit" form="book-form" className="btn-primary" disabled={saving}>
              Salvar
            </button>
          </div>
        </div>
      }
    >
      <form id="book-form" className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Titulo</span>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Autor</span>
          <input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Materia</span>
          <select className="select" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value as Subject })}>
            <option value="matematica">Matematica</option>
            <option value="fisica">Fisica</option>
            <option value="quimica">Quimica</option>
            <option value="calculo">Calculo</option>
            <option value="geral">Geral</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Fase</span>
          <select className="select" value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value as BookPhase })}>
            <option value="base">Base</option>
            <option value="aprofundamento">Aprofundamento</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Prioridade</span>
          <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as BookPriority })}>
            <option value="essencial">Essencial</option>
            <option value="recomendado">Recomendado</option>
            <option value="opcional">Opcional</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Progresso (%)</span>
          <input className="input" type="number" min={0} max={100} value={form.progressPercent} onChange={(e) => setForm({ ...form, progressPercent: Number(e.target.value) })} />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Deck Anki padrao</span>
          <input className="input" value={form.defaultAnkiDeck} onChange={(e) => setForm({ ...form, defaultAnkiDeck: e.target.value })} />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Notas</span>
          <textarea className="textarea min-h-[120px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </label>
      </form>
    </DialogShell>
  );
}

