-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flashcard" (
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
    "ankiNoteId" TEXT,
    "ankiDeck" TEXT NOT NULL,
    "synced" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT NOT NULL,
    CONSTRAINT "Flashcard_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flashcard_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flashcard_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "ConceptualError" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Flashcard" ("ankiDeck", "ankiNoteId", "back", "bookId", "createdAt", "createdBy", "errorId", "front", "hash", "id", "origin", "synced", "topicId", "type", "updatedAt") SELECT "ankiDeck", "ankiNoteId", "back", "bookId", "createdAt", "createdBy", "errorId", "front", "hash", "id", "origin", "synced", "topicId", "type", "updatedAt" FROM "Flashcard";
DROP TABLE "Flashcard";
ALTER TABLE "new_Flashcard" RENAME TO "Flashcard";
CREATE UNIQUE INDEX "Flashcard_hash_key" ON "Flashcard"("hash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
