-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageCMSId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shortDescription" TEXT NOT NULL DEFAULT '';
