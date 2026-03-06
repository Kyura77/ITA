import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/apiClient";
const KEYS = [["books"],["topics"],["errors"],["flashcards"],["exams"],["study-sessions"],["olympiads"],["feynman-sessions"],["settings"],["project-config"],["integrations-status"]] as const;
export function useSeed() {
  const queryClient = useQueryClient();
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState<boolean | null>(null);
  const runSeed = useCallback(async () => {
    try { setSeeding(true); await api.post("/seed/run"); await Promise.all(KEYS.map((key) => queryClient.invalidateQueries({ queryKey: key }))); setSeeded(true); }
    catch { setSeeded(false); throw new Error("Falha ao rodar o seed inicial."); }
    finally { setSeeding(false); }
  }, [queryClient]);
  return { seeding, seeded, runSeed };
}
