/*
  Warnings:

  - Added the required column `cmsId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cmsId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cmsId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cmsId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cmsId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "cmsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "cmsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "cmsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "cmsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "cmsId" TEXT NOT NULL;
