/*
  Warnings:

  - You are about to drop the column `claimRejectDecisionReason` on the `ClaimReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ClaimReport" DROP COLUMN "claimRejectDecisionReason",
ADD COLUMN     "claimApproveDecisionReason" TEXT;
