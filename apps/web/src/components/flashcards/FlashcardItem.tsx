import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { Flashcard } from "@/types/entities";
import { humanizeEnum, truncateText } from "@/lib/labels";

interface FlashcardItemProps {
  flashcard: Flashcard;
  onEdit: (card: Flashcard) => void;
  onDelete: (card: Flashcard) => void;
}

export function FlashcardItem({ flashcard, onEdit, onDelete }: FlashcardItemProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article className="panel p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="badge">{humanizeEnum(flashcard.type)}</span>
          <span className="badge">{flashcard.synced ? "Sincronizado" : "Local"}</span>
          <span className="badge">{flashcard.ankiDeck}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost" onClick={() => onEdit(flashcard)}><Pencil className="h-4 w-4" /></button>
          <button type="button" className="btn-ghost" onClick={() => onDelete(flashcard)}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <button type="button" className="w-full text-left" onClick={() => setFlipped((current) => !current)}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45 }} className="relative h-56 rounded-2xl border border-slate-800 bg-slate-950/70 p-5" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 p-5" style={{ backfaceVisibility: "hidden" }}>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Frente</p>
            <p className="mt-4 text-base font-semibold text-slate-100">{truncateText(flashcard.front, 180)}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-slate-500">Clique para virar</p>
          </div>
          <div className="absolute inset-0 p-5" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Verso</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">{flashcard.back}</p>
          </div>
        </motion.div>
      </button>

      <div className="mt-3 rounded-2xl border border-white/5 bg-slate-950/35 px-4 py-3 text-sm text-slate-400">
        <p>Origem: {humanizeEnum(flashcard.origin)}</p>
        <p className="mt-1">Note ID: {flashcard.ankiNoteId ?? "-"}</p>
      </div>
    </article>
  );
}
