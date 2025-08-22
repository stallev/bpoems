/*
  Warnings:

  - You are about to drop the column `nameId` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_nameId_fkey";

-- DropIndex
DROP INDEX "public"."Category_nameId_key";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "nameId",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_slug_fkey" FOREIGN KEY ("slug") REFERENCES "public"."TranslatedItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
