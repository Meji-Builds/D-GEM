-- CreateEnum
CREATE TYPE "GameKind" AS ENUM ('RIDDLES', 'CROSSWORD');

-- CreateTable
CREATE TABLE "GameRiddle" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 10,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameRiddle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrosswordWord" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "clue" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 10,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrosswordWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrosswordLayout" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "placements" JSONB NOT NULL,
    "unplaced" JSONB NOT NULL DEFAULT '[]',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrosswordLayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameLevelScore" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "game" "GameKind" NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameLevelScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrosswordLayout_level_key" ON "CrosswordLayout"("level");

-- CreateIndex
CREATE INDEX "GameLevelScore_ticketId_idx" ON "GameLevelScore"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "GameLevelScore_ticketId_game_level_key" ON "GameLevelScore"("ticketId", "game", "level");

-- AddForeignKey
ALTER TABLE "GameLevelScore" ADD CONSTRAINT "GameLevelScore_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Attendee"("ticketId") ON DELETE RESTRICT ON UPDATE CASCADE;
