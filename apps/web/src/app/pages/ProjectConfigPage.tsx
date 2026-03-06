import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileJson } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { api, ApiError } from "@/services/apiClient";
import type { ProjectConfig } from "@/types/entities";

export default function ProjectConfigPage() {
  const queryClient = useQueryClient();
  const configQuery = useQuery({ queryKey: ["project-config"], queryFn: () => api.get<ProjectConfig>("/project-config") });
  const [text, setText] = useState("{}");

  useEffect(() => {
    if (configQuery.data) setText(JSON.stringify(configQuery.data, null, 2));
  }, [configQuery.data]);

  const save = async () => {
    try {
      JSON.parse(text);
      await api.put("/project-config", { json: text });
      toast.success("Config JSON salva.");
      await queryClient.invalidateQueries({ queryKey: ["project-config"] });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "JSON invalido ou falha ao salvar.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Config JSON" subtitle="Editor do ProjectConfig com validacao de parse antes do save." icon={FileJson} actions={<button type="button" className="btn-primary" onClick={() => void save()}>Salvar</button>} />
      <section className="panel p-5">
        <textarea className="textarea min-h-[70vh] font-mono text-xs leading-6" value={text} onChange={(e) => setText(e.target.value)} />
      </section>
    </div>
  );
}
