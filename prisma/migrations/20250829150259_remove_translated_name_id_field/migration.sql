/*
  Warnings:

  - You are about to drop the column `translatedNameId` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Category_translatedNameId_key";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "translatedNameId";
