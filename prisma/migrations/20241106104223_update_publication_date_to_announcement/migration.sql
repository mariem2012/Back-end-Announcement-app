/*
  Warnings:

  - You are about to drop the column `publication_date` on the `announcements` table. All the data in the column will be lost.
  - Added the required column `publish_date` to the `announcements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "announcements" ADD COLUMN "publish_date" TIMESTAMP NOT NULL DEFAULT NOW();

