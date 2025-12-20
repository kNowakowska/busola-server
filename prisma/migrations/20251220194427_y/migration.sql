-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "slackChannel" DROP NOT NULL,
ALTER COLUMN "slackChannel" DROP DEFAULT;
