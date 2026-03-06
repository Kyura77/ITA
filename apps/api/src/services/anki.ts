import type { PrismaClient } from "@prisma/client";
import { execFile } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { titleCase } from "../lib/domain";

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

function buildNote(card: { front: string; back: string; ankiDeck: string; type: string; id: string }) {
  return {
    deckName: card.ankiDeck,
    modelName: "Basic",
    fields: { Front: card.front, Back: card.back },
    options: { allowDuplicate: false, duplicateScope: "deck" },
    tags: ["ita-prep", titleCase(card.type).replace(/\s+/g, "-").toLowerCase(), card.id],
    audio: [],
    video: [],
    picture: [],
  };
}

async function fileExists(target: string | null | undefined) {
  if (!target) return false;
  try {
    await access(target, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveHelperScriptPath() {
  const candidates = [
    process.env.ANKI_SYNC_HELPER_PATH,
    path.join(process.cwd(), "apps", "api", "scripts", "anki_collection_sync.py"),
    path.join(process.cwd(), "scripts", "anki_collection_sync.py"),
    path.resolve(THIS_DIR, "../../scripts/anki_collection_sync.py"),
  ];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate as string;
    }
  }

  throw new Error("ERR_ANKI_COLLECTION_HELPER_NOT_FOUND");
}

async function resolveAnkiPythonPath() {
  const candidates = [
    process.env.ANKI_PYTHON_EXE,
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Programs", "Anki", ".venv", "Scripts", "python.exe") : null,
  ];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate as string;
    }
  }

  throw new Error("ERR_ANKI_PYTHON_NOT_FOUND");
}

async function resolveCollectionPath(): Promise<ResolvedCollection | null> {
  const envPath = process.env.ANKI_COLLECTION_PATH;
  if (await fileExists(envPath)) {
    return { collectionPath: envPath as string, profileName: path.basename(path.dirname(envPath as string)) };
  }

  const baseDir = process.env.APPDATA ? path.join(process.env.APPDATA, "Anki2") : null;
  if (!(await fileExists(baseDir))) {
    return null;
  }

  const preferredProfiles = [process.env.ANKI_PROFILE_NAME, "Usuario 1", "User 1", "Usuário 1"].filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );

  for (const profileName of preferredProfiles) {
    const candidate = path.join(baseDir as string, profileName, "collection.anki2");
    if (await fileExists(candidate)) {
      return { collectionPath: candidate, profileName };
    }
  }

  const entries = await readdir(baseDir as string, { withFileTypes: true });
  const blocked = new Set(["addons21", "logs"]);
  const candidates: ResolvedCollection[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || blocked.has(entry.name) || entry.name.startsWith(".")) continue;
    const candidate = path.join(baseDir as string, entry.name, "collection.anki2");
    if (await fileExists(candidate)) {
      candidates.push({ collectionPath: candidate, profileName: entry.name });
    }
  }

  candidates.sort((left, right) => left.profileName.localeCompare(right.profileName));
  return candidates[0] ?? null;
}

function parseHelperOutput<T>(raw: string): T {
  const line = raw
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)
    .at(-1);

  if (!line) {
    throw new Error("ERR_ANKI_COLLECTION_EMPTY_RESPONSE");
  }

  try {
    return JSON.parse(line) as T;
  } catch {
    throw new Error(`ERR_ANKI_COLLECTION_BAD_JSON:${line.slice(0, 300)}`);
  }
}

