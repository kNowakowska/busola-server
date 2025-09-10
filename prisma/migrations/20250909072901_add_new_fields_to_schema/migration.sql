/*
  Warnings:

  - Made the column `videoUrl` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "imageCMSId" TEXT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "tasksFileCMSId" TEXT,
ADD COLUMN     "tasksVideoUrl" TEXT,
ALTER COLUMN "videoUrl" SET NOT NULL,
ALTER COLUMN "videoUrl" SET DEFAULT '';
