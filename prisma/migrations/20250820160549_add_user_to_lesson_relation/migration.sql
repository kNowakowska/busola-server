-- CreateTable
CREATE TABLE "UserToLesson" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "notes" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserToLesson_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserToLesson_uuid_key" ON "UserToLesson"("uuid");

-- AddForeignKey
ALTER TABLE "UserToLesson" ADD CONSTRAINT "UserToLesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToLesson" ADD CONSTRAINT "UserToLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
