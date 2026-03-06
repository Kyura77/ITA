import { execFile } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { titleCase } from "../lib/domain";
import { addFlashcardsToQueue, processAnkiQueue } from "./ankiQueue";

type DirectCollectionProbe = {
  ok: boolean;
  error?: string;
  collectionPath?: string;
  profileName?: string;
  noteCount?: number;
  currentModel?: string | null;
};

type DirectCollectionItem = {
  cardId: string;
  noteId: number | null;
  status: "added" | "existing" | "error";
  error?: string;
};

type DirectCollectionSync = {
  ok: boolean;
  error?: string;
  collectionPath?: string;
  profileName?: string;
  results?: DirectCollectionItem[];
};

type ResolvedCollection = { collectionPath: string; profileName: string };

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));

export function buildNote(card: { front: string; back: string; ankiDeck: string; type: string; id: string }) {
  return {
    deckName: card.ankiDeck,
    modelName: "Basic", // Assuming 'Basic' model is always used as per AnkiConnect default
    fields: { Front: card.front, Back: card.back },
    options: { allowDuplicate: false, duplicateScope: "deck" },
    tags: ["ita-prep", titleCase(card.type).replace(/\s+/g, "-").toLowerCase(), card.id],
    audio: [],
    video: [],
    picture: [],
  };
}

async function resolveCollectionPath(): Promise<ResolvedCollection | null> {
  const homeDir = os.homedir();
  const ankiDir = path.join(homeDir, "Anki2");

  try {
    await access(ankiDir, fsConstants.R_OK);
  } catch {
    return null;
  }

  const profiles = await readdir(ankiDir);
  const userProfile = profiles.find((p) => p !== "addons21" && p !== "backups");

  if (!userProfile) {
    return null;
  }

  const collectionPath = path.join(ankiDir, userProfile, "collection.anki2");

  try {
    await access(collectionPath, fsConstants.R_OK);
    return { collectionPath, profileName: userProfile };
  } catch {
    return null;
  }
}

