/*
  Warnings:

  - You are about to drop the column `latitude` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `announcements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "latitude",
DROP COLUMN "longitude";
