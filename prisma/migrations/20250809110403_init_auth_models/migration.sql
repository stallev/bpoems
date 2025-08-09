/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Poem` table. All the data in the column will be lost.
  - You are about to drop the `CategoryOnPoem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagOnPoem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nameRu` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameUa` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ContentApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."UserAccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'READER';

-- DropForeignKey
ALTER TABLE "public"."CategoryOnPoem" DROP CONSTRAINT "CategoryOnPoem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CategoryOnPoem" DROP CONSTRAINT "CategoryOnPoem_poemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_poemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Poem" DROP CONSTRAINT "Poem_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TagOnPoem" DROP CONSTRAINT "TagOnPoem_poemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TagOnPoem" DROP CONSTRAINT "TagOnPoem_tagId_fkey";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "description",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nameRu" TEXT NOT NULL,
ADD COLUMN     "nameUa" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Poem" DROP COLUMN "published",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "public"."ContentApprovalStatus" NOT NULL DEFAULT 'APPROVED';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "bioRu" TEXT,
ADD COLUMN     "bioUa" TEXT,
ADD COLUMN     "status" "public"."UserAccountStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "bio" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."VerificationToken" ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("token");

-- DropIndex
DROP INDEX "public"."VerificationToken_token_key";

-- DropTable
DROP TABLE "public"."CategoryOnPoem";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."TagOnPoem";

-- CreateTable
CREATE TABLE "public"."Rating" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "poemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "poemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReadingList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReadingListItem" (
    "id" TEXT NOT NULL,
    "readingListId" TEXT NOT NULL,
    "poemId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuthorRoleRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorRoleRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CategoryToPoem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToPoem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_PoemToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PoemToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Rating_poemId_idx" ON "public"."Rating"("poemId");

-- CreateIndex
CREATE INDEX "Rating_value_idx" ON "public"."Rating"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_poemId_key" ON "public"."Rating"("userId", "poemId");

-- CreateIndex
CREATE INDEX "Review_poemId_idx" ON "public"."Review"("poemId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "public"."Review"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_poemId_key" ON "public"."Review"("userId", "poemId");

-- CreateIndex
CREATE INDEX "ReadingList_ownerId_idx" ON "public"."ReadingList"("ownerId");

-- CreateIndex
CREATE INDEX "ReadingList_createdAt_idx" ON "public"."ReadingList"("createdAt");

-- CreateIndex
CREATE INDEX "ReadingListItem_readingListId_order_idx" ON "public"."ReadingListItem"("readingListId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingListItem_readingListId_poemId_key" ON "public"."ReadingListItem"("readingListId", "poemId");

-- CreateIndex
CREATE INDEX "AuthorRoleRequest_requesterId_idx" ON "public"."AuthorRoleRequest"("requesterId");

-- CreateIndex
CREATE INDEX "AuthorRoleRequest_status_idx" ON "public"."AuthorRoleRequest"("status");

-- CreateIndex
CREATE INDEX "AuthorRoleRequest_createdAt_idx" ON "public"."AuthorRoleRequest"("createdAt");

-- CreateIndex
CREATE INDEX "_CategoryToPoem_B_index" ON "public"."_CategoryToPoem"("B");

-- CreateIndex
CREATE INDEX "_PoemToTag_B_index" ON "public"."_PoemToTag"("B");

-- CreateIndex
CREATE INDEX "Category_isActive_order_idx" ON "public"."Category"("isActive", "order");

-- CreateIndex
CREATE INDEX "Comment_poemId_idx" ON "public"."Comment"("poemId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "public"."Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "public"."Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_isApproved_idx" ON "public"."Comment"("isApproved");

-- CreateIndex
CREATE INDEX "Poem_authorId_idx" ON "public"."Poem"("authorId");

-- CreateIndex
CREATE INDEX "Poem_status_idx" ON "public"."Poem"("status");

-- CreateIndex
CREATE INDEX "Poem_createdAt_idx" ON "public"."Poem"("createdAt");

-- CreateIndex
CREATE INDEX "Poem_publishedAt_idx" ON "public"."Poem"("publishedAt");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "public"."Tag"("name");

-- AddForeignKey
ALTER TABLE "public"."Poem" ADD CONSTRAINT "Poem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "public"."Poem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "public"."Poem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "public"."Poem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReadingList" ADD CONSTRAINT "ReadingList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReadingListItem" ADD CONSTRAINT "ReadingListItem_readingListId_fkey" FOREIGN KEY ("readingListId") REFERENCES "public"."ReadingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReadingListItem" ADD CONSTRAINT "ReadingListItem_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "public"."Poem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthorRoleRequest" ADD CONSTRAINT "AuthorRoleRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthorRoleRequest" ADD CONSTRAINT "AuthorRoleRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToPoem" ADD CONSTRAINT "_CategoryToPoem_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToPoem" ADD CONSTRAINT "_CategoryToPoem_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Poem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PoemToTag" ADD CONSTRAINT "_PoemToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Poem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PoemToTag" ADD CONSTRAINT "_PoemToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
