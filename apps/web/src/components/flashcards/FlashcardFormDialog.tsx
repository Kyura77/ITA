import { useEffect, useState, type FormEvent } from "react";
import type { Flashcard, FlashcardOrigin, FlashcardType } from "@/types/entities";
import { DialogShell } from "@/components/shared/DialogShell";

const EMPTY = {
  topicId: "",
  bookId: "",
  errorId: "",
  front: "",
  back: "",
  type: "conceito" as FlashcardType,
  origin: "manual" as FlashcardOrigin,
  ankiDeck: "ITA::Geral",
  synced: false,
};

interface FlashcardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard?: Flashcard | null;
  onSave: (payload: typeof EMPTY) => Promise<void>;
  onDelete?: (flashcard: Flashcard) => Promise<void>;
}

export function FlashcardFormDialog({ open, onOpenChange, flashcard, onSave, onDelete }: FlashcardFormDialogProps) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      flashcard
        ? {
            topicId: flashcard.topicId ?? "",
            bookId: flashcard.bookId ?? "",
            errorId: flashcard.errorId ?? "",
            front: flashcard.front,
            back: flashcard.back,
            type: flashcard.type,
            origin: flashcard.origin,
            ankiDeck: flashcard.ankiDeck,
            synced: flashcard.synced,
          }
        : EMPTY,
    );
  }, [flashcard, open]);

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
      title={flashcard ? "Editar flashcard" : "Novo flashcard"}
      description="A deduplicacao e feita por hash de frente + verso + deck."
      onClose={close}
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            {flashcard && onDelete ? (
              <button type="button" className="btn-secondary text-rose-300" onClick={() => void onDelete(flashcard).then(close)}>
                Deletar
              </button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={close}>Cancelar</button>
            <button type="submit" form="flashcard-form" className="btn-primary" disabled={saving}>Salvar</button>
          </div>
        </div>
      }
    >
      <form id="flashcard-form" className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Frente</span>
          <textarea className="textarea min-h-[100px]" value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Verso</span>
          <textarea className="textarea min-h-[140px]" value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} required />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Tipo</span>
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as FlashcardType })}>
              <option value="conceito">Conceito</option>
              <option value="formula">Formula</option>
              <option value="reacao_quimica">Reacao quimica</option>
              <option value="nomenclatura">Nomenclatura</option>
              <option value="mecanismo">Mecanismo</option>
              <option value="erro_recorrente">Erro recorrente</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Deck Anki</span>
            <input className="input" value={form.ankiDeck} onChange={(e) => setForm({ ...form, ankiDeck: e.target.value })} required />
          </label>
        </div>
      </form>
    </DialogShell>
  );
}

