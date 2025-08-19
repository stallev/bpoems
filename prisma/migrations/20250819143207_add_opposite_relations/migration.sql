/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nameRu` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nameUa` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nameId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TranslationItemType" AS ENUM ('POEM_TAGS', 'POEM_CATEGORY');

-- CreateEnum
CREATE TYPE "public"."Locale" AS ENUM ('EN', 'RU', 'UA');

-- DropIndex
DROP INDEX "public"."Tag_name_idx";

-- DropIndex
DROP INDEX "public"."Tag_name_key";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "name",
DROP COLUMN "nameRu",
DROP COLUMN "nameUa",
ADD COLUMN     "nameId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tag" DROP COLUMN "name",
ADD COLUMN     "nameId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."TranslatedItem" (
    "id" TEXT NOT NULL,
    "type" "public"."TranslationItemType" NOT NULL,
    "values" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TranslatedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TranslatedItem_type_idx" ON "public"."TranslatedItem"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_nameId_key" ON "public"."Category"("nameId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nameId_key" ON "public"."Tag"("nameId");

-- CreateIndex
CREATE INDEX "Tag_nameId_idx" ON "public"."Tag"("nameId");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_nameId_fkey" FOREIGN KEY ("nameId") REFERENCES "public"."TranslatedItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_nameId_fkey" FOREIGN KEY ("nameId") REFERENCES "public"."TranslatedItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
