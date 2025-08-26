/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Poem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Poem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ClaimResourceType" AS ENUM ('POEM', 'COMMENT', 'REVIEW');

-- AlterEnum
ALTER TYPE "public"."ContentApprovalStatus" ADD VALUE 'PENDINGREVIEW';

-- DropForeignKey
ALTER TABLE "public"."Poem" DROP CONSTRAINT "Poem_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "status" "public"."ContentApprovalStatus" NOT NULL DEFAULT 'APPROVED';

-- AlterTable
ALTER TABLE "public"."Poem" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "status" "public"."ContentApprovalStatus" NOT NULL DEFAULT 'APPROVED';

-- CreateTable
CREATE TABLE "public"."ClaimReport" (
    "id" TEXT NOT NULL,
    "resourceType" "public"."ClaimResourceType" NOT NULL,
    "poemId" TEXT,
    "commentId" TEXT,
    "reviewId" TEXT,
    "message" TEXT NOT NULL,
    "reporterId" TEXT,
    "claimResultDecision" "public"."ContentApprovalStatus",
    "claimResultDecisionAt" TIMESTAMP(3),
    "handlerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClaimReport_resourceType_idx" ON "public"."ClaimReport"("resourceType");

-- CreateIndex
CREATE INDEX "ClaimReport_reporterId_idx" ON "public"."ClaimReport"("reporterId");

-- CreateIndex
CREATE INDEX "ClaimReport_handlerId_idx" ON "public"."ClaimReport"("handlerId");

-- CreateIndex
CREATE INDEX "ClaimReport_claimResultDecision_idx" ON "public"."ClaimReport"("claimResultDecision");

-- CreateIndex
CREATE INDEX "ClaimReport_createdAt_idx" ON "public"."ClaimReport"("createdAt");

-- CreateIndex
CREATE INDEX "ClaimReport_poemId_idx" ON "public"."ClaimReport"("poemId");

-- CreateIndex
CREATE INDEX "ClaimReport_commentId_idx" ON "public"."ClaimReport"("commentId");

-- CreateIndex
CREATE INDEX "ClaimReport_reviewId_idx" ON "public"."ClaimReport"("reviewId");

-- CreateIndex
CREATE INDEX "Comment_status_idx" ON "public"."Comment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Poem_slug_key" ON "public"."Poem"("slug");

-- CreateIndex
CREATE INDEX "Review_status_idx" ON "public"."Review"("status");

-- AddForeignKey
ALTER TABLE "public"."Poem" ADD CONSTRAINT "Poem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaimReport" ADD CONSTRAINT "ClaimReport_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "public"."Poem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaimReport" ADD CONSTRAINT "ClaimReport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaimReport" ADD CONSTRAINT "ClaimReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaimReport" ADD CONSTRAINT "ClaimReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaimReport" ADD CONSTRAINT "ClaimReport_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
