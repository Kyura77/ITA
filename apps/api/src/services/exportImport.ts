import type { PrismaClient } from "@prisma/client";
import {
  computeBookStatus,
  computeExamPercents,
  djb2Hash,
  ensureJsonString,
  getDefaultProjectConfig,
  getDefaultSettings,
  getRecommendedExamPeriodStartYear,
  parseStoredJson,
} from "../lib/domain";

export async function exportBackup(prisma: PrismaClient) {
  const [books, topics, errors, flashcards, exams, studySessions, olympiads, feynmanSessions, appSettings, projectConfig] = await Promise.all([
    prisma.book.findMany({ orderBy: { title: "asc" } }),
    prisma.topic.findMany({ orderBy: [{ subject: "asc" }, { area: "asc" }, { topic: "asc" }] }),
    prisma.conceptualError.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.flashcard.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.exam.findMany({ orderBy: [{ year: "desc" }, { name: "asc" }] }),
    prisma.studySession.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.olympiad.findMany({ orderBy: [{ year: "desc" }, { name: "asc" }] }),
    prisma.feynmanSession.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.appSettings.findUnique({ where: { id: "app-settings" } }),
    prisma.projectConfig.findUnique({ where: { id: "project-config" } }),
  ]);

  return {
    meta: { exportedAt: new Date().toISOString(), version: "1.0.0" },
    data: {
      books,
      topics,
      errors,
      flashcards,
      exams,
      studySessions,
      olympiads,
      feynmanSessions,
      appSettings: appSettings ?? getDefaultSettings(),
      projectConfig: projectConfig ? parseStoredJson(projectConfig.json) : getDefaultProjectConfig(),
    },
  };
}

async function refreshExamRecommendations(prisma: PrismaClient) {
  const exams = await prisma.exam.findMany();
  const startYear = getRecommendedExamPeriodStartYear(exams);
  await Promise.all(
    exams.map((exam) =>
      prisma.exam.update({ where: { id: exam.id }, data: { recommendedPeriodStartYear: startYear } }),
    ),
  );
}

export async function importBackup(prisma: PrismaClient, payload: unknown) {
  const parsed = payload as {
    data?: {
      books?: Array<Record<string, unknown>>;
      topics?: Array<Record<string, unknown>>;
      errors?: Array<Record<string, unknown>>;
      flashcards?: Array<Record<string, unknown>>;
      exams?: Array<Record<string, unknown>>;
      studySessions?: Array<Record<string, unknown>>;
      olympiads?: Array<Record<string, unknown>>;
      feynmanSessions?: Array<Record<string, unknown>>;
      appSettings?: Record<string, unknown>;
      projectConfig?: unknown;
    };
  };

  if (!parsed?.data) throw new Error("Payload de importacao invalido.");

  const counts = {
    books: 0,
    topics: 0,
    errors: 0,
    flashcards: 0,
    exams: 0,
    studySessions: 0,
    olympiads: 0,
    feynmanSessions: 0,
  };

  for (const item of parsed.data.books ?? []) {
    const progressPercent = Number(item.progressPercent ?? 0);
    await prisma.book.upsert({
      where: { id: String(item.id) },
      update: { ...item, progressPercent, status: computeBookStatus(progressPercent) } as never,
      create: { ...item, id: String(item.id), progressPercent, status: computeBookStatus(progressPercent) } as never,
    });
    counts.books += 1;
  }

  for (const item of parsed.data.topics ?? []) {
    await prisma.topic.upsert({
      where: { id: String(item.id) },
      update: { ...item } as never,
      create: { ...item, id: String(item.id) } as never,
    });
    counts.topics += 1;
  }

  for (const item of parsed.data.errors ?? []) {
    await prisma.conceptualError.upsert({
      where: { id: String(item.id) },
      update: { ...item } as never,
      create: { ...item, id: String(item.id) } as never,
    });
    counts.errors += 1;
  }

  for (const item of parsed.data.flashcards ?? []) {
    const hash = typeof item.hash === "string" ? item.hash : djb2Hash(`${item.front ?? ""}${item.back ?? ""}${item.ankiDeck ?? ""}`);
    await prisma.flashcard.upsert({
      where: { id: String(item.id) },
      update: { ...item, hash } as never,
      create: { ...item, id: String(item.id), hash } as never,
    });
    counts.flashcards += 1;
  }

  for (const item of parsed.data.exams ?? []) {
    const metrics = computeExamPercents({
      timeAvailableMin: item.timeAvailableMin as number | null,
      timeUsedMin: item.timeUsedMin as number | null,
      score: item.score as number | null,
      scoreMax: item.scoreMax as number | null,
    });
    await prisma.exam.upsert({
      where: { id: String(item.id) },
      update: { ...item, ...metrics } as never,
      create: { ...item, id: String(item.id), ...metrics } as never,
    });
    counts.exams += 1;
  }

  for (const item of parsed.data.studySessions ?? []) {
    await prisma.studySession.upsert({
      where: { id: String(item.id) },
      update: { ...item } as never,
      create: { ...item, id: String(item.id) } as never,
    });
    counts.studySessions += 1;
  }

  for (const item of parsed.data.olympiads ?? []) {
    await prisma.olympiad.upsert({
      where: { id: String(item.id) },
      update: { ...item } as never,
      create: { ...item, id: String(item.id) } as never,
    });
    counts.olympiads += 1;
  }

  for (const item of parsed.data.feynmanSessions ?? []) {
    await prisma.feynmanSession.upsert({
      where: { id: String(item.id) },
      update: { ...item } as never,
      create: { ...item, id: String(item.id) } as never,
    });
    counts.feynmanSessions += 1;
  }

  await prisma.appSettings.upsert({
    where: { id: "app-settings" },
    update: { ...(parsed.data.appSettings ?? getDefaultSettings()), id: "app-settings" } as never,
    create: { ...getDefaultSettings(), ...(parsed.data.appSettings ?? {}), id: "app-settings" } as never,
  });

  const configString = ensureJsonString(parsed.data.projectConfig ?? getDefaultProjectConfig());
  await prisma.projectConfig.upsert({
    where: { id: "project-config" },
    update: { json: configString },
    create: { id: "project-config", json: configString },
  });

  await refreshExamRecommendations(prisma);
  return counts;
}
