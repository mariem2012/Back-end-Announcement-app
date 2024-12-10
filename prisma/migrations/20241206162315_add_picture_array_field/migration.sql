/*
  Warnings:

  - The `picture` column on the `announcements` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "picture",
ADD COLUMN     "picture" TEXT[];