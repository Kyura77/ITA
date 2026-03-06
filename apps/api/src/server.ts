import { randomUUID } from "node:crypto";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import {
  advanceTopicStatus,
  boolFromQuery,
  computeBookStatus,
  computeExamPercents,
  CREATED_BY,
  djb2Hash,
  ensureJsonString,
  getDefaultProjectConfig,
  getDefaultSettings,
  getRecommendedExamPeriodStartYear,
  parseStoredJson,
  titleCase,
  todayString,
} from "./lib/domain";
import { handleRouteError, sendError } from "./lib/http";
import { DEFAULT_PROJECT_CONFIG_JSON, SEED_BOOKS, SEED_TOPICS } from "./data/seedData";
import { analyzeErrorWithMode, generateCardsWithMode, evaluateFeynmanWithMode, runAiSelfTest } from "./services/ai";
import { proxyAnki, runAnkiSelfTest, syncFlashcardsWithMode } from "./services/anki";
import { getIntegrationStatus } from "./services/integrations";
import { exportBackup, importBackup } from "./services/exportImport";

const app = Fastify({ logger: true });

const subjectSchema = z.enum(["matematica", "fisica", "quimica", "calculo", "geral"]);
const phaseSchema = z.enum(["base", "aprofundamento"]);
const bookPrioritySchema = z.enum(["essencial", "recomendado", "opcional"]);
const topicStatusSchema = z.enum(["nao_iniciado", "em_andamento", "base_concluida", "aprofundando", "dominado"]);
const topicPrioritySchema = z.enum(["baixa", "media", "alta", "critica"]);
const errorSourceSchema = z.enum(["livro_exercicio", "prova_afa", "prova_ime", "prova_ita", "simulado", "olimpiada"]);
const gapTypeSchema = z.enum(["conceito_errado", "formula_esquecida", "mecanismo_nao_visto", "conta_incorreta", "aplicacao_incompleta", "outro"]);
const severitySchema = z.enum(["leve", "moderada", "grave"]);
const flashcardTypeSchema = z.enum(["conceito", "formula", "reacao_quimica", "nomenclatura", "mecanismo", "erro_recorrente"]);
const flashcardOriginSchema = z.enum(["ia_gerada", "manual"]);
const examBoardSchema = z.enum(["AFA", "IME_1fase", "IME_2fase", "ITA_1fase", "ITA_2fase", "FUVEST", "UNICAMP", "OBMEP", "OBF", "OBQ"]);
const examStatusSchema = z.enum(["planejada", "realizada"]);
const sessionTypeSchema = z.enum(["teoria", "exercicios", "revisao", "prova", "olimpiada"]);
const olympiadTypeSchema = z.enum(["OBMEP", "OBF", "OBQ", "OBM", "OBI", "OBFEP", "outra"]);
const olympiadMedalSchema = z.enum(["nenhuma", "honra_ao_merito", "bronze", "prata", "ouro"]);
const olympiadStatusSchema = z.enum(["inscrito", "realizada", "resultado"]);
const integrationModeSchema = z.enum(["stub", "real"]);
const themeSchema = z.enum(["light", "dark"]);

const bookCreateSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  subject: subjectSchema,
  phase: phaseSchema,
  priority: bookPrioritySchema.default("recomendado"),
  progressPercent: z.number().min(0).max(100).default(0),
  notes: z.string().optional().nullable(),
  defaultAnkiDeck: z.string().optional().nullable(),
  recommendedOrder: z.string().optional().nullable(),
});

const topicCreateSchema = z.object({
  subject: subjectSchema,
  area: z.string().min(1),
  topic: z.string().min(1),
  subtopic: z.string().optional().nullable(),
  bookBaseId: z.string().optional().nullable(),
  bookAdvancedId: z.string().optional().nullable(),
  status: topicStatusSchema.default("nao_iniciado"),
  yearPlan: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  priorityIta: topicPrioritySchema.default("media"),
  startDate: z.string().optional().nullable(),
  lastReviewedAt: z.string().optional().nullable(),
  totalStudyMinutes: z.number().int().min(0).default(0),
  forOlympiad: z.boolean().default(false),
  ankiDeck: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  prerequisites: z.string().optional().nullable(),
});