async function runCollectionHelper<T>(payload: Record<string, unknown>): Promise<T> {
  const pythonPath = await resolveAnkiPythonPath();
  const helperPath = await resolveHelperScriptPath();
  const tempPath = path.join(os.tmpdir(), `ita-anki-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);

  await writeFile(tempPath, JSON.stringify(payload), "utf8");

  try {
    const output = await new Promise<string>((resolve, reject) => {
      execFile(
        pythonPath,
        [helperPath, tempPath],
        { encoding: "utf8", timeout: 20_000, maxBuffer: 8 * 1024 * 1024 },
        (error, stdout, stderr) => {
          const combined = [stdout, stderr].filter((value): value is string => typeof value === "string" && value.trim().length > 0).join("\n").trim();
          if (error) {
            reject(new Error(combined || error.message));
            return;
          }
          resolve(combined);
        },
      );
    });

    return parseHelperOutput<T>(output);
  } finally {
    await rm(tempPath, { force: true }).catch(() => null);
  }
}

async function ankiRequest(settings: { ankiConnectUrl: string }, body: unknown) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(settings.ankiConnectUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`ERR_ANKI_HTTP_${response.status}`);
    const data = (await response.json()) as { result: unknown; error: string | null };
    if (data.error) throw new Error(data.error);
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function syncFlashcardsDirect(flashcards: Array<{ id: string; front: string; back: string; ankiDeck: string; type: string }>) {
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
      currentModel: payload.currentModel ?? null,
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "ERR_ANKI_COLLECTION_PROBE",
      collectionPath: null,
      profileName: null,
    };
  }
}

export async function proxyAnki(settings: { ankiConnectUrl: string }, body: unknown) {
  return ankiRequest(settings, body);
}

export async function syncFlashcardsWithMode(
  prisma: PrismaClient,
  settings: { ankiMode: string; ankiConnectUrl: string },
  flashcards: Array<{ id: string; front: string; back: string; ankiDeck: string; type: string }>,
) {
  if (!flashcards.length) {
    return { syncedCount: 0, duplicateCount: 0, pendingCount: 0, performed: false, errors: [] as string[], mode: settings.ankiMode === "real" ? ("real" as const) : ("stub" as const) };
  }
  if (settings.ankiMode !== "real") {
    return { syncedCount: 0, duplicateCount: 0, pendingCount: flashcards.length, performed: false, errors: ["ANKI_STUB_MODE"], mode: "stub" as const };
  }

  try {
    const decks = [...new Set(flashcards.map((card) => card.ankiDeck))];
    for (const deck of decks) {
      await ankiRequest(settings, { action: "createDeck", version: 6, params: { deck } });
    }
    const response = (await ankiRequest(settings, { action: "addNotes", version: 6, params: { notes: flashcards.map(buildNote) } })) as { result: Array<number | null> };
    const results = Array.isArray(response.result) ? response.result : [];
    let syncedCount = 0;
    let duplicateCount = 0;
    for (const [index, result] of results.entries()) {
      const card = flashcards[index];
      if (!card) continue;
      if (typeof result === "number") {
        syncedCount += 1;
        await prisma.flashcard.update({ where: { id: card.id }, data: { synced: true, ankiNoteId: String(result) } });
      } else {
        duplicateCount += 1;
      }
    }
    return { syncedCount, duplicateCount, pendingCount: Math.max(0, flashcards.length - syncedCount), performed: syncedCount > 0, errors: [] as string[], mode: "real" as const };
  } catch (ankiConnectError) {
    try {
      const directResult = await syncFlashcardsDirect(flashcards);
      const byId = new Map(flashcards.map((card) => [card.id, card]));
      let syncedCount = 0;
      let duplicateCount = 0;
      const errors: string[] = [];

      for (const item of directResult.results ?? []) {
        const card = byId.get(item.cardId);
        if (!card) continue;

        if (item.status === "added") {
          syncedCount += 1;
          await prisma.flashcard.update({ where: { id: card.id }, data: { synced: true, ankiNoteId: item.noteId == null ? null : String(item.noteId) } });
          continue;
        }

        if (item.status === "existing") {
          duplicateCount += 1;
          await prisma.flashcard.update({ where: { id: card.id }, data: { synced: true, ankiNoteId: item.noteId == null ? null : String(item.noteId) } });
          continue;
        }

        errors.push(item.error ?? `ERR_ANKI_COLLECTION_CARD_${item.cardId}`);
      }

      return {
        syncedCount,
        duplicateCount,
        pendingCount: Math.max(0, flashcards.length - syncedCount - duplicateCount),
        performed: syncedCount + duplicateCount > 0,
        errors,
        mode: "real" as const,
      };
    } catch (directError) {
      return {
        syncedCount: 0,
        duplicateCount: 0,
        pendingCount: flashcards.length,
        performed: false,
        errors: [ankiConnectError instanceof Error ? ankiConnectError.message : "ERR_ANKI_API", directError instanceof Error ? directError.message : "ERR_ANKI_COLLECTION_SYNC"],
        mode: "real" as const,
      };
    }
  }
}

export async function runAnkiSelfTest(settings: { ankiMode: string; ankiConnectUrl: string }) {
  if (settings.ankiMode !== "real") {
    return {
      ok: false,
      mode: "stub" as const,
      provider: "stub" as const,
      detail: "Anki em modo stub. Salve em real para validar a integracao.",
      responseMs: null,
      profileName: null,
      noteCount: null,
      version: null,
    };
  }

  const startedAt = Date.now();

  try {
    const payload = (await ankiRequest(settings, { action: "version", version: 6 })) as { result?: number };

    return {
      ok: true,
      mode: "real" as const,
      provider: "ankiconnect" as const,
      detail: `AnkiConnect respondeu com versao ${typeof payload.result === "number" ? payload.result : "desconhecida"}.`,
      responseMs: Date.now() - startedAt,
      profileName: null,
      noteCount: null,
      version: typeof payload.result === "number" ? payload.result : null,
    };
  } catch (error) {
    const direct = await probeAnkiCollection();

    if (direct.available) {
      const suffix = direct.profileName ? ` Perfil: ${direct.profileName}.` : "";
      return {
        ok: true,
        mode: "real" as const,
        provider: "collection" as const,
        detail: `AnkiConnect offline, mas a colecao local esta pronta para sync direto.${suffix}`,
        responseMs: Date.now() - startedAt,
        profileName: direct.profileName ?? null,
        noteCount: direct.noteCount ?? null,
        version: null,
      };
    }

    const reason = direct.error ?? (error instanceof Error ? error.message : "ERR_ANKI_OFFLINE");
    return {
      ok: false,
      mode: "real" as const,
      provider: "none" as const,
      detail: `Falha ao validar o Anki: ${reason}`,
      responseMs: Date.now() - startedAt,
      profileName: null,
      noteCount: null,
      version: null,
    };
  }
}
