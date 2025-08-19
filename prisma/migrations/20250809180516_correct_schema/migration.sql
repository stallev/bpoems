/*
  Warnings:

  - You are about to drop the `_CategoryToPoem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_CategoryToPoem" DROP CONSTRAINT "_CategoryToPoem_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CategoryToPoem" DROP CONSTRAINT "_CategoryToPoem_B_fkey";

-- AlterTable
ALTER TABLE "public"."Poem" ADD COLUMN     "categoryId" TEXT;

-- DropTable
DROP TABLE "public"."_CategoryToPoem";

-- AddForeignKey
ALTER TABLE "public"."Poem" ADD CONSTRAINT "Poem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
