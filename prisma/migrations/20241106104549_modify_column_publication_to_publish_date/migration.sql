/*
  Warnings:

  - You are about to drop the column `publication_date` on the `announcements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "publication_date",
ALTER COLUMN "publish_date" DROP DEFAULT,
ALTER COLUMN "publish_date" SET DATA TYPE TIMESTAMP(3);