const errorCreateSchema = z.object({
  date: z.string().optional().nullable(),
  topicId: z.string().optional().nullable(),
  bookId: z.string().optional().nullable(),
  descriptionGap: z.string().min(1),
  context: z.string().min(1),
  source: errorSourceSchema,
  gapType: gapTypeSchema,
  severity: severitySchema,
  resolved: z.boolean().default(false),
  iaAnalysis: z.string().optional().nullable(),
  cardsGenerated: z.boolean().default(false),
});

const flashcardCreateSchema = z.object({
  topicId: z.string().optional().nullable(),
  bookId: z.string().optional().nullable(),
  errorId: z.string().optional().nullable(),
  front: z.string().min(1),
  back: z.string().min(1),
  type: flashcardTypeSchema,
  origin: flashcardOriginSchema.default("manual"),
  ankiNoteId: z.union([z.string(), z.number().int()]).transform((value) => value == null ? null : String(value)).optional().nullable(),
  ankiDeck: z.string().min(1),
  synced: z.boolean().default(false),
});

const examCreateSchema = z.object({
  name: z.string().min(1),
  board: examBoardSchema,
  year: z.number().int(),
  dateReal: z.string().optional().nullable(),
  timeAvailableMin: z.number().int().optional().nullable(),
  timeUsedMin: z.number().int().optional().nullable(),
  score: z.number().optional().nullable(),
  scoreMax: z.number().optional().nullable(),
  status: examStatusSchema.default("planejada"),
  notes: z.string().optional().nullable(),
});

const studySessionCreateSchema = z.object({
  topicId: z.string().optional().nullable(),
  topicName: z.string().min(1),
  bookId: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(1),
  pomodoroCount: z.number().int().min(0).default(0),
  type: sessionTypeSchema.optional().nullable(),
  notes: z.string().optional().nullable(),
  quality: z.number().int().min(1).max(5).optional().nullable(),
});

const olympiadCreateSchema = z.object({
  name: z.string().min(1),
  type: olympiadTypeSchema,
  year: z.number().int(),
  phase: z.enum(["1fase", "2fase", "3fase", "final"]).optional().nullable(),
  date: z.string().optional().nullable(),
  score: z.number().optional().nullable(),
  scoreMax: z.number().optional().nullable(),
  medal: olympiadMedalSchema.optional().nullable(),
  status: olympiadStatusSchema.default("inscrito"),
  notes: z.string().optional().nullable(),
});

const feynmanCreateSchema = z.object({
  topicId: z.string().optional().nullable(),
  topicName: z.string().min(1),
  explanation: z.string().min(1),
  date: z.string().optional().nullable(),
});

const settingsUpdateSchema = z.object({
  theme: themeSchema.optional(),
  pomodoroWork: z.number().int().min(1).optional(),
  pomodoroBreak: z.number().int().min(1).optional(),
  pomodoroLongBreak: z.number().int().min(1).optional(),
  pomodoroSetsBeforeLong: z.number().int().min(1).optional(),
  ollamaUrl: z.string().url().optional(),
  ollamaModel: z.string().min(1).optional(),
  ankiConnectUrl: z.string().url().optional(),
  seeded: z.boolean().optional(),
  aiMode: integrationModeSchema.optional(),
  ankiMode: integrationModeSchema.optional(),
});

async function readSettings() {
  const settings = await prisma.appSettings.findUnique({ where: { id: "app-settings" } });
  return settings ?? getDefaultSettings();
}

async function ensureSettings() {
  return prisma.appSettings.upsert({
    where: { id: "app-settings" },
    update: {},
    create: getDefaultSettings(),
  });
}

