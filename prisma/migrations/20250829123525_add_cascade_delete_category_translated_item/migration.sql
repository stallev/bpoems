-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_slug_fkey";

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_slug_fkey" FOREIGN KEY ("slug") REFERENCES "public"."TranslatedItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
