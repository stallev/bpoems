import { prisma } from '@/shared/api/database/prisma';
import type {
  Review,
  ReviewCreateInput,
  ReviewUpdateInput,
  ReviewOrderByWithRelationInput,
  ReviewWhereInput,
  ReviewWithRelations,
  SimpleReviewCreateInput,
  SimpleReviewUpdateInput,
} from '../model/types';

const defaultIncludes = {
  user: true,
  poem: true,
};

const defaultOrderBy = { createdAt: 'desc' as const };

export const reviewRepository = {
  findById: async (id: string): Promise<ReviewWithRelations | null> => {
    return prisma.review.findUnique({
      where: { id },
      include: defaultIncludes,
    }) as Promise<ReviewWithRelations | null>;
  },

  findMany: async (
    where: ReviewWhereInput,
    params?: {
      skip?: number;
      take?: number;
      orderBy?: ReviewOrderByWithRelationInput;
    }
  ): Promise<ReviewWithRelations[]> => {
    const { skip, take, orderBy } = params || {};

    return prisma.review.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || defaultOrderBy,
      include: defaultIncludes,
    }) as Promise<ReviewWithRelations[]>;
  },

  findByPoemId: async (
    poemId: string,
    params?: {
      skip?: number;
      take?: number;
      orderBy?: ReviewOrderByWithRelationInput;
      where?: Omit<ReviewWhereInput, 'poemId'>;
    }
  ): Promise<ReviewWithRelations[]> => {
    const { skip, take, orderBy, where } = params || {};
    return reviewRepository.findMany({ poemId, ...where }, { skip, take, orderBy });
  },

  findByAuthorId: async (
    authorId: string,
    params?: {
      skip?: number;
      take?: number;
      orderBy?: ReviewOrderByWithRelationInput;
      where?: Omit<ReviewWhereInput, 'userId'>;
    }
  ): Promise<ReviewWithRelations[]> => {
    const { skip, take, orderBy, where } = params || {};
    return reviewRepository.findMany({ userId: authorId, ...where }, { skip, take, orderBy });
  },

  create: async (data: SimpleReviewCreateInput | ReviewCreateInput): Promise<Review> => {
    return prisma.review.create({
      data: data as ReviewCreateInput,
    });
  },

  update: async (
    id: string,
    data: SimpleReviewUpdateInput | ReviewUpdateInput
  ): Promise<Review> => {
    return prisma.review.update({
      where: { id },
      data: data as ReviewUpdateInput,
    });
  },

  delete: async (id: string): Promise<Review> => {
    return prisma.review.delete({
      where: { id },
    });
  },

  count: async (where?: ReviewWhereInput): Promise<number> => {
    return prisma.review.count({
      where,
    });
  },

  getAverageRating: async (): Promise<number | null> => {
    // TODO: Implement rating system when it's added to the schema
    // For now, return null as rating system is not yet implemented
    return null;
  },
};
