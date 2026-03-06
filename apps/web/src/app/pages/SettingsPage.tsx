import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FolderOpen, RefreshCw, Settings as SettingsIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusPill } from "@/components/shared/StatusPill";
import { useTheme } from "@/hooks/useTheme";
import { formatIntegrationLatency, getIntegrationProviderLabel, getIntegrationTone, getIntegrationValue } from "@/lib/integrations";
import { getDesktopBridge, isDesktopRuntime, openDesktopFolder } from "@/lib/runtime";
import { api, ApiError } from "@/services/apiClient";
import type { AppSettings, ExportPayload, IntegrationSelfTest, IntegrationStatus } from "@/types/entities";

function KeyValue({ label, value, children }: { label: string; value?: ReactNode; children?: ReactNode }) {
  return <div className="rounded-2xl border border-white/5 bg-slate-950/35 px-4 py-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p><div className="mt-2 text-sm text-slate-200">{value ?? children}</div></div>;
}

function IntegrationCard({ title, subtitle, status, children, footer }: { title: string; subtitle: string; status: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return <section className="panel p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="max-w-2xl"><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">integracao</p><h2 className="mt-2 text-2xl font-semibold text-slate-100">{title}</h2><p className="mt-2 text-sm text-slate-400">{subtitle}</p></div>{status}</div><div className="mt-6 grid gap-4">{children}</div>{footer ? <div className="mt-5">{footer}</div> : null}</section>;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setTheme } = useTheme();
  const desktop = isDesktopRuntime();
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: () => api.get<AppSettings>("/settings") });
  const integrationQuery = useQuery({ queryKey: ["integrations-status"], queryFn: () => api.get<IntegrationStatus>("/integrations/status") });
  const [form, setForm] = useState<AppSettings | null>(null);
  const [runtimeMeta, setRuntimeMeta] = useState<{ isDesktop: boolean; appVersion?: string; platform?: string } | null>(null);
  const [selfTest, setSelfTest] = useState<IntegrationSelfTest | null>(null);
  const [testing, setTesting] = useState<"all" | null>(null);

  useEffect(() => { if (settingsQuery.data) setForm(settingsQuery.data); }, [settingsQuery.data]);
  useEffect(() => { const bridge = getDesktopBridge(); if (!bridge?.getMeta) return; bridge.getMeta().then(setRuntimeMeta).catch(() => null); }, []);

  const aiProbe = integrationQuery.data?.ai;
  const ankiProbe = integrationQuery.data?.anki;
  const aiWarning = form?.aiMode === "real" && aiProbe?.available === false;
  const ankiWarning = form?.ankiMode === "real" && ankiProbe?.available === false;
  const runtimeLabel = runtimeMeta?.isDesktop || desktop ? "desktop" : "browser";
  const runtimeSubtitle = useMemo(() => {
    const base = runtimeLabel === "desktop" ? "O app abre no proprio dispositivo e sobe a API local sozinho." : "Modo navegador ligado no backend local via localhost.";
    if (!runtimeMeta?.platform) return base;
    return `${base} Plataforma: ${runtimeMeta.platform}.`;
  }, [runtimeLabel, runtimeMeta?.platform]);

  const revalidate = async () => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: ["settings"] }), queryClient.invalidateQueries({ queryKey: ["integrations-status"] })]);
  };

  const save = async () => {
    if (!form) return;
    try {
      const saved = await api.put<AppSettings>("/settings", form);
      setTheme(saved.theme);
      toast.success("Configuracoes salvas.");
      await revalidate();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao salvar configuracoes.");
    }
  };

  const exportBackup = async () => {
    try {
      const payload = await api.get<ExportPayload>("/export");
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      anchor.href = url;
      anchor.download = `ita-prep-backup-${date}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Backup exportado.");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao exportar backup.");
    }
  };

  const importBackup = async (file?: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const confirmed = window.confirm("Importar este backup sobrescreve dados existentes por id. Deseja continuar?");
      if (!confirmed) return;
      await api.post("/import", parsed);
      toast.success("Backup importado.");
      await Promise.all([["books"],["topics"],["errors"],["flashcards"],["exams"],["study-sessions"],["olympiads"],["feynman-sessions"],["settings"],["project-config"],["integrations-status"]].map((key) => queryClient.invalidateQueries({ queryKey: key })));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao importar backup.");
    }
  };

  const runSelfTest = async () => {
    try {
      setTesting("all");
      const result = await api.post<IntegrationSelfTest>("/integrations/self-test");
      setSelfTest(result);
      toast.success("Autodiagnostico concluido.");
      await queryClient.invalidateQueries({ queryKey: ["integrations-status"] });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao rodar o autodiagnostico.");
    } finally {
      setTesting(null);
    }
  };

  const openFolder = async (kind: "project" | "anki") => {
    const opened = await openDesktopFolder(kind);
    if (!opened) toast("Esse atalho so existe no app desktop.");
  };

  if (settingsQuery.isLoading && !form) return <LoadingState title="Abrindo configuracoes" description="Lendo tema, pomodoros, flags de integracao e diagnostico local." />;
  if (settingsQuery.isError && !form) return <ErrorState title="Falha ao abrir configuracoes" description={settingsQuery.error instanceof Error ? settingsQuery.error.message : "A leitura local falhou."} action={<button type="button" className="btn-primary" onClick={() => void settingsQuery.refetch()}>Tentar novamente</button>} />;
  if (!form) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Configuracoes" subtitle="Aqui fica a separacao entre o que esta salvo no app e o que esta realmente operacional no dispositivo. O objetivo e cortar qualquer ambiguidade sobre Ollama e Anki." icon={SettingsIcon} actions={<><button type="button" className="btn-secondary" onClick={() => void revalidate()}><RefreshCw className="h-4 w-4" />Revalidar</button><button type="button" className="btn-secondary" onClick={() => void runSelfTest()} disabled={testing === "all"}>{testing === "all" ? "Testando..." : "Rodar autodiagnostico"}</button><button type="button" className="btn-primary" onClick={() => void save()}>Salvar configuracoes</button></>} />
      <div className="grid gap-3 md:grid-cols-4"><StatusPill label="Runtime" value={runtimeLabel} tone="slate" detail={runtimeSubtitle} /><StatusPill label="IA" value={getIntegrationValue("Ollama", aiProbe)} tone={getIntegrationTone(aiProbe)} detail={aiProbe?.detail} /><StatusPill label="Anki" value={getIntegrationValue("Anki", ankiProbe)} tone={getIntegrationTone(ankiProbe)} detail={ankiProbe?.detail} /><StatusPill label="Seed" value={form.seeded ? "base pronta" : "base vazia"} tone={form.seeded ? "emerald" : "amber"} /></div>
      <section className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]"><div className="panel p-6"><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">aplicacao</p><h2 className="mt-2 text-2xl font-semibold text-slate-100">Tema e ritmo</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="grid gap-2"><span className="text-sm text-slate-300">Tema</span><select className="select" value={form.theme} onChange={(event) => setForm({ ...form, theme: event.target.value as AppSettings["theme"] })}><option value="dark">Escuro</option><option value="light">Claro</option></select></label><label className="grid gap-2"><span className="text-sm text-slate-300">Pomodoro work</span><input className="input" type="number" value={form.pomodoroWork} onChange={(event) => setForm({ ...form, pomodoroWork: Number(event.target.value) })} /></label><label className="grid gap-2"><span className="text-sm text-slate-300">Pomodoro break</span><input className="input" type="number" value={form.pomodoroBreak} onChange={(event) => setForm({ ...form, pomodoroBreak: Number(event.target.value) })} /></label><label className="grid gap-2"><span className="text-sm text-slate-300">Long break</span><input className="input" type="number" value={form.pomodoroLongBreak} onChange={(event) => setForm({ ...form, pomodoroLongBreak: Number(event.target.value) })} /></label><label className="grid gap-2"><span className="text-sm text-slate-300">Sets antes do long break</span><input className="input" type="number" value={form.pomodoroSetsBeforeLong} onChange={(event) => setForm({ ...form, pomodoroSetsBeforeLong: Number(event.target.value) })} /></label></div></div><section className="panel p-6"><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">runtime</p><h2 className="mt-2 text-2xl font-semibold text-slate-100">Desktop e backup</h2><p className="mt-2 text-sm text-slate-400">{runtimeSubtitle}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><KeyValue label="Versao">{runtimeMeta?.appVersion ?? "dev"}</KeyValue><KeyValue label="Plataforma">{runtimeMeta?.platform ?? "desconhecida"}</KeyValue></div><div className="mt-5 flex flex-wrap gap-3"><button type="button" className="btn-secondary" onClick={() => void exportBackup()}><Download className="h-4 w-4" />Exportar backup</button><button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" />Importar backup</button>{desktop ? <button type="button" className="btn-secondary" onClick={() => void openFolder("project")}><FolderOpen className="h-4 w-4" />Pasta do projeto</button> : null}{desktop ? <button type="button" className="btn-secondary" onClick={() => void openFolder("anki")}><FolderOpen className="h-4 w-4" />Pasta do Anki</button> : null}</div><input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(event) => void importBackup(event.target.files?.[0] ?? null)} /></section></section>
      <section className="grid gap-4 xl:grid-cols-2"><IntegrationCard title="IA local" subtitle="Ollama precisa responder, ter o modelo salvo e ainda passar em um teste real de inferencia para a experiencia ficar confiavel." status={<StatusPill label="IA" value={getIntegrationValue("Ollama", aiProbe)} tone={getIntegrationTone(aiProbe)} detail={aiProbe?.detail} compact />} footer={aiWarning ? <div className="glass-strip p-4 text-sm text-amber-100">IA esta em modo real, mas o Ollama ainda nao foi validado. O app vai cair em fallback local quando necessario.</div> : null}><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2"><span className="text-sm text-slate-300">Modo</span><select className="select" value={form.aiMode} onChange={(event) => setForm({ ...form, aiMode: event.target.value as AppSettings["aiMode"] })}><option value="stub">Stub</option><option value="real">Real</option></select></label><label className="grid gap-2"><span className="text-sm text-slate-300">Modelo</span><input className="input" value={form.ollamaModel} onChange={(event) => setForm({ ...form, ollamaModel: event.target.value })} /></label><label className="grid gap-2 md:col-span-2"><span className="text-sm text-slate-300">Ollama URL</span><input className="input" value={form.ollamaUrl} onChange={(event) => setForm({ ...form, ollamaUrl: event.target.value })} /></label></div><div className="grid gap-3 md:grid-cols-3"><KeyValue label="Provider">{getIntegrationProviderLabel(aiProbe?.provider)}</KeyValue><KeyValue label="Latencia">{formatIntegrationLatency(aiProbe?.responseMs)}</KeyValue><KeyValue label="Modelo instalado">{aiProbe?.modelInstalled ? "sim" : "nao"}</KeyValue></div><div className="glass-strip p-4 text-sm text-slate-200">{aiProbe?.detail ?? "Sem diagnostico ainda."}</div>{selfTest ? <div className="glass-strip p-4 text-sm text-slate-200"><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">ultimo teste</p><p className="mt-2">{selfTest.ai.detail}</p>{selfTest.ai.sample ? <p className="mt-2 text-xs text-slate-400">Resposta: {selfTest.ai.sample}</p> : null}</div> : null}</IntegrationCard><IntegrationCard title="Anki" subtitle="O app tenta AnkiConnect primeiro. Se ele estiver fora, ainda pode usar a colecao local para manter o sync real vivo." status={<StatusPill label="Anki" value={getIntegrationValue("Anki", ankiProbe)} tone={getIntegrationTone(ankiProbe)} detail={ankiProbe?.detail} compact />} footer={ankiWarning ? <div className="glass-strip p-4 text-sm text-amber-100">Anki esta em modo real, mas nem AnkiConnect nem a colecao local foram validados. O sync real fica indisponivel.</div> : null}><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2"><span className="text-sm text-slate-300">Modo</span><select className="select" value={form.ankiMode} onChange={(event) => setForm({ ...form, ankiMode: event.target.value as AppSettings["ankiMode"] })}><option value="stub">Stub</option><option value="real">Real</option></select></label><label className="grid gap-2 md:col-span-2"><span className="text-sm text-slate-300">AnkiConnect URL</span><input className="input" value={form.ankiConnectUrl} onChange={(event) => setForm({ ...form, ankiConnectUrl: event.target.value })} /></label></div><div className="grid gap-3 md:grid-cols-4"><KeyValue label="Provider">{getIntegrationProviderLabel(ankiProbe?.provider)}</KeyValue><KeyValue label="Latencia">{formatIntegrationLatency(ankiProbe?.responseMs)}</KeyValue><KeyValue label="Perfil">{ankiProbe?.profileName ?? "-"}</KeyValue><KeyValue label="Notas">{ankiProbe?.noteCount ?? "-"}</KeyValue></div><div className="glass-strip p-4 text-sm text-slate-200">{ankiProbe?.detail ?? "Sem diagnostico ainda."}</div>{selfTest ? <div className="glass-strip p-4 text-sm text-slate-200"><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">ultimo teste</p><p className="mt-2">{selfTest.anki.detail}</p><p className="mt-2 text-xs text-slate-400">Pendentes para sync: {selfTest.anki.pendingCount ?? "-"}</p></div> : null}</IntegrationCard></section>
    </div>
  );
}

