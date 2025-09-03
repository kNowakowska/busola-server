/*
  Warnings:

  - Made the column `score` on table `QuizAttempt` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AnswerSelection" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "QuestionResponse" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "score" SET NOT NULL;
