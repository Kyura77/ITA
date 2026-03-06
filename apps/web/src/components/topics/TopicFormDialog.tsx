import { useEffect, useState, type FormEvent } from "react";
import type { Topic, Subject, TopicPriority, TopicStatus } from "@/types/entities";
import { DialogShell } from "@/components/shared/DialogShell";

const EMPTY = {
  subject: "matematica" as Subject,
  area: "",
  topic: "",
  subtopic: "",
  bookBaseId: "",
  bookAdvancedId: "",
  status: "nao_iniciado" as TopicStatus,
  yearPlan: 1 as 1 | 2 | 3,
  priorityIta: "media" as TopicPriority,
  startDate: "",
  lastReviewedAt: "",
  totalStudyMinutes: 0,
  forOlympiad: false,
  ankiDeck: "",
  notes: "",
  prerequisites: "",
};

interface TopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic?: Topic | null;
  onSave: (payload: typeof EMPTY) => Promise<void>;
  onDelete?: (topic: Topic) => Promise<void>;
}

export function TopicFormDialog({ open, onOpenChange, topic, onSave, onDelete }: TopicFormDialogProps) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      topic
        ? {
            subject: topic.subject,
            area: topic.area,
            topic: topic.topic,
            subtopic: topic.subtopic ?? "",
            bookBaseId: topic.bookBaseId ?? "",
            bookAdvancedId: topic.bookAdvancedId ?? "",
            status: topic.status,
            yearPlan: topic.yearPlan,
            priorityIta: topic.priorityIta,
            startDate: topic.startDate ?? "",
            lastReviewedAt: topic.lastReviewedAt ?? "",
            totalStudyMinutes: topic.totalStudyMinutes,
            forOlympiad: topic.forOlympiad,
            ankiDeck: topic.ankiDeck ?? "",
            notes: topic.notes ?? "",
            prerequisites: topic.prerequisites ?? "",
          }
        : EMPTY,
    );
  }, [topic, open]);

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
      title={topic ? "Editar topico" : "Novo topico"}
      description="Edicao sempre liberada em qualquer status. O botao Avancar aplica as regras de negocio."
      onClose={close}
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            {topic && onDelete ? (
              <button type="button" className="btn-secondary text-rose-300" onClick={() => void onDelete(topic).then(close)}>
                Deletar
              </button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={close}>Cancelar</button>
            <button type="submit" form="topic-form" className="btn-primary" disabled={saving}>Salvar</button>
          </div>
        </div>
      }
    >
      <form id="topic-form" className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
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
          <span className="text-sm text-slate-300">Ano do plano</span>
          <select className="select" value={form.yearPlan} onChange={(e) => setForm({ ...form, yearPlan: Number(e.target.value) as 1 | 2 | 3 })}>
            <option value={1}>Ano 1</option>
            <option value={2}>Ano 2</option>
            <option value={3}>Ano 3</option>
          </select>
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Area</span>
          <input className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Topico</span>
          <input className="input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Subtopico</span>
          <input className="input" value={form.subtopic} onChange={(e) => setForm({ ...form, subtopic: e.target.value })} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Status</span>
          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TopicStatus })}>
            <option value="nao_iniciado">Nao iniciado</option>
            <option value="em_andamento">Em andamento</option>
            <option value="base_concluida">Base concluida</option>
            <option value="aprofundando">Aprofundando</option>
            <option value="dominado">Dominado</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Prioridade ITA</span>
          <select className="select" value={form.priorityIta} onChange={(e) => setForm({ ...form, priorityIta: e.target.value as TopicPriority })}>
            <option value="baixa">Baixa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Critica</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Deck Anki</span>
          <input className="input" value={form.ankiDeck} onChange={(e) => setForm({ ...form, ankiDeck: e.target.value })} />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-slate-300">Notas</span>
          <textarea className="textarea min-h-[120px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </label>
      </form>
    </DialogShell>
  );
}

