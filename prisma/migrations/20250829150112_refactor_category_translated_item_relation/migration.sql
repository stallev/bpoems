-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_translatedNameId_fkey";

-- AlterTable
ALTER TABLE "public"."TranslatedItem" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."TranslatedItem" ADD CONSTRAINT "TranslatedItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
