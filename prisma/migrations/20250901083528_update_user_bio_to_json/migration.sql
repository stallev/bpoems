/*
  Warnings:

  - You are about to drop the column `bioRu` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bioUa` on the `User` table. All the data in the column will be lost.
  - The `bio` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "bioRu",
DROP COLUMN "bioUa",
DROP COLUMN "bio",
ADD COLUMN     "bio" JSONB;
