// Import types from generated Prisma Client
import type { Review as PrismaReview, Prisma } from '@/generated/prisma';

// Re-export base types from Prisma
export type Review = PrismaReview;
export type ReviewCreateInput = Prisma.ReviewCreateInput;
export type ReviewUpdateInput = Prisma.ReviewUpdateInput;
export type ReviewWhereInput = Prisma.ReviewWhereInput;
export type ReviewOrderByWithRelationInput = Prisma.ReviewOrderByWithRelationInput;

// Extended type for review with included relations
export interface ReviewWithRelations extends PrismaReview {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  poem: {
    id: string;
    title: string;
    slug: string;
  };
}

// Simplified types for more convenient use in the application
export type SimpleReviewCreateInput = Omit<Prisma.ReviewUncheckedCreateInput, 'author' | 'poem'> & {
  userId: string;
  poemId: string;
};

export type SimpleReviewUpdateInput = Omit<Prisma.ReviewUncheckedUpdateInput, 'author' | 'poem'> & {
  userId?: string;
  poemId?: string;
};
