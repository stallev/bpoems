-- AlterTable
ALTER TABLE "public"."ClaimReport" ADD COLUMN     "claimRejectDecisionReason" TEXT;

-- CreateTable
CREATE TABLE "public"."ModerationActivity" (
    "id" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "targetUserId" TEXT,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModerationActivity_activityType_idx" ON "public"."ModerationActivity"("activityType");

-- CreateIndex
CREATE INDEX "ModerationActivity_moderatorId_idx" ON "public"."ModerationActivity"("moderatorId");

-- CreateIndex
CREATE INDEX "ModerationActivity_targetUserId_idx" ON "public"."ModerationActivity"("targetUserId");

-- CreateIndex
CREATE INDEX "ModerationActivity_createdAt_idx" ON "public"."ModerationActivity"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."ModerationActivity" ADD CONSTRAINT "ModerationActivity_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModerationActivity" ADD CONSTRAINT "ModerationActivity_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