async function runCollectionHelper<T>(payload: unknown): Promise<T> {
  const scriptPath = path.join(THIS_DIR, "..", "scripts", "anki_collection_sync.py");

  return new Promise((resolve, reject) => {
    const process = execFile("python3", [scriptPath], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Script error: ${stderr || error.message}`));
        return;
      }

      try {
        const result = JSON.parse(stdout) as T;
        resolve(result);
      } catch {
        reject(new Error(`Invalid JSON response: ${stdout}`));
      }
    });

    process.stdin?.write(JSON.stringify(payload));
    process.stdin?.end();
  });
}

export async function ankiRequest(settings: { ankiConnectUrl: string }, body: unknown) {
  const timeout = setTimeout(() => {
    throw new Error("AnkiConnect timeout after 30s");
  }, 30_000);

  try {
    const response = await fetch(settings.ankiConnectUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`AnkiConnect returned ${response.status}`);
    }

    const data = (await response.json()) as { result: unknown; error: string | null };
    if (data.error) throw new Error(data.error);
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function syncFlashcardsDirect(flashcards: Array<{ id: string; front: string; back: string; ankiDeck: string; type: string }>) {
  const resolved = await resolveCollectionPath();
  if (!resolved) {
    throw new Error("ERR_ANKI_COLLECTION_NOT_FOUND");
  }

  const payload = await runCollectionHelper<DirectCollectionSync>({
    action: "sync",
    collectionPath: resolved.collectionPath,
    cards: flashcards.map((card) => ({
      cardId: card.id,
      front: card.front,
      back: card.back,
      deckName: card.ankiDeck,
      type: card.type,
    })),
  });

  if (!payload.ok) {
    throw new Error(payload.error ?? "ERR_ANKI_COLLECTION_SYNC");
  }

  return payload;
}

export async function probeAnkiCollection() {
  try {
    const resolved = await resolveCollectionPath();
    if (!resolved) {
      return { available: false, error: "ERR_ANKI_COLLECTION_NOT_FOUND", collectionPath: null, profileName: null };
    }

    const payload = await runCollectionHelper<DirectCollectionProbe>({
      action: "probe",
      collectionPath: resolved.collectionPath,
    });

    if (!payload.ok) {
      return {
        available: false,
        error: payload.error ?? "ERR_ANKI_COLLECTION_PROBE",
        collectionPath: payload.collectionPath ?? resolved.collectionPath,
        profileName: payload.profileName ?? resolved.profileName,
      };
    }

    return {
      available: true,
      error: null,
      collectionPath: payload.collectionPath ?? resolved.collectionPath,
      profileName: payload.profileName ?? resolved.profileName,
      noteCount: payload.noteCount ?? null,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "ERR_ANKI_COLLECTION_PROBE";
    return { available: false, error: reason, collectionPath: null, profileName: null };
  }
}

export async function proxyAnki(settings: { ankiConnectUrl: string }, body: unknown) {
  return ankiRequest(settings, body);
}

export async function syncFlashcardsWithMode(
  mode: string,
  settings: { ankiConnectUrl: string },
  flashcards: Array<{ id: string; front: string; back: string; ankiDeck: string; type: string }>,
) {
  if (mode !== "real") {
    return { syncedCount: 0, duplicateCount: 0, pendingCount: flashcards.length, performed: false, errors: [], mode: "stub" as const };
  }

  try {
    const response = await ankiRequest(settings, {
      action: "addNotes",
      notes: flashcards.map((card) => buildNote(card)),
    });

    if (Array.isArray(response.result)) {
      const syncedCount = response.result.filter((id) => id !== null).length;
      const duplicateCount = response.result.filter((id) => id === null).length;

      return {
        syncedCount,
        duplicateCount,
        pendingCount: 0,
        performed: true,
        errors: [],
        mode: "real" as const,
      };
    }

    throw new Error("Invalid response from AnkiConnect");
  } catch (error) {
    const reason = error instanceof Error ? error.message : "ERR_ANKI_SYNC";
    await addFlashcardsToQueue(flashcards);

    return {
      syncedCount: 0,
      duplicateCount: 0,
      pendingCount: flashcards.length,
      performed: false,
      errors: [reason],
      mode: "real" as const,
    };
  }
}

export async function startAnkiQueueProcessor(prisma: unknown, settings: { ankiConnectUrl: string }) {
  // Placeholder for queue processor
  if (prisma) {
    await processAnkiQueue(prisma as any, settings);
  }
}

export async function runAnkiSelfTest(settings: { ankiMode: string; ankiConnectUrl: string }) {
  if (settings.ankiMode !== "real") {
    return {
      ok: false,
      mode: "stub" as const,
      method: "stub" as const,
      detail: "Anki em modo stub. Salve em real para validar a conexao.",
      deckCount: null,
      responseMs: null,
    };
  }

  const startedAt = Date.now();

  try {
    const response = await ankiRequest(settings, { action: "deckNames" });

    if (Array.isArray(response.result) && response.result.length > 0) {
      return {
        ok: true,
        mode: "real" as const,
        method: "ankiconnect" as const,
        detail: `AnkiConnect respondeu com ${response.result.length} baralhos.`,
        deckCount: response.result.length,
        responseMs: Date.now() - startedAt,
      };
    }

    return {
      ok: false,
      mode: "real" as const,
      method: "ankiconnect" as const,
      detail: "AnkiConnect nao devolveu baralhos no teste.",
      deckCount: null,
      responseMs: Date.now() - startedAt,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "ERR_ANKI_OFFLINE";

    return {
      ok: false,
      mode: "real" as const,
      method: "ankiconnect" as const,
      detail: `Falha no teste de conexao: ${reason}`,
      deckCount: null,
      responseMs: Date.now() - startedAt,
    };
  }
}
