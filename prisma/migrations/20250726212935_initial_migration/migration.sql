-- CreateTable
CREATE TABLE "users" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "last_name" TEXT,
    "password" TEXT,
    "is_password_reseted" BOOLEAN DEFAULT false,
    "initial_password" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
