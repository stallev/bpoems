/*
  Warnings:

  - A unique constraint covering the columns `[translatedNameId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `translatedNameId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_slug_fkey";

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "translatedNameId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_translatedNameId_key" ON "public"."Category"("translatedNameId");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "public"."Category"("slug");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_translatedNameId_fkey" FOREIGN KEY ("translatedNameId") REFERENCES "public"."TranslatedItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
