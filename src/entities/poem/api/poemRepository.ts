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
        category: true,
        tags: true,
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
        category: true,
        tags: true,
      },
    }) as unknown as Promise<PoemWithRelations[]>;
  },

  create: async (data: SimplePoemCreateInput | PoemCreateInput): Promise<Poem> => {
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
        category: true,
        tags: true,
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
        category: true,
        tags: true,
      },
    }) as unknown as Promise<PoemWithRelations[]>;
  },
};
