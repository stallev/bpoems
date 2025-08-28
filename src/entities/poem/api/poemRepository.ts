import { prisma } from '@/shared/api/database/prisma';
import type {
  Poem,
  PoemCreateInput,
  PoemUpdateInput,
  PoemOrderByWithRelationInput,
  PoemWhereInput,
  PoemWithRelations,
  SimplePoemCreateInput,
  SimplePoemUpdateInput,
} from '../model/types';

export const poemRepository = {
  findById: async (id: string): Promise<PoemWithRelations | null> => {
    return prisma.poem.findUnique({
      where: { id },
      include: {
        author: true,
        category: { include: { translatedName: true } },
        tags: true,
        statistics: true,
      },
    }) as Promise<PoemWithRelations | null>;
  },

  getBySlug: async (slug: string): Promise<PoemWithRelations | null> => {
    return prisma.poem.findUnique({
      where: { slug },
      include: {
        author: true,
        category: { include: { translatedName: true } },
        tags: true,
        statistics: true,
      },
    }) as Promise<PoemWithRelations | null>;
  },
  getPoemBySlugWithReviewsAndComments: async (slug: string): Promise<PoemWithRelations | null> => {
    return prisma.poem.findUnique({
      where: { slug },
      include: {
        author: true,
        category: { include: { translatedName: true } },
        tags: true,
        statistics: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            isApproved: true,
            status: true,
            claimReports: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    }) as Promise<PoemWithRelations | null>;
  },

  findAll: async (params?: {
    skip?: number;
    take?: number;
    orderBy?: PoemOrderByWithRelationInput;
    where?: PoemWhereInput;
  }): Promise<PoemWithRelations[]> => {
    const { skip, take, orderBy, where } = params || {};

    return prisma.poem.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        author: true,
        category: { include: { translatedName: true } },
        tags: true,
        statistics: true,
      },
    }) as unknown as Promise<PoemWithRelations[]>;
  },

  create: async (data: SimplePoemCreateInput | PoemCreateInput): Promise<Poem> => {
    if (!data.statistics) {
      data.statistics = {
        create: {
          views: 0,
          edits: 0,
          likes: 0,
          shares: 0,
        },
      };
    }

    return prisma.poem.create({
      data: data as PoemCreateInput,
    });
  },

  update: async (id: string, data: SimplePoemUpdateInput | PoemUpdateInput): Promise<Poem> => {
    return prisma.poem.update({
      where: { id },
      data: data as PoemUpdateInput,
    });
  },

  delete: async (id: string): Promise<Poem> => {
    return prisma.poem.delete({
      where: { id },
    });
  },

  incrementViews: async (poemId: string): Promise<void> => {
    const stats = await prisma.statistics.findFirst({ where: { poem: { id: poemId } } });
    if (!stats) {
      // If statistics don't exist, create them
      await prisma.statistics.create({
        data: { poem: { connect: { id: poemId } }, views: 1, edits: 0, likes: 0, shares: 0 },
      });
    } else {
      await prisma.statistics.update({
        where: { id: stats.id },
        data: { views: { increment: 1 } },
      });
    }
  },

  incrementEdits: async (poemId: string): Promise<void> => {
    const stats = await prisma.statistics.findFirst({ where: { poem: { id: poemId } } });
    if (stats) {
      await prisma.statistics.update({
        where: { id: stats.id },
        data: { edits: { increment: 1 } },
      });
    }
  },

  incrementLikes: async (poemId: string): Promise<void> => {
    const stats = await prisma.statistics.findFirst({ where: { poem: { id: poemId } } });
    if (stats) {
      await prisma.statistics.update({
        where: { id: stats.id },
        data: { likes: { increment: 1 } },
      });
    }
  },

  incrementShares: async (poemId: string): Promise<void> => {
    const stats = await prisma.statistics.findFirst({ where: { poem: { id: poemId } } });
    if (stats) {
      await prisma.statistics.update({
        where: { id: stats.id },
        data: { shares: { increment: 1 } },
      });
    }
  },

  // Methods for working with categories
  findByCategory: async (
    categoryId: string,
    params?: {
      skip?: number;
      take?: number;
    }
  ): Promise<PoemWithRelations[]> => {
    const { skip, take } = params || {};

    return prisma.poem.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      skip,
      take,
      include: {
        author: true,
        category: { include: { translatedName: true } },
        tags: true,
        statistics: true,
      },
    }) as unknown as Promise<PoemWithRelations[]>;
  },

  // Methods for working with tags
  findByTag: async (
    tagId: string,
    params?: {
      skip?: number;
      take?: number;
    }
  ): Promise<PoemWithRelations[]> => {
    const { skip, take } = params || {};

    return prisma.poem.findMany({
      where: {
        tags: {
          some: {
            id: tagId,
          },
        },
      },
      skip,
      take,
      include: {
        author: true,
        category: { include: { translatedName: true } },
        tags: true,
        statistics: true,
      },
    }) as unknown as Promise<PoemWithRelations[]>;
  },
};
