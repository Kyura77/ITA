export const CREATED_BY = "local@user";

export const STATUS_ORDER = [
  "nao_iniciado",
  "em_andamento",
  "base_concluida",
  "aprofundando",
  "dominado",
] as const;

const PREREQ_OK = new Set(["base_concluida", "aprofundando", "dominado"]);

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function djb2Hash(input: string) {
  let hash = 5381;
  for (const char of input) {
    hash = (hash << 5) + hash + char.charCodeAt(0);
  }
  return Math.abs(hash).toString(16);
}

export function computeBookStatus(progressPercent: number): "nao_iniciado" | "em_andamento" | "concluido" {
  if (progressPercent >= 100) return "concluido";
  if (progressPercent > 0) return "em_andamento";
  return "nao_iniciado";
}

export function computeExamPercents(input: {
  timeAvailableMin?: number | null;
  timeUsedMin?: number | null;
  score?: number | null;
  scoreMax?: number | null;
}) {
  const percentTime =
    typeof input.timeAvailableMin === "number" &&
    input.timeAvailableMin > 0 &&
    typeof input.timeUsedMin === "number"
      ? round1((input.timeUsedMin / input.timeAvailableMin) * 100)
      : null;

  const percentCorrect =
    typeof input.scoreMax === "number" &&
    input.scoreMax > 0 &&
    typeof input.score === "number"
      ? round1((input.score / input.scoreMax) * 100)
      : null;

  return { percentTime, percentCorrect };
}

export function getRecommendedExamPeriodStartYear(
  exams: Array<{ status: string; percentCorrect: number | null }>,
) {
  const realized = exams.filter(
    (exam) => exam.status === "realizada" && typeof exam.percentCorrect === "number",
  );

  if (!realized.length) return 1990;

  const avg =
    realized.reduce((sum, exam) => sum + (exam.percentCorrect ?? 0), 0) / realized.length;

  if (avg < 50) return 1985;
  if (avg < 70) return 2000;
  return 2009;
}

export function getDefaultSettings() {
  return {
    id: "app-settings",
    theme: "dark",
    pomodoroWork: 25,
    pomodoroBreak: 5,
    pomodoroLongBreak: 15,
    pomodoroSetsBeforeLong: 4,
    ollamaUrl: "http://localhost:11434",
    ollamaModel: "gpt-oss:120b-cloud",
    ankiConnectUrl: "http://localhost:8765",
    seeded: false,
    aiMode: "stub",
    ankiMode: "stub",
  } as const;
}

export function getDefaultProjectConfig() {
  return {
    meta: {
      name: "ITA Prep Local",
      version: "1.0.0",
      createdAt: todayString(),
      scope: "localhost",
    },
    stack: {
      web: "React + Vite + Tailwind",
      api: "Fastify + Prisma + SQLite",
    },
    theme: {
      default: "dark",
      accent: "cyan",
      density: "high",
    },
    flags: {
      aiMode: "stub",
      ankiMode: "stub",
      seedOnDashboardMount: true,
    },
    editingRules: {
      allStatusesEditable: true,
      feynmanApprovalThreshold: 8,
      calculationDependsOnMath: true,
    },
  } as const;
}

export function ensureJsonString(value: unknown) {
  if (typeof value === "string") {
    JSON.parse(value);
    return value;
  }
  return JSON.stringify(value, null, 2);
}

export function parseStoredJson(value: string | null | undefined) {
  if (!value) return getDefaultProjectConfig();
  try {
    return JSON.parse(value);
  } catch {
    return getDefaultProjectConfig();
  }
}

export function advanceTopicStatus(
  topic: {
    subject: string;
    yearPlan: number;
    status: string;
    startDate: string | null;
  },
  allTopics: Array<{ subject: string; yearPlan: number; status: string }>,
  date = todayString(),
) {
  const currentIndex = STATUS_ORDER.indexOf(topic.status as (typeof STATUS_ORDER)[number]);

  if (currentIndex >= STATUS_ORDER.length - 1) {
    return {
      success: false as const,
      code: "ALREADY_DOMINADO",
      message: "O topico ja esta em dominado.",
    } as const;
  }

  const nextStatus = STATUS_ORDER[currentIndex + 1];

  if (topic.subject === "calculo" && nextStatus === "em_andamento") {
    const mathTopics = allTopics.filter(
      (item) => item.subject === "matematica" && Number(item.yearPlan) <= Number(topic.yearPlan),
    );

    if (!mathTopics.every((item) => PREREQ_OK.has(item.status))) {
      return {
        success: false as const,
        code: "PREREQUISITE_NOT_MET",
        message: "Calculo so pode iniciar apos Matematica base concluida no mesmo yearPlan.",
      } as const;
    }
  }

  return {
    success: true as const,
    updates: {
      status: nextStatus,
      startDate: nextStatus === "em_andamento" && !topic.startDate ? date : topic.startDate,
      lastReviewedAt: nextStatus !== "nao_iniciado" ? date : null,
    },
  } as const;
}

export function boolFromQuery(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  const normalized = String(value).toLowerCase();
  if (normalized === "true" || normalized === "1") return true;
  if (normalized === "false" || normalized === "0") return false;
  return undefined;
}

export function numberFromQuery(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
}

export function stableStubScore(seed: string) {
  const hash = parseInt(djb2Hash(seed).slice(0, 4), 16);
  return 6 + (hash % 4);
}

