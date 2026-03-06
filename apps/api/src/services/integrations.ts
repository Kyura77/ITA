import { probeAnkiCollection } from "./anki";

type IntegrationMode = "stub" | "real";
type IntegrationProvider = "stub" | "ollama" | "ankiconnect" | "collection" | "none";

interface IntegrationSettings {
  aiMode: IntegrationMode;
  ankiMode: IntegrationMode;
  ollamaUrl: string;
  ollamaModel: string;
  ankiConnectUrl: string;
}

export interface IntegrationProbe {
  mode: IntegrationMode;
  available: boolean;
  status: "online" | "offline" | "attention";
  url: string;
  detail: string;
  responseMs: number | null;
  provider: IntegrationProvider;
  model?: string | null;
  modelInstalled?: boolean;
  version?: number | null;
  profileName?: string | null;
  noteCount?: number | null;
}

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = 4_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function probeOllama(settings: IntegrationSettings): Promise<IntegrationProbe> {
  const baseUrl = settings.ollamaUrl.replace(/\/$/, "");
  const startedAt = Date.now();

  try {
    const response = await fetchWithTimeout(`${baseUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`ERR_OLLAMA_HTTP_${response.status}`);
    }

    const payload = (await response.json()) as {
      models?: Array<{ name?: string; model?: string }>;
    };

    const availableModels = (payload.models ?? []).flatMap((item) =>
      [item.name, item.model].filter((value): value is string => typeof value === "string" && value.trim().length > 0),
    );

    const modelInstalled = availableModels.includes(settings.ollamaModel);

    return {
      mode: settings.aiMode,
      available: modelInstalled,
      status: modelInstalled ? "online" : "attention",
      url: settings.ollamaUrl,
      detail: modelInstalled
        ? settings.aiMode === "real"
          ? `Ollama respondeu e o modelo ${settings.ollamaModel} esta pronto para uso real.`
          : "Ollama respondeu, mas a IA do app continua em modo stub."
        : `Ollama respondeu, mas o modelo ${settings.ollamaModel} nao foi encontrado.`,
      responseMs: Date.now() - startedAt,
      provider: "ollama",
      model: settings.ollamaModel,
      modelInstalled,
      profileName: null,
      noteCount: null,
    };
  } catch {
    return {
      mode: settings.aiMode,
      available: false,
      status: "offline",
      url: settings.ollamaUrl,
      detail: `Nao foi possivel acessar o Ollama em ${settings.ollamaUrl}.`,
      responseMs: Date.now() - startedAt,
      provider: "ollama",
      model: settings.ollamaModel,
      modelInstalled: false,
      profileName: null,
      noteCount: null,
    };
  }
}

async function probeAnki(settings: IntegrationSettings): Promise<IntegrationProbe> {
  const startedAt = Date.now();

  try {
    const response = await fetchWithTimeout(settings.ankiConnectUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "version", version: 6 }),
    });

    if (!response.ok) {
      throw new Error(`ERR_ANKI_HTTP_${response.status}`);
    }

    const payload = (await response.json()) as { result?: number; error?: string | null };
    if (payload.error) {
      throw new Error(payload.error);
    }

    return {
      mode: settings.ankiMode,
      available: true,
      status: "online",
      url: settings.ankiConnectUrl,
      detail:
        settings.ankiMode === "real"
          ? "AnkiConnect respondeu e esta pronto para sincronizacao real."
          : "AnkiConnect respondeu, mas o app continua em modo stub.",
      responseMs: Date.now() - startedAt,
      provider: "ankiconnect",
      version: typeof payload.result === "number" ? payload.result : null,
      profileName: null,
      noteCount: null,
    };
  } catch {
    const direct = await probeAnkiCollection();

    if (direct.available && direct.collectionPath) {
      return {
        mode: settings.ankiMode,
        available: true,
        status: "online",
        url: direct.collectionPath,
        detail:
          settings.ankiMode === "real"
            ? `AnkiConnect offline, mas a colecao local${direct.profileName ? ` (${direct.profileName})` : ""} esta pronta para sync direto.`
            : `Colecao local${direct.profileName ? ` (${direct.profileName})` : ""} detectada, mas o app continua em modo stub.`,
        responseMs: Date.now() - startedAt,
        provider: "collection",
        version: null,
        profileName: direct.profileName ?? null,
        noteCount: direct.noteCount ?? null,
      };
    }

    return {
      mode: settings.ankiMode,
      available: false,
      status: "offline",
      url: settings.ankiConnectUrl,
      detail: direct.error
        ? `AnkiConnect indisponivel e o fallback da colecao falhou: ${direct.error}`
        : `Nao foi possivel acessar o AnkiConnect em ${settings.ankiConnectUrl}.`,
      responseMs: Date.now() - startedAt,
      provider: "none",
      version: null,
      profileName: null,
      noteCount: null,
    };
  }
}

export async function getIntegrationStatus(settings: IntegrationSettings) {
  const [ai, anki] = await Promise.all([probeOllama(settings), probeAnki(settings)]);
  return { checkedAt: new Date().toISOString(), ai, anki };
}
