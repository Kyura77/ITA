import { useEffect, useState, type FormEvent } from "react";
import type { Exam, ExamBoard, ExamStatus } from "@/types/entities";
import { DialogShell } from "@/components/shared/DialogShell";

const EMPTY = {
  name: "",
  board: "ITA_1fase" as ExamBoard,
  year: new Date().getFullYear(),
  dateReal: "",
  timeAvailableMin: 300,
  timeUsedMin: 0,
  score: 0,
  scoreMax: 100,
  status: "planejada" as ExamStatus,
  notes: "",
};

interface ExamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam?: Exam | null;
  onSave: (payload: typeof EMPTY) => Promise<void>;
  onDelete?: (exam: Exam) => Promise<void>;
}

export function ExamFormDialog({ open, onOpenChange, exam, onSave, onDelete }: ExamFormDialogProps) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      exam
        ? {
            name: exam.name,
            board: exam.board,
            year: exam.year,
            dateReal: exam.dateReal ?? "",
            timeAvailableMin: exam.timeAvailableMin ?? 300,
            timeUsedMin: exam.timeUsedMin ?? 0,
            score: exam.score ?? 0,
            scoreMax: exam.scoreMax ?? 100,
            status: exam.status,
            notes: exam.notes ?? "",
          }
        : EMPTY,
    );
  }, [exam, open]);

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
      title={exam ? "Editar prova" : "Nova prova"}
      description="Percentuais e regua recomendada sao recalculados no backend."
      onClose={close}
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            {exam && onDelete ? (
              <button type="button" className="btn-secondary text-rose-300" onClick={() => void onDelete(exam).then(close)}>Deletar</button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={close}>Cancelar</button>
            <button type="submit" form="exam-form" className="btn-primary" disabled={saving}>Salvar</button>
          </div>
        </div>
      }
    >
      <form id="exam-form" className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Nome</span>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Banca</span>
          <select className="select" value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value as ExamBoard })}>
            <option value="AFA">AFA</option>
            <option value="IME_1fase">IME 1a fase</option>
            <option value="IME_2fase">IME 2a fase</option>
            <option value="ITA_1fase">ITA 1a fase</option>
            <option value="ITA_2fase">ITA 2a fase</option>
            <option value="FUVEST">FUVEST</option>
            <option value="UNICAMP">UNICAMP</option>
            <option value="OBMEP">OBMEP</option>
            <option value="OBF">OBF</option>
            <option value="OBQ">OBQ</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Ano</span>
          <input className="input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Data</span>
          <input className="input" type="date" value={form.dateReal} onChange={(e) => setForm({ ...form, dateReal: e.target.value })} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Status</span>
          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ExamStatus })}>
            <option value="planejada">Planejada</option>
            <option value="realizada">Realizada</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Tempo disponivel (min)</span>
          <input className="input" type="number" value={form.timeAvailableMin} onChange={(e) => setForm({ ...form, timeAvailableMin: Number(e.target.value) })} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Tempo usado (min)</span>
          <input className="input" type="number" value={form.timeUsedMin} onChange={(e) => setForm({ ...form, timeUsedMin: Number(e.target.value) })} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Nota</span>
          <input className="input" type="number" value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Nota maxima</span>
          <input className="input" type="number" value={form.scoreMax} onChange={(e) => setForm({ ...form, scoreMax: Number(e.target.value) })} />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Notas</span>
          <textarea className="textarea min-h-[120px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </label>
      </form>
    </DialogShell>
  );
}

