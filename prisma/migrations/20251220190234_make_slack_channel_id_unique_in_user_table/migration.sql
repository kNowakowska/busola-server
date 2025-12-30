/*
  Warnings:

  - A unique constraint covering the columns `[slackChannel]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_slackChannel_key" ON "public"."User"("slackChannel");