async function readProjectConfig() {
  const config = await prisma.projectConfig.findUnique({ where: { id: "project-config" } });
  return config ? parseStoredJson(config.json) : getDefaultProjectConfig();
}

async function refreshExamRecommendations() {
  const exams = await prisma.exam.findMany();
  const year = getRecommendedExamPeriodStartYear(exams);
  await Promise.all(
    exams.map((exam) =>
      prisma.exam.update({ where: { id: exam.id }, data: { recommendedPeriodStartYear: year } }),
    ),
  );
  return year;
}

async function recomputeTopicMinutes(topicId: string | null | undefined) {
  if (!topicId) return;
  const sessions = await prisma.studySession.findMany({ where: { topicId } });
  const total = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  await prisma.topic.update({ where: { id: topicId }, data: { totalStudyMinutes: total } }).catch(() => undefined);
}

function filterByText(value: string | null | undefined, query: string) {
  return (value ?? "").toLowerCase().includes(query.toLowerCase());
}

app.register(cors, {
  origin: true,
  credentials: true,
});

app.get("/api/health", async () => ({ ok: true }));
app.get("/api/integrations/status", async () => getIntegrationStatus(await readSettings()));
app.post("/api/integrations/self-test", async () => {
  const settings = await readSettings();
  const pendingCount = await prisma.flashcard.count({ where: { synced: false } });
  const [ai, anki] = await Promise.all([
    runAiSelfTest({ aiMode: settings.aiMode, ollamaUrl: settings.ollamaUrl, ollamaModel: settings.ollamaModel }),
    runAnkiSelfTest({ ankiMode: settings.ankiMode, ankiConnectUrl: settings.ankiConnectUrl }),
  ]);

  return {
    checkedAt: new Date().toISOString(),
    ai,
    anki: { ...anki, pendingCount },
  };
});

app.get("/api/books", async (request) => {
  const query = request.query as Record<string, unknown>;
  const books = await prisma.book.findMany({ orderBy: [{ title: "asc" }] });
  return books.filter((book) => {
    if (query.subject && book.subject !== query.subject) return false;
    if (query.phase && book.phase !== query.phase) return false;
    if (query.status && book.status !== query.status) return false;
    if (query.priority && book.priority !== query.priority) return false;
    if (query.q) {
      const text = String(query.q);
      return filterByText(book.title, text) || filterByText(book.author, text);
    }
    return true;
  });
});

