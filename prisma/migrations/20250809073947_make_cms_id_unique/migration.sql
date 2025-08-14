/*
  Warnings:

  - A unique constraint covering the columns `[cmsId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cmsId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cmsId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cmsId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cmsId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Answer_cmsId_key" ON "Answer"("cmsId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_cmsId_key" ON "Course"("cmsId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_cmsId_key" ON "Lesson"("cmsId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_cmsId_key" ON "Question"("cmsId");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_cmsId_key" ON "Quiz"("cmsId");
