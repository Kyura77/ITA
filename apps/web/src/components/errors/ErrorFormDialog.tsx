import { useEffect, useState, type FormEvent } from "react";
import type { ConceptualError, ErrorSource, GapType, Severity } from "@/types/entities";
import { DialogShell } from "@/components/shared/DialogShell";

const EMPTY = {
  date: "",
  topicId: "",
  bookId: "",
  descriptionGap: "",
  context: "",
  source: "livro_exercicio" as ErrorSource,
  gapType: "conceito_errado" as GapType,
  severity: "moderada" as Severity,
  resolved: false,
};

interface ErrorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorItem?: ConceptualError | null;
  onSave: (payload: typeof EMPTY) => Promise<void>;
  onDelete?: (item: ConceptualError) => Promise<void>;
}

export function ErrorFormDialog({ open, onOpenChange, errorItem, onSave, onDelete }: ErrorFormDialogProps) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      errorItem
        ? {
            date: errorItem.date ?? "",
            topicId: errorItem.topicId ?? "",
            bookId: errorItem.bookId ?? "",
            descriptionGap: errorItem.descriptionGap,
            context: errorItem.context,
            source: errorItem.source,
            gapType: errorItem.gapType,
            severity: errorItem.severity,
            resolved: errorItem.resolved,
          }
        : EMPTY,
    );
  }, [errorItem, open]);

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
      title={errorItem ? "Editar erro" : "Novo erro"}
      description="Use o Diario para capturar lacunas conceituais e transformar em revisao acionavel."
      onClose={close}
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            {errorItem && onDelete ? (
              <button type="button" className="btn-secondary text-rose-300" onClick={() => void onDelete(errorItem).then(close)}>
                Deletar
              </button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={close}>Cancelar</button>
            <button type="submit" form="error-form" className="btn-primary" disabled={saving}>Salvar</button>
          </div>
        </div>
      }
    >
      <form id="error-form" className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Lacuna</span>
          <input className="input" value={form.descriptionGap} onChange={(e) => setForm({ ...form, descriptionGap: e.target.value })} required />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Contexto</span>
          <textarea className="textarea min-h-[140px]" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Fonte</span>
          <select className="select" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as ErrorSource })}>
            <option value="livro_exercicio">Livro</option>
            <option value="prova_afa">Prova AFA</option>
            <option value="prova_ime">Prova IME</option>
            <option value="prova_ita">Prova ITA</option>
            <option value="simulado">Simulado</option>
            <option value="olimpiada">Olimpiada</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Tipo de falha</span>
          <select className="select" value={form.gapType} onChange={(e) => setForm({ ...form, gapType: e.target.value as GapType })}>
            <option value="conceito_errado">Conceito errado</option>
            <option value="formula_esquecida">Formula esquecida</option>
            <option value="mecanismo_nao_visto">Mecanismo nao visto</option>
            <option value="conta_incorreta">Conta incorreta</option>
            <option value="aplicacao_incompleta">Aplicacao incompleta</option>
            <option value="outro">Outro</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Severidade</span>
          <select className="select" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}>
            <option value="leve">Leve</option>
            <option value="moderada">Moderada</option>
            <option value="grave">Grave</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Data</span>
          <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </label>
      </form>
    </DialogShell>
  );
}

