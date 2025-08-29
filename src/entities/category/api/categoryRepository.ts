import { prisma } from '@/shared/api/database/prisma';
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
  CategoryWithTranslation,
  CategoryWithRelations,
  CategoryStats,
  CategoryWhereInput,
} from '../model/types';

export const categoryRepository = {
  findById: async (id: string): Promise<CategoryWithRelations | null> => {
    return prisma.category.findUnique({
      where: { id },
      include: {
        translatedItems: true,
        poems: true,
      },
    }) as Promise<CategoryWithRelations | null>;
  },

  findBySlug: async (slug: string): Promise<CategoryWithRelations | null> => {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        translatedItems: true,
        poems: true,
      },
    }) as Promise<CategoryWithRelations | null>;
  },

  findAll: async (params?: {
    skip?: number;
    take?: number;
    orderBy?: any; // CategoryOrderByWithRelationInput; // This type is not imported
    where?: CategoryWhereInput;
  }): Promise<CategoryWithRelations[]> => {
    const { skip, take, orderBy, where } = params || {};

    return prisma.category.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        translatedItems: true,
        poems: true,
      },
    }) as unknown as Promise<CategoryWithRelations[]>;
  },

  create: async (data: CategoryCreateInput): Promise<any> => {
    return prisma.category.create({
      data,
    });
  },

  update: async (id: string, data: CategoryUpdateInput): Promise<any> => {
    // Category; // This type is not imported
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string): Promise<any> => {
    // Category; // This type is not imported
    return prisma.category.delete({
      where: { id },
    });
  },

  // Methods for working with translations
  findByTranslationType: async (
    type: string,
    params?: {
      skip?: number;
      take?: number;
    }
  ): Promise<CategoryWithRelations[]> => {
    const { skip, take } = params || {};

    return prisma.category.findMany({
      where: {
        translatedItems: {
          some: {
            type: type as any,
          },
        },
      },
      skip,
      take,
      include: {
        translatedItems: true,
        poems: true,
      },
    }) as unknown as Promise<CategoryWithRelations[]>;
  },

  // Methods for working with active/inactive status
  findActive: async (params?: {
    skip?: number;
    take?: number;
  }): Promise<CategoryWithRelations[]> => {
    const { skip, take } = params || {};

    return prisma.category.findMany({
      where: {
        isActive: true,
      },
      skip,
      take,
      include: {
        translatedItems: true,
        poems: true,
      },
    }) as unknown as Promise<CategoryWithRelations[]>;
  },

  // Dashboard methods
  findForDashboard: async (params?: {
    filter?: 'all' | 'active' | 'inactive';
  }): Promise<CategoryWithTranslation[]> => {
    const { filter } = params || {};

    const whereClause: CategoryWhereInput = {};

    if (filter === 'active') {
      whereClause.isActive = true;
    } else if (filter === 'inactive') {
      whereClause.isActive = false;
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        translatedItems: {
          where: {
            type: 'POEM_CATEGORY',
          },
        },
        _count: {
          select: {
            poems: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return categories.map(category => {
      const translatedItem = category.translatedItems.find(item => item.type === 'POEM_CATEGORY');
      return {
        id: category.id,
        isActive: category.isActive,
        order: category.order,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        name: (translatedItem?.values as { EN: string; RU: string; UA: string }) || {
          EN: '',
          RU: '',
          UA: '',
        },
        poemCount: category._count.poems,
      };
    });
  },

  getStats: async (): Promise<CategoryStats> => {
    const [totalCategories, activeCategories, inactiveCategories, categoriesWithPoems, totalPoems] =
      await Promise.all([
        prisma.category.count(),
        prisma.category.count({ where: { isActive: true } }),
        prisma.category.count({ where: { isActive: false } }),
        prisma.category.count({
          where: {
            poems: {
              some: {},
            },
          },
        }),
        prisma.poem.count(),
      ]);

    const averagePoemsPerCategory = totalCategories > 0 ? totalPoems / totalCategories : 0;

    return {
      totalCategories,
      activeCategories,
      inactiveCategories,
      categoriesWithPoems,
      averagePoemsPerCategory: Math.round(averagePoemsPerCategory * 100) / 100,
    };
  },

  // Additional methods for category management
  existsByName: async (
    name: string,
    language: 'EN' | 'RU' | 'UA',
    excludeId?: string
  ): Promise<boolean> => {
    // Get all categories with their translations
    const categories = await prisma.category.findMany({
      where: excludeId ? { id: { not: excludeId } } : {},
      include: {
        translatedItems: {
          where: {
            type: 'POEM_CATEGORY',
          },
        },
      },
    });

    // Check if any category has the given name in the specified language
    return categories.some(category => {
      const translatedItem = category.translatedItems.find(item => item.type === 'POEM_CATEGORY');
      if (!translatedItem) return false;
      const values = translatedItem.values as Record<string, string>;
      return values[language] === name;
    });
  },

  activate: async (id: string): Promise<void> => {
    await prisma.category.update({
      where: { id },
      data: { isActive: true },
    });
  },

  deactivate: async (id: string): Promise<void> => {
    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  },
};
