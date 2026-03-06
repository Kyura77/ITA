import type { IntegrationProbe, IntegrationProvider } from "@/types/entities";

export type IntegrationTone = "slate" | "cyan" | "emerald" | "amber" | "rose";

export function getIntegrationTone(probe?: IntegrationProbe): IntegrationTone {
  if (!probe) return "slate";
  if (probe.mode === "stub") return probe.available ? "cyan" : "amber";
  if (probe.status === "online") return "emerald";
  return probe.status === "attention" ? "amber" : "rose";
}

export function getIntegrationValue(label: string, probe?: IntegrationProbe) {
  if (!probe) return `${label} indisponivel`;
  if (probe.mode === "stub") return `${label} stub`;
  if (probe.status === "online") return `${label} online`;
  if (probe.status === "attention") return `${label} ajuste`;
  return `${label} offline`;
}

export function getIntegrationProviderLabel(provider?: IntegrationProvider) {
  switch (provider) {
    case "ollama":
      return "Ollama";
    case "ankiconnect":
      return "AnkiConnect";
    case "collection":
      return "Colecao local";
    case "stub":
      return "Stub";
    default:
      return "Indefinido";
  }
}

export function formatIntegrationLatency(responseMs?: number | null) {
  if (responseMs == null) return "n/d";
  return `${responseMs} ms`;
}
