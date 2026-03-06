export type Subject = "matematica" | "fisica" | "quimica" | "calculo" | "geral";
export type BookPhase = "base" | "aprofundamento";
export type BookPriority = "essencial" | "recomendado" | "opcional";
export type BookStatus = "nao_iniciado" | "em_andamento" | "concluido";
export type TopicStatus = "nao_iniciado" | "em_andamento" | "base_concluida" | "aprofundando" | "dominado";
export type TopicPriority = "baixa" | "media" | "alta" | "critica";
export type ErrorSource = "livro_exercicio" | "prova_afa" | "prova_ime" | "prova_ita" | "simulado" | "olimpiada";
export type GapType = "conceito_errado" | "formula_esquecida" | "mecanismo_nao_visto" | "conta_incorreta" | "aplicacao_incompleta" | "outro";
export type Severity = "leve" | "moderada" | "grave";
export type FlashcardType = "conceito" | "formula" | "reacao_quimica" | "nomenclatura" | "mecanismo" | "erro_recorrente";
export type FlashcardOrigin = "ia_gerada" | "manual";
export type ExamBoard = "AFA" | "IME_1fase" | "IME_2fase" | "ITA_1fase" | "ITA_2fase" | "FUVEST" | "UNICAMP" | "OBMEP" | "OBF" | "OBQ";
export type ExamStatus = "planejada" | "realizada";
export type StudySessionType = "teoria" | "exercicios" | "revisao" | "prova" | "olimpiada";
export type OlympiadType = "OBMEP" | "OBF" | "OBQ" | "OBM" | "OBI" | "OBFEP" | "outra";
export type OlympiadMedal = "nenhuma" | "honra_ao_merito" | "bronze" | "prata" | "ouro";
export type OlympiadStatus = "inscrito" | "realizada" | "resultado";
export type IntegrationMode = "stub" | "real";
export type ThemeMode = "light" | "dark";
export type IntegrationReachability = "online" | "offline" | "attention";
export type IntegrationProvider = "stub" | "ollama" | "ankiconnect" | "collection" | "none";

export interface BaseEntity { id: string; createdAt?: string; updatedAt?: string; createdBy?: string | null; }
export interface Book { id: string; title: string; author: string; subject: Subject; phase: BookPhase; priority: BookPriority; status: BookStatus; progressPercent: number; notes?: string | null; defaultAnkiDeck?: string | null; recommendedOrder?: string | null; createdAt?: string; updatedAt?: string; createdBy?: string | null; }
export interface Topic extends BaseEntity { subject: Subject; area: string; topic: string; subtopic?: string | null; bookBaseId?: string | null; bookAdvancedId?: string | null; status: TopicStatus; yearPlan: 1 | 2 | 3; priorityIta: TopicPriority; startDate?: string | null; lastReviewedAt?: string | null; totalStudyMinutes: number; forOlympiad: boolean; ankiDeck?: string | null; notes?: string | null; prerequisites?: string | null; }
export interface ConceptualError extends BaseEntity { date?: string | null; topicId?: string | null; bookId?: string | null; descriptionGap: string; context: string; source: ErrorSource; gapType: GapType; severity: Severity; resolved: boolean; iaAnalysis?: string | null; cardsGenerated: boolean; }
export interface Flashcard extends BaseEntity { topicId?: string | null; bookId?: string | null; errorId?: string | null; front: string; back: string; type: FlashcardType; origin: FlashcardOrigin; ankiNoteId?: string | null; ankiDeck: string; synced: boolean; hash: string; }
export interface Exam extends BaseEntity { name: string; board: ExamBoard; year: number; recommendedPeriodStartYear?: number | null; dateReal?: string | null; timeAvailableMin?: number | null; timeUsedMin?: number | null; percentTime?: number | null; score?: number | null; scoreMax?: number | null; percentCorrect?: number | null; status: ExamStatus; notes?: string | null; }
export interface StudySession extends BaseEntity { topicId?: string | null; topicName: string; bookId?: string | null; date?: string | null; durationMinutes: number; pomodoroCount: number; type?: StudySessionType | null; notes?: string | null; quality?: number | null; }
export interface Olympiad extends BaseEntity { name: string; type: OlympiadType; year: number; phase?: "1fase" | "2fase" | "3fase" | "final" | null; date?: string | null; score?: number | null; scoreMax?: number | null; medal?: OlympiadMedal | null; status: OlympiadStatus; notes?: string | null; }
export interface FeynmanSession extends BaseEntity { topicId?: string | null; topicName: string; explanation: string; iaScore?: number | null; iaFeedback?: string | null; approved: boolean; attemptNumber: number; date?: string | null; mode?: IntegrationMode; }
export interface AppSettings { id: string; theme: ThemeMode; pomodoroWork: number; pomodoroBreak: number; pomodoroLongBreak: number; pomodoroSetsBeforeLong: number; ollamaUrl: string; ollamaModel: string; ankiConnectUrl: string; seeded: boolean; aiMode: IntegrationMode; ankiMode: IntegrationMode; createdAt?: string; updatedAt?: string; }
export interface IntegrationProbe { mode: IntegrationMode; available: boolean; status: IntegrationReachability; url: string; detail: string; responseMs: number | null; provider?: IntegrationProvider; model?: string | null; modelInstalled?: boolean; version?: number | null; profileName?: string | null; noteCount?: number | null; }
export interface IntegrationStatus { checkedAt: string; ai: IntegrationProbe; anki: IntegrationProbe; }
export interface IntegrationSelfTestProbe { ok: boolean; mode: IntegrationMode; provider: IntegrationProvider; detail: string; responseMs: number | null; sample?: string | null; profileName?: string | null; noteCount?: number | null; version?: number | null; pendingCount?: number | null; }
export interface IntegrationSelfTest { checkedAt: string; ai: IntegrationSelfTestProbe; anki: IntegrationSelfTestProbe; }
export interface AnkiSyncResult { syncedCount: number; duplicateCount: number; pendingCount: number; performed: boolean; errors: string[]; mode: IntegrationMode; }
export type ProjectConfig = Record<string, unknown>;
export interface ExportPayload { meta: { exportedAt: string; version: string }; data: { books: Book[]; topics: Topic[]; errors: ConceptualError[]; flashcards: Flashcard[]; exams: Exam[]; studySessions: StudySession[]; olympiads: Olympiad[]; feynmanSessions: FeynmanSession[]; appSettings: AppSettings; projectConfig: ProjectConfig } }
