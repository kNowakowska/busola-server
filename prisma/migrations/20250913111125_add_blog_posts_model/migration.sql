-- CreateTable
CREATE TABLE "BlogPost" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "imageCMSId" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_uuid_key" ON "BlogPost"("uuid");