app.post("/api/books", async (request, reply) => {
  try {
    const body = bookCreateSchema.parse(request.body);
    const book = await prisma.book.create({
      data: {
        id: randomUUID(),
        createdBy: CREATED_BY,
        ...body,
        status: computeBookStatus(body.progressPercent),
      },
    });
    return reply.status(201).send(book);
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.patch("/api/books/:id", async (request, reply) => {
  try {
    const body = bookCreateSchema.partial().parse(request.body);
    const id = (request.params as { id: string }).id;
    const current = await prisma.book.findUnique({ where: { id } });
    if (!current) return sendError(reply, 404, "NOT_FOUND", "Livro nao encontrado.");
    const progressPercent = body.progressPercent ?? current.progressPercent;
    const book = await prisma.book.update({
      where: { id },
      data: { ...body, progressPercent, status: computeBookStatus(progressPercent) },
    });
    return book;
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.delete("/api/books/:id", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  await prisma.book.delete({ where: { id } }).catch(() => null);
  return reply.status(204).send();
});

app.get("/api/topics", async (request) => {
  const query = request.query as Record<string, unknown>;
  const topics = await prisma.topic.findMany({ orderBy: [{ subject: "asc" }, { area: "asc" }, { topic: "asc" }] });
  return topics.filter((topic) => {
    if (query.subject && topic.subject !== query.subject) return false;
    if (query.status && topic.status !== query.status) return false;
    if (query.priorityIta && topic.priorityIta !== query.priorityIta) return false;
    if (query.yearPlan && Number(query.yearPlan) !== topic.yearPlan) return false;
    if (query.q) {
      const text = String(query.q);
      return [topic.area, topic.topic, topic.subtopic ?? ""].some((item) => filterByText(item, text));
    }
    return true;
  });
});

app.post("/api/topics", async (request, reply) => {
  try {
    const body = topicCreateSchema.parse(request.body);
    const topic = await prisma.topic.create({
      data: {
        id: randomUUID(),
        createdBy: CREATED_BY,
        ...body,
      },
    });
    return reply.status(201).send(topic);
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.patch("/api/topics/:id", async (request, reply) => {
  try {
    const body = topicCreateSchema.partial().parse(request.body);
    const id = (request.params as { id: string }).id;
    const topic = await prisma.topic.update({ where: { id }, data: body }).catch(() => null);
    if (!topic) return sendError(reply, 404, "NOT_FOUND", "Topico nao encontrado.");
    return topic;
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.post("/api/topics/:id/advance", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  const topic = await prisma.topic.findUnique({ where: { id } });
  if (!topic) return sendError(reply, 404, "NOT_FOUND", "Topico nao encontrado.");

  const topics = await prisma.topic.findMany({ select: { subject: true, yearPlan: true, status: true } });
  const result = advanceTopicStatus(topic, topics);
  if (!result.success) return sendError(reply, 409, result.code, result.message);

  const updatedTopic = await prisma.topic.update({ where: { id }, data: result.updates });
  return { success: true, topic: updatedTopic };
});

app.delete("/api/topics/:id", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  await prisma.topic.delete({ where: { id } }).catch(() => null);
  return reply.status(204).send();
});
app.get("/api/errors", async (request) => {
  const query = request.query as Record<string, unknown>;
  const resolved = boolFromQuery(query.resolved);
  const errors = await prisma.conceptualError.findMany({ orderBy: { createdAt: "desc" } });
  return errors.filter((item) => {
    if (typeof resolved === "boolean" && item.resolved !== resolved) return false;
    if (query.severity && item.severity !== query.severity) return false;
    if (query.source && item.source !== query.source) return false;
    if (query.q) {
      const text = String(query.q);
      return filterByText(item.descriptionGap, text) || filterByText(item.context, text);
    }
    return true;
  });
});

app.post("/api/errors", async (request, reply) => {
  try {
    const body = errorCreateSchema.parse(request.body);
    const errorItem = await prisma.conceptualError.create({
      data: {
        id: randomUUID(),
        createdBy: CREATED_BY,
        ...body,
      },
    });
    return reply.status(201).send(errorItem);
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.patch("/api/errors/:id", async (request, reply) => {
  try {
    const body = errorCreateSchema.partial().parse(request.body);
    const id = (request.params as { id: string }).id;
    const updated = await prisma.conceptualError.update({ where: { id }, data: body }).catch(() => null);
    if (!updated) return sendError(reply, 404, "NOT_FOUND", "Erro conceitual nao encontrado.");
    return updated;
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.delete("/api/errors/:id", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  await prisma.conceptualError.delete({ where: { id } }).catch(() => null);
  return reply.status(204).send();
});

app.post("/api/errors/:id/analyze-ai", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  const errorItem = await prisma.conceptualError.findUnique({ where: { id } });
  if (!errorItem) return sendError(reply, 404, "NOT_FOUND", "Erro conceitual nao encontrado.");

  const settings = await readSettings();
  const result = await analyzeErrorWithMode(errorItem, settings);
  await prisma.conceptualError.update({ where: { id }, data: { iaAnalysis: result.iaAnalysis } });
  return result;
});

app.post("/api/errors/:id/generate-cards", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  const errorItem = await prisma.conceptualError.findUnique({ where: { id }, include: { topic: true, book: true } });
  if (!errorItem) return sendError(reply, 404, "NOT_FOUND", "Erro conceitual nao encontrado.");

  const settings = await readSettings();
  const generated = await generateCardsWithMode(errorItem, settings);
  const existing = await prisma.flashcard.findMany({ where: { topicId: errorItem.topicId ?? undefined } });

  const deck =
    errorItem.topic?.ankiDeck ??
    errorItem.book?.defaultAnkiDeck ??
    `ITA::${titleCase(errorItem.topic?.subject ?? errorItem.book?.subject ?? "geral")}`;

  let created = 0;
  let skipped = 0;

  for (const card of generated.cards.slice(0, 8)) {
    const hash = djb2Hash(`${card.front}${card.back}${deck}`);
    const duplicate = existing.some((item) => item.hash === hash);
    if (duplicate) {
      skipped += 1;
      continue;
    }

    await prisma.flashcard.create({
      data: {
        id: randomUUID(),
        createdBy: CREATED_BY,
        topicId: errorItem.topicId,
        bookId: errorItem.bookId,
        errorId: errorItem.id,
        front: card.front,
        back: card.back,
        type: card.type === "erro_recorrente" ? "erro_recorrente" : (card.type as "conceito" | "formula" | "mecanismo"),
        origin: "ia_gerada",
        ankiDeck: deck,
        synced: false,
        hash,
      },
    });
    created += 1;
  }

  if (created > 0) {
    await prisma.conceptualError.update({ where: { id }, data: { cardsGenerated: true } });
  }

  return { created, skipped, mode: generated.mode };
});

app.get("/api/flashcards", async (request) => {
  const query = request.query as Record<string, unknown>;
  const synced = boolFromQuery(query.synced);
  const flashcards = await prisma.flashcard.findMany({ orderBy: { createdAt: "desc" } });
  return flashcards.filter((card) => {
    if (typeof synced === "boolean" && card.synced !== synced) return false;
    if (query.ankiDeck && card.ankiDeck !== query.ankiDeck) return false;
    if (query.q) {
      const text = String(query.q);
      return filterByText(card.front, text) || filterByText(card.back, text);
    }
    return true;
  });
});

app.post("/api/flashcards", async (request, reply) => {
  try {
    const body = flashcardCreateSchema.parse(request.body);
    const hash = djb2Hash(`${body.front}${body.back}${body.ankiDeck}`);
    const duplicate = await prisma.flashcard.findUnique({ where: { hash } });
    if (duplicate) return sendError(reply, 409, "CONFLICT", "Flashcard duplicado.");

    const card = await prisma.flashcard.create({
      data: { id: randomUUID(), createdBy: CREATED_BY, ...body, hash },
    });
    return reply.status(201).send(card);
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.patch("/api/flashcards/:id", async (request, reply) => {
  try {
    const body = flashcardCreateSchema.partial().parse(request.body);
    const id = (request.params as { id: string }).id;
    const current = await prisma.flashcard.findUnique({ where: { id } });
    if (!current) return sendError(reply, 404, "NOT_FOUND", "Flashcard nao encontrado.");

    const front = body.front ?? current.front;
    const back = body.back ?? current.back;
    const ankiDeck = body.ankiDeck ?? current.ankiDeck;
    const hash = djb2Hash(`${front}${back}${ankiDeck}`);
    const duplicate = await prisma.flashcard.findFirst({ where: { hash, NOT: { id } } });
    if (duplicate) return sendError(reply, 409, "CONFLICT", "Flashcard duplicado.");

    const card = await prisma.flashcard.update({ where: { id }, data: { ...body, hash } });
    return card;
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.delete("/api/flashcards/:id", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  await prisma.flashcard.delete({ where: { id } }).catch(() => null);
  return reply.status(204).send();
});

app.post("/api/flashcards/sync-anki", async (request) => {
  const body = (request.body ?? {}) as { dryRun?: boolean };
  const settings = await readSettings();
  const flashcards = await prisma.flashcard.findMany({ where: { synced: false }, orderBy: { createdAt: "asc" } });

  if (body.dryRun) {
    return { syncedCount: 0, duplicateCount: 0, pendingCount: flashcards.length, performed: false, errors: [], mode: settings.ankiMode };
  }

  return syncFlashcardsWithMode(settings.ankiMode, settings, flashcards);
});

app.get("/api/exams", async (request) => {
  const query = request.query as Record<string, unknown>;
  const exams = await prisma.exam.findMany({ orderBy: [{ year: "desc" }, { name: "asc" }] });
  return exams.filter((exam) => {
    if (query.board && exam.board !== query.board) return false;
    if (query.status && exam.status !== query.status) return false;
    if (query.year && Number(query.year) !== exam.year) return false;
    if (query.q) return filterByText(exam.name, String(query.q));
    return true;
  });
});

app.post("/api/exams", async (request, reply) => {
  try {
    const body = examCreateSchema.parse(request.body);
    const exam = await prisma.exam.create({
      data: { id: randomUUID(), createdBy: CREATED_BY, ...body, ...computeExamPercents(body) },
    });
    const recommended = await refreshExamRecommendations();
    return reply.status(201).send({ ...exam, recommendedPeriodStartYear: recommended });
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.patch("/api/exams/:id", async (request, reply) => {
  try {
    const body = examCreateSchema.partial().parse(request.body);
    const id = (request.params as { id: string }).id;
    const current = await prisma.exam.findUnique({ where: { id } });
    if (!current) return sendError(reply, 404, "NOT_FOUND", "Prova nao encontrada.");

    const metrics = computeExamPercents({
      timeAvailableMin: body.timeAvailableMin ?? current.timeAvailableMin,
      timeUsedMin: body.timeUsedMin ?? current.timeUsedMin,
      score: body.score ?? current.score,
      scoreMax: body.scoreMax ?? current.scoreMax,
    });

    const exam = await prisma.exam.update({ where: { id }, data: { ...body, ...metrics } });
    const recommended = await refreshExamRecommendations();
    return { ...exam, recommendedPeriodStartYear: recommended };
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.delete("/api/exams/:id", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  await prisma.exam.delete({ where: { id } }).catch(() => null);
  await refreshExamRecommendations();
  return reply.status(204).send();
});
app.get("/api/study-sessions", async (request) => {
  const query = request.query as Record<string, unknown>;
  const sessions = await prisma.studySession.findMany({ orderBy: { createdAt: "desc" } });
  return sessions.filter((session) => {
    if (query.type && session.type !== query.type) return false;
    if (query.from && session.date && session.date < String(query.from)) return false;
    if (query.to && session.date && session.date > String(query.to)) return false;
    if (query.q) {
      const text = String(query.q);
      return filterByText(session.topicName, text) || filterByText(session.notes ?? "", text);
    }
    return true;
  });
});

app.post("/api/study-sessions", async (request, reply) => {
  try {
    const body = studySessionCreateSchema.parse(request.body);
    const session = await prisma.studySession.create({
      data: { id: randomUUID(), createdBy: CREATED_BY, ...body },
    });
    await recomputeTopicMinutes(body.topicId);
    return reply.status(201).send(session);
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.patch("/api/study-sessions/:id", async (request, reply) => {
  try {
    const body = studySessionCreateSchema.partial().parse(request.body);
    const id = (request.params as { id: string }).id;
    const current = await prisma.studySession.findUnique({ where: { id } });
    if (!current) return sendError(reply, 404, "NOT_FOUND", "Sessao nao encontrada.");
    const session = await prisma.studySession.update({ where: { id }, data: body });
    await recomputeTopicMinutes(current.topicId);
    await recomputeTopicMinutes(session.topicId);
    return session;
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.delete("/api/study-sessions/:id", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  const current = await prisma.studySession.findUnique({ where: { id } });
  await prisma.studySession.delete({ where: { id } }).catch(() => null);
  await recomputeTopicMinutes(current?.topicId);
  return reply.status(204).send();
});

app.get("/api/olympiads", async (request) => {
  const query = request.query as Record<string, unknown>;
  const olympiads = await prisma.olympiad.findMany({ orderBy: [{ year: "desc" }, { name: "asc" }] });
  return olympiads.filter((item) => {
    if (query.status && item.status !== query.status) return false;
    if (query.type && item.type !== query.type) return false;
    if (query.year && Number(query.year) !== item.year) return false;
    if (query.q) return filterByText(item.name, String(query.q));
    return true;
  });
});

app.post("/api/olympiads", async (request, reply) => {
  try {
    const body = olympiadCreateSchema.parse(request.body);
    const olympiad = await prisma.olympiad.create({
      data: { id: randomUUID(), createdBy: CREATED_BY, ...body },
    });
    return reply.status(201).send(olympiad);
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.patch("/api/olympiads/:id", async (request, reply) => {
  try {
    const body = olympiadCreateSchema.partial().parse(request.body);
    const id = (request.params as { id: string }).id;
    const olympiad = await prisma.olympiad.update({ where: { id }, data: body }).catch(() => null);
    if (!olympiad) return sendError(reply, 404, "NOT_FOUND", "Olimpiada nao encontrada.");
    return olympiad;
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.delete("/api/olympiads/:id", async (request, reply) => {
  const id = (request.params as { id: string }).id;
  await prisma.olympiad.delete({ where: { id } }).catch(() => null);
  return reply.status(204).send();
});

app.get("/api/feynman-sessions", async (request) => {
  const query = request.query as Record<string, unknown>;
  const sessions = await prisma.feynmanSession.findMany({ orderBy: { createdAt: "desc" } });
  return query.topicId ? sessions.filter((session) => session.topicId === query.topicId) : sessions;
});

app.post("/api/feynman-sessions", async (request, reply) => {
  try {
    const body = feynmanCreateSchema.parse(request.body);
    const previousAttempts = await prisma.feynmanSession.findMany({
      where: body.topicId ? { topicId: body.topicId } : { topicName: body.topicName },
      orderBy: { createdAt: "asc" },
      select: { iaScore: true },
    });
    const settings = await readSettings();
    const evaluation = await evaluateFeynmanWithMode(
      { topicName: body.topicName, explanation: body.explanation, previousAttempts },
      settings,
    );

    const session = await prisma.feynmanSession.create({
      data: {
        id: randomUUID(),
        createdBy: CREATED_BY,
        ...body,
        date: body.date ?? todayString(),
        iaScore: evaluation.iaScore,
        iaFeedback: evaluation.iaFeedback,
        approved: evaluation.approved,
        attemptNumber: previousAttempts.length + 1,
      },
    });

    if (body.topicId) {
      const topic = await prisma.topic.findUnique({ where: { id: body.topicId } });
      if (topic && !["aprofundando", "dominado"].includes(topic.status)) {
        const topics = await prisma.topic.findMany({ select: { subject: true, yearPlan: true, status: true } });
        const result = advanceTopicStatus(topic, topics);
        if (result.success) {
          await prisma.topic.update({ where: { id: topic.id }, data: result.updates });
        }
      }
    }

    return reply.status(201).send({ ...session, mode: evaluation.mode });
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.get("/api/settings", async () => readSettings());

app.put("/api/settings", async (request, reply) => {
  try {
    const body = settingsUpdateSchema.parse(request.body);
    const settings = await prisma.appSettings.upsert({
      where: { id: "app-settings" },
      update: body,
      create: { ...getDefaultSettings(), ...body, id: "app-settings" },
    });
    return settings;
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.get("/api/project-config", async () => readProjectConfig());

app.put("/api/project-config", async (request, reply) => {
  try {
    const body = (request.body ?? {}) as Record<string, unknown>;
    const payload = Object.prototype.hasOwnProperty.call(body, "json") ? body.json : body;
    const json = ensureJsonString(payload);
    await prisma.projectConfig.upsert({
      where: { id: "project-config" },
      update: { json },
      create: { id: "project-config", json },
    });
    return JSON.parse(json);
  } catch (error) {
    return handleRouteError(reply, error);
  }
});
app.get("/api/export", async () => exportBackup(prisma));

app.post("/api/import", async (request, reply) => {
  try {
    const counts = await importBackup(prisma, request.body);
    return { success: true, counts };
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.post("/api/seed/run", async () => {
  const settings = await prisma.appSettings.findUnique({ where: { id: "app-settings" } });
  if (settings?.seeded) {
    return { skipped: true, reason: "ALREADY_SEEDED" };
  }

  const existingBooks = await prisma.book.count();
  if (existingBooks > 0) {
    await prisma.appSettings.upsert({
      where: { id: "app-settings" },
      update: { seeded: true, theme: settings?.theme ?? "dark" },
      create: { ...getDefaultSettings(), seeded: true },
    });
    await prisma.projectConfig.upsert({
      where: { id: "project-config" },
      update: {},
      create: { id: "project-config", json: DEFAULT_PROJECT_CONFIG_JSON },
    });
    return { skipped: true, reason: "BOOKS_ALREADY_EXIST" };
  }

  for (let index = 0; index < SEED_BOOKS.length; index += 10) {
    const batch = SEED_BOOKS.slice(index, index + 10);
    await Promise.all(
      batch.map((book) =>
        prisma.book.upsert({
          where: { id: book.id },
          update: book,
          create: { ...book, createdBy: CREATED_BY },
        }),
      ),
    );
  }

  for (let index = 0; index < SEED_TOPICS.length; index += 15) {
    const batch = SEED_TOPICS.slice(index, index + 15);
    await Promise.all(
      batch.map((topic) =>
        prisma.topic.upsert({
          where: { id: topic.id },
          update: topic,
          create: { ...topic, createdBy: CREATED_BY },
        }),
      ),
    );
  }

  await prisma.appSettings.upsert({
    where: { id: "app-settings" },
    update: { seeded: true, theme: settings?.theme ?? "dark" },
    create: { ...getDefaultSettings(), seeded: true },
  });

  await prisma.projectConfig.upsert({
    where: { id: "project-config" },
    update: {},
    create: { id: "project-config", json: DEFAULT_PROJECT_CONFIG_JSON },
  });

  return { inserted: { books: SEED_BOOKS.length, topics: SEED_TOPICS.length } };
});

app.post("/api/ai/ollama/completions", async (request, reply) => {
  const settings = await ensureSettings();
  if (settings.aiMode !== "real") {
    return sendError(reply, 409, "CONFLICT", "IA em modo stub.");
  }

  try {
    const response = await fetch(`${settings.ollamaUrl.replace(/\/$/, "")}/v1/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.body),
    });
    const data = await response.json();
    return reply.status(response.status).send(data);
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

app.post("/api/anki", async (request, reply) => {
  const settings = await ensureSettings();
  try {
    const data = await proxyAnki(settings, request.body);
    return data;
  } catch (error) {
    return handleRouteError(reply, error);
  }
});

const start = async () => {
  try {
    await app.listen({ host: "0.0.0.0", port: 3001 });
    app.log.info("API running at http://localhost:3001");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    app.log.info({ signal }, "Shutting down API server");
    await app.close();
    await prisma.$disconnect();
  } catch (error) {
    app.log.error(error);
  } finally {
    process.exit(0);
  }
}

for (const signal of ["SIGINT", "SIGTERM", "SIGBREAK"] as const) {
  process.once(signal, () => {
    void shutdown(signal);
  });
}

start();





