import { PrismaClient } from "@prisma/client";
import { syncFlashcardsDirect, ankiRequest, buildNote } from "./anki"; // Assuming these are exported from anki.ts
import { writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

interface AnkiQueueItem {
  id: string;
  flashcards: Array<{ id: string; front: string; back: string; ankiDeck: string; type: string }>;
  attemptCount: number;
  lastAttempt: number;
}

const QUEUE_FILE = path.join(os.tmpdir(), "anki-offline-queue.json");

async function readQueue(): Promise<AnkiQueueItem[]> {
  try {
    const content = await readFile(QUEUE_FILE, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return []; // File not found, return empty queue
    }
    console.error("Error reading Anki queue file:", error);
    return [];
  }
}

async function writeQueue(queue: AnkiQueueItem[]): Promise<void> {
  await writeFile(QUEUE_FILE, JSON.stringify(queue), "utf8");
}

export async function addFlashcardsToQueue(
  flashcards: Array<{ id: string; front: string; back: string; ankiDeck: string; type: string }>,
): Promise<void> {
  const queue = await readQueue();
  queue.push({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
    flashcards,
    attemptCount: 0,
    lastAttempt: Date.now(),
  });
  await writeQueue(queue);
}

export async function processAnkiQueue(prisma: PrismaClient, settings: { ankiConnectUrl: string }): Promise<void> {
  let queue = await readQueue();
  const successfulItems: string[] = [];
  const failedItems: AnkiQueueItem[] = [];

  for (const item of queue) {
    try {
      // Attempt to sync using AnkiConnect
      const decks = [...new Set(item.flashcards.map((card) => card.ankiDeck))];
      for (const deck of decks) {
        await ankiRequest(settings, { action: "createDeck", version: 6, params: { deck } });
      }
      const response = (await ankiRequest(settings, { action: "addNotes", version: 6, params: { notes: item.flashcards.map(buildNote) } })) as { result: Array<number | null> };
      const results = Array.isArray(response.result) ? response.result : [];

      for (const [index, result] of results.entries()) {
        const card = item.flashcards[index];
        if (!card) continue;
        if (typeof result === "number") {
          await prisma.flashcard.update({ where: { id: card.id }, data: { synced: true, ankiNoteId: String(result) } });
        } else {
          // Handle duplicates or other AnkiConnect errors for individual cards
          // For now, we'll consider the whole batch successful if AnkiConnect responded
        }
      }
      successfulItems.push(item.id);
    } catch (error) {
      console.warn(`Failed to sync Anki queue item ${item.id} via AnkiConnect:`, error);
      item.attemptCount += 1;
      item.lastAttempt = Date.now();
      // Implement exponential backoff for retries, e.g., max 5 attempts
      if (item.attemptCount < 5) {
        failedItems.push(item);
      } else {
        console.error(`Anki queue item ${item.id} failed after ${item.attemptCount} attempts and will be discarded.`);
        // Optionally, log this to a persistent error log or notify admin
      }
    }
  }

  // Update the queue with only the failed items that should be retried
  await writeQueue(failedItems);
}
