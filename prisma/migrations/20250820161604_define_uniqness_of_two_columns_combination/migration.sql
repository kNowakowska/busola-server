/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `UserToCourse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,lessonId]` on the table `UserToLesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserToCourse_userId_courseId_key" ON "UserToCourse"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "UserToLesson_userId_lessonId_key" ON "UserToLesson"("userId", "lessonId");
