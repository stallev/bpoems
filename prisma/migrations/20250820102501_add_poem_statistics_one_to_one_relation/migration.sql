/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Poem" DROP CONSTRAINT "Poem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_nameId_fkey";

-- DropIndex
DROP INDEX "public"."Tag_nameId_idx";

-- AlterTable
ALTER TABLE "public"."Tag" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Statistics" (
    "id" TEXT NOT NULL,
    "poemId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "edits" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Statistics_poemId_key" ON "public"."Statistics"("poemId");

-- CreateIndex
CREATE INDEX "Statistics_views_idx" ON "public"."Statistics"("views");

-- CreateIndex
CREATE INDEX "Statistics_edits_idx" ON "public"."Statistics"("edits");

-- CreateIndex
CREATE INDEX "Statistics_likes_idx" ON "public"."Statistics"("likes");

-- CreateIndex
CREATE INDEX "Statistics_shares_idx" ON "public"."Statistics"("shares");

-- CreateIndex
CREATE INDEX "Statistics_poemId_idx" ON "public"."Statistics"("poemId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "public"."Tag"("name");

-- AddForeignKey
ALTER TABLE "public"."Statistics" ADD CONSTRAINT "Statistics_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "public"."Poem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Poem" ADD CONSTRAINT "Poem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
