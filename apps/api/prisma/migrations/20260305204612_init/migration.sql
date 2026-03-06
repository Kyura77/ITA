-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'recomendado',
    "status" TEXT NOT NULL DEFAULT 'nao_iniciado',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "defaultAnkiDeck" TEXT,
    "recommendedOrder" TEXT
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "subject" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subtopic" TEXT,
    "bookBaseId" TEXT,
    "bookAdvancedId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'nao_iniciado',
    "yearPlan" INTEGER NOT NULL DEFAULT 1,
    "priorityIta" TEXT NOT NULL DEFAULT 'media',
    "startDate" TEXT,
    "lastReviewedAt" TEXT,
    "totalStudyMinutes" INTEGER NOT NULL DEFAULT 0,
    "forOlympiad" BOOLEAN NOT NULL DEFAULT false,
    "ankiDeck" TEXT,
    "notes" TEXT,
    "prerequisites" TEXT,
    CONSTRAINT "Topic_bookBaseId_fkey" FOREIGN KEY ("bookBaseId") REFERENCES "Book" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Topic_bookAdvancedId_fkey" FOREIGN KEY ("bookAdvancedId") REFERENCES "Book" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConceptualError" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "date" TEXT,
    "topicId" TEXT,
    "bookId" TEXT,
    "descriptionGap" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "gapType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "iaAnalysis" TEXT,
    "cardsGenerated" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ConceptualError_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ConceptualError_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "topicId" TEXT,
    "bookId" TEXT,
    "errorId" TEXT,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "ankiNoteId" INTEGER,
    "ankiDeck" TEXT NOT NULL,
    "synced" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT NOT NULL,
    CONSTRAINT "Flashcard_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flashcard_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flashcard_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "ConceptualError" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "name" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "recommendedPeriodStartYear" INTEGER,
    "dateReal" TEXT,
    "timeAvailableMin" INTEGER,
    "timeUsedMin" INTEGER,
    "percentTime" REAL,
    "score" REAL,
    "scoreMax" REAL,
    "percentCorrect" REAL,
    "status" TEXT NOT NULL DEFAULT 'planejada',
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "topicId" TEXT,
    "topicName" TEXT NOT NULL,
    "bookId" TEXT,
    "date" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "pomodoroCount" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT,
    "notes" TEXT,
    "quality" INTEGER,
    CONSTRAINT "StudySession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StudySession_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Olympiad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "phase" TEXT,
    "date" TEXT,
    "score" REAL,
    "scoreMax" REAL,
    "medal" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inscrito',
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "FeynmanSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "topicId" TEXT,
    "topicName" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "iaScore" REAL,
    "iaFeedback" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "date" TEXT,
    CONSTRAINT "FeynmanSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'app-settings',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "pomodoroWork" INTEGER NOT NULL DEFAULT 25,
    "pomodoroBreak" INTEGER NOT NULL DEFAULT 5,
    "pomodoroLongBreak" INTEGER NOT NULL DEFAULT 15,
    "pomodoroSetsBeforeLong" INTEGER NOT NULL DEFAULT 4,
    "ollamaUrl" TEXT NOT NULL DEFAULT 'http://localhost:11434',
    "ollamaModel" TEXT NOT NULL DEFAULT 'qwen2.5:14b',
    "ankiConnectUrl" TEXT NOT NULL DEFAULT 'http://localhost:8765',
    "seeded" BOOLEAN NOT NULL DEFAULT false,
    "aiMode" TEXT NOT NULL DEFAULT 'stub',
    "ankiMode" TEXT NOT NULL DEFAULT 'stub'
);

-- CreateTable
CREATE TABLE "ProjectConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'project-config',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "json" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_hash_key" ON "Flashcard"("hash");
